using System;
using System.Data;
using System.Threading.Tasks;
using Aspire.Areas.Users.Exceptions;
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
                WHERE [UserName] = @Username
            ";

            using(var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                return await connection.QuerySingleAsync<User>(sql, new { Username = username });
            }
        }

        private async Task<User> CreateUserDefaults(User user)
        {
            user.Username = char.ToLower(user.FirstName[0]) + user.LastName.ToLower();

            var available = await GetUsernameAvailability(user.Username);

            if (!available)
            {
                user.Username = user.FirstName + user.LastName;

                available = await GetUsernameAvailability(user.Username);

                if (!available)
                {
                    user.Username = user.Email;
                }
            }

            return user;
        }
    }
}
