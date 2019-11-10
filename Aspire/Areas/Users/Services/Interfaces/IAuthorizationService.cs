using System.Threading.Tasks;

namespace Aspire.Users.Authentication
{
    public interface IAuthorizationService
    {
        Task<bool> AuthenticateUser(string username, string password);
        string EncryptPassword(string plaintextPassword);
    }
}
