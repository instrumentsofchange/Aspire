using Aspire.Areas.Users.Models;

namespace Aspire.Users.Models
{
    public class User
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public Role Role { get; set; }
        public string Email { get; set; }
        public Address Address { get; set; }
        public string Program { get; set; }
    }
}
