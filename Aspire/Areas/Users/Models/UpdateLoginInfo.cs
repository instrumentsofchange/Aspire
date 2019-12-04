namespace Aspire.Areas.Users.Models
{
    public class UpdateLoginInfo
    {
        public string OldUsername { get; set; }
        public string NewUsername { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
