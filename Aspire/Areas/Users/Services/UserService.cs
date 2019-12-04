using System;
using System.Data;
using System.Threading.Tasks;
using Aspire.Areas.Shared.Extensions;
using Aspire.Areas.Users.Exceptions;
using Aspire.Areas.Users.Models;
using Aspire.Areas.Users.Services.Interfaces;
using Aspire.Configuration;
using Aspire.Users.Authentication;
using Aspire.Users.Models;
using Dapper;

namespace Aspire.Areas.Users.Services
{
    public class UserService : IUserService
    {
        private readonly IAuthorizationService _authorizationService;
        private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

        public UserService(IAuthorizationService authorizationService, IIocDbConnectionFactory iocDbConnectionFactory)
        {
            _authorizationService = authorizationService;
            _iocDbConnectionFactory = iocDbConnectionFactory;
        }

        public async Task<bool> CreateUser(User user)
        {
            var emailAvailable = await GetEmailAvailability(user.Email);

            if(!emailAvailable)
            {
                throw new EmailNotAvailableException(user.Email);
            }

            user = await CreateUserDefaults(user);

            //save user
            var defaultPassword = _authorizationService.EncryptPassword($"{user.FirstName.ToLower()}{user.LastName.ToLower()}");

            using (var connection = _iocDbConnectionFactory.GetReadWriteConnection())
            {
                var queryParameters = new
                {
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    Role = user.Role.ToString().ToUpper(),
                    user.Username,
                    PasswordHash = defaultPassword,
                    user.Address.AddressOne,
                    user.Address.AddressTwo,
                    user.Address.City,
                    user.Address.State,
                    user.Address.ZipCode,
                    user.Program
                };

                try
                {
                    return await connection.QuerySingleAsync<int>("[dbo].[sto_create_user]", queryParameters, commandType: CommandType.StoredProcedure) > 0;
                }
                catch(Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task<bool> GetUsernameAvailability(string username)
        {
            const string sql = @"
                SELECT COUNT(*)
                FROM [dbo].[User]
                WHERE [Username] = @Username
            ";

            var queryParameters = new
            {
                Username = username
            };

            using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                return await connection.QuerySingleAsync<int>(sql, queryParameters) == 0;
            }
        }

        public async Task<bool> GetEmailAvailability(string email)
        {
            const string sql = @"
                SELECT COUNT(*)
                FROM [dbo].[User]
                WHERE [Email] = @Email
            ";

            var queryParameters = new
            {
                Email = email
            };

            using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                return await connection.QuerySingleAsync<int>(sql, queryParameters) == 0;
            }
        }

        public async Task<User> GetUser(string username)
        {
            const string sql = @"
                SELECT
                [FirstName],
                [LastName],
                [UserName],
                CASE
                    WHEN role.[Description] = 'ADMIN' THEN 0
                    WHEN role.[Description] = 'DIRECTOR' THEN 1
                    WHEN role.[Description] = 'STUDENT' THEN 2
                END AS [Role],
                [eMail]
                FROM [dbo].[User] [user]
                INNER JOIN [dbo].[Role] role ON role.[RoleId] = [user].[RoleId]
                WHERE [UserName] = @Username;

                SELECT
                    address.[AddressOne],
                    address.[AddressTwo],
                    address.[State],
                    address.[city],
                    address.[ZipCode]
                FROM [dbo].[Address] address
                INNER JOIN [dbo].[User] u ON u.[AddressId] = address.[AddressId]
                WHERE u.[UserName] = @Username;
            ";

            using (var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                using (var multi = await connection.QueryMultipleAsync(sql, new { Username = username }))
                {
                    var user = await multi.ReadFirstOrDefaultAsync<User>();
                    user.Address = await multi.ReadSingleOrDefaultAsync<Address>();

                    return user;
                }
            }
        }

        public async Task<bool> UpdateUser(User user)
        {
            const string sql = @"
                DECLARE @RowCount INT = 0;

                UPDATE [dbo].[User]
                SET
                    [FirstName] = @FirstName,
                    [LastName] = @LastName,
                    [UserName] = @Username,
                    [eMail] = @email
                WHERE [UserName] = @Username;

                SET @RowCount = @@ROWCOUNT;

                UPDATE address
                SET
                    [AddressOne] = @AddressOne,
                    [AddressTwo] = @AddressTwo,
                    [State] = @State,
                    [city] = @City,
                    [ZipCode] = @ZipCode
                FROM [dbo].[Address] address
                INNER JOIN [dbo].[User] u ON u.[AddressId] = address.[AddressId]
                WHERE u.[Username] = @Username;

                SET @RowCount += @@ROWCOUNT;

                SELECT @RowCount;
            ";

            var queryParams = new
            {
                user.FirstName,
                user.LastName,
                user.Username,
                user.Email,
                user.Address.AddressOne,
                user.Address.AddressTwo,
                user.Address.State,
                user.Address.City,
                user.Address.ZipCode
            };

            using(var connection = _iocDbConnectionFactory.GetReadWriteConnection())
            {
                return await connection.QuerySingleAsync<int>(sql, queryParams) == 2;
            }
        }

        public async Task<bool> UpdateUserLoginInfo(UpdateLoginInfo newLoginInfo)
        {
            //validate that the current password is correct
            if (!newLoginInfo.NewPassword.IsNullOrEmpty())
            {
                var oldCredentialsValid = await _authorizationService.AuthenticateUser(newLoginInfo.OldUsername, newLoginInfo.OldPassword);

                if (!oldCredentialsValid)
                {
                    throw new UpdateLoginInfoException("Current Password is incorrect");
                }

                var newPasswordHashBytes = _authorizationService.EncryptPassword(newLoginInfo.NewPassword);

                var passwordUpdateSuccess = await UpdatePassword(newPasswordHashBytes, newLoginInfo.OldUsername);

                if (!passwordUpdateSuccess)
                {
                    throw new UpdateLoginInfoException();
                }
            }

            //Validate that the new username is available
            if (!newLoginInfo.NewUsername.IsNullOrEmpty())
            {
                var usernameAvailable = await GetUsernameAvailability(newLoginInfo.NewUsername);

                if(!usernameAvailable)
                {
                    throw new UpdateLoginInfoException("New username is not available");
                }

                var usernameUpdateSuccess = await UpdateUsername(newLoginInfo.NewUsername, newLoginInfo.OldUsername);

                if(!usernameUpdateSuccess)
                {
                    throw new UpdateLoginInfoException();
                }
            }

            return true;
        }

        private async Task<bool> UpdateUsername(string newUsername, string oldUsername)
        {
            var updateUsernameSql = @"
                UPDATE [dbo].[User]
                SET
                    [UserName] = @NewUsername
                WHERE [UserName] = @OldUsername

                SELECT @@ROWCOUNT;
            ";

            using(var connection = _iocDbConnectionFactory.GetReadWriteConnection())
            {
                return await connection.QuerySingleAsync<int>(
                    updateUsernameSql,
                    new
                    {
                        NewUsername = newUsername,
                        OldUsername = oldUsername
                    }) == 1;
            }
        }

        private async Task<bool> UpdatePassword(string newPasswordHashBytes, string username)
        {
            var sql = @"
                UPDATE [dbo].[User]
                SET [PasswordHash] = @NewPassword
                WHERE [UserName] = @Username;

                SELECT @@ROWCOUNT;
            ";

            using(var connection = _iocDbConnectionFactory.GetReadWriteConnection())
            {
                return await connection.QuerySingleAsync<int>(
                    sql,
                    new
                    {
                        NewPassword = newPasswordHashBytes,
                        Username = username
                    }) == 1;
            }
        }

        private async Task<User> CreateUserDefaults(User user)
        {
            user.Username = char.ToLower(user.FirstName[0]) + user.LastName.ToLower();

            var available = await GetUsernameAvailability(user.Username);

            if (!available)
            {
                user.Username = user.Email;
            }

            return user;
        }
    }
}
