using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Aspire.Configuration;
using Aspire.Users.Models;
using Dapper;

namespace Aspire.Users.Authentication
{
    public class AuthorizationService : IAuthorizationService
    {
        private readonly IIocDbConnectionFactory _iocDbConnectionFactory;

        public AuthorizationService(IIocDbConnectionFactory iocDbConnectionFactory)
        {
            _iocDbConnectionFactory = iocDbConnectionFactory;
        }

        public async Task<bool> AuthenticateUser(string username, string password)
        {
            const string authenticateSql = @"
                SELECT [PasswordHash]
                FROM [dbo].[User]
                WHERE [Username] = @Username
            ";

            using (var connection = _iocDbConnectionFactory.GetReadOnlyConnection())
            {
                var fullDatabasePasswordHash = await connection.QuerySingleOrDefaultAsync<string>(authenticateSql, new { Username = username });

                if(fullDatabasePasswordHash == null)
                {
                    //no user found (invalid username
                    return false;
                }

                var fullPasswordHashBytes = Convert.FromBase64String(fullDatabasePasswordHash);

                var passwordHashBytes = GetPasswordHash(fullPasswordHashBytes);

                var salt = GetPasswordHashSalt(fullPasswordHashBytes);

                var userInputPasswordHashBytes = new Rfc2898DeriveBytes(password, salt).GetBytes(20);

                return MatchPasswords(passwordHashBytes, userInputPasswordHashBytes);
            }
        }

        public string EncryptPassword(string plaintextPassword)
        {
            byte[] salt;

            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);

            var pbkdf2 = new Rfc2898DeriveBytes(plaintextPassword, salt);

            byte[] passwordHashBytes = pbkdf2.GetBytes(20);

            byte[] fullPasswordHashBytes = new byte[36];

            Array.Copy(salt, 0, fullPasswordHashBytes, 0, 16);
            Array.Copy(passwordHashBytes, 0, fullPasswordHashBytes, 16, 20);

            //return Encoding.Unicode.GetString(fullPasswordHashBytes, 0, fullPasswordHashBytes.Length);
            return Convert.ToBase64String(fullPasswordHashBytes);
        }

        public byte[] HashPassword(byte[] salt)
        {
            return new byte[1];
        }

        private byte[] GetPasswordHashSalt(byte[] fullPasswordHashBytes)
        {
            byte[] salt = new byte[16];

            for(int i = 0; i < 16; i++)
            {
                salt[i] = fullPasswordHashBytes[i];
            }

            return salt;
        }

        private byte[] GetPasswordHash(byte[] fullPasswordHashBytes)
        {
            byte[] password = new byte[20];

            for(int i = 0; i < 20; i++)
            {
                password[i] = fullPasswordHashBytes[i + 16];
            }

            return password;
        }


        private bool MatchPasswords(byte[] passwordOne, byte[] passwordTwo)
        {
            var result = true;

            for(int i = 0; i < 20; i++)
            {
                if(passwordOne[i] != passwordTwo[i])
                {
                    result = false;
                    break;
                }
            }

            return result;
        }
    }
}
