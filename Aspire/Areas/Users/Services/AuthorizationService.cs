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

                var result = true;

                if(fullDatabasePasswordHash != null)
                {
                    //get the salt from the saved password
                    var passwordHashBytes = Convert.FromBase64String(fullDatabasePasswordHash);

                    byte[] salt = new byte[16];

                    Array.Copy(passwordHashBytes, 0, salt, 0, 16);

                    //convert the user inputted password into hash (byte[])
                    var pbkdf2 = new Rfc2898DeriveBytes(password, salt);

                    var userInputtedPasswordHash = pbkdf2.GetBytes(20);

                    //check if each password hash is equal byte by byte
                    byte[] databasePasswordHash = new byte[20];

                    Array.Copy(passwordHashBytes, 16, databasePasswordHash, 0, 20);

                    for(int i = 0; i < 20; i++)
                    {
                        if(userInputtedPasswordHash[i] != databasePasswordHash[i])
                        {
                            result = false;
                            break;
                        }
                    }
                }

                return result;
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
    }
}
