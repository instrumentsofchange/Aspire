namespace Aspire.Configuration
{
    public class AppConfiguration : IAppConfiguration
    {
        public AppSettings AppSettings { get; set; }
        public ConnectionStrings ConnectionStrings { get; set; }
        public EmailSettings EmailSettings { get; set; }
        public bool IsDevelop { get; set; }

        public AppConfiguration GetAppConfiguration()
        {
            return this;
        }
    }

    public class AppSettings
    {
        public string Secret { get; set; }
    }

    public class ConnectionStrings
    {
        public string IocDbReadOnly { get; set; }
        public string IocDbReadWrite { get; set; }
    }

    public class EmailSettings
    {
        public string EmailAddress { get; set; }
        public string EmailAddressName { get; set; }
        public string SmtpServerHost { get; set; }
        public int SmtpServerPort { get; set; }
        public string EmailAddressPassword { get; set; }
    }
}
