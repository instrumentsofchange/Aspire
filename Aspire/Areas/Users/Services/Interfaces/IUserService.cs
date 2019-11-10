using System.Threading.Tasks;
using Aspire.Users.Models;

namespace Aspire.Areas.Users.Services.Interfaces
{
    public interface IUserService
    {
        Task<bool> CreateUser(User user);
        Task<bool> GetUsernameAvailability(string username);
        Task<bool> GetEmailAvailability(string email);
        Task<User> GetUser(string username);
    }
}
