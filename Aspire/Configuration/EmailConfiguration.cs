namespace Aspire.Configuration
{
  public class EmailConfiguration : IEmailConfiguration
  {
    public EmailSettings EmailSettings { get; private set; }

    public EmailConfiguration(EmailSettings emailSettings)
    {
      EmailSettings = emailSettings;
    }

    public EmailSettings GetEmailSettings()
    {
      return EmailSettings;
    }
  }
}