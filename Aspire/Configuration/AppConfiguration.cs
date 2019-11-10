namespace Aspire.Configuration
{
    public class AppConfiguration
    {
        public AppSettings AppSettings { get; set; }
        public ConnectionStrings ConnectionStrings { get; set; }
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
}
