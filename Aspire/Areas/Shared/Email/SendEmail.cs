using System.Linq;
using System.Collections.Generic;
using Aspire.Configuration;
using MailKit.Net.Smtp;
using MediatR;
using MimeKit;
using MimeKit.Text;

namespace Aspire.Areas.Shared
{
  public class SendEmail : IRequest
  {
    public IEnumerable<string> ToEmailAddresses { get; }
    public string Subject { get; }
    public string Body { get; }
    public TextFormat BodyType { get; }

    public SendEmail(IEnumerable<string> toEmailAddresses, string subject, string body, TextFormat bodyType)
    {
      ToEmailAddresses = toEmailAddresses;
      Subject = subject;
      Body = body;
      BodyType = bodyType;
    }
  }

  public class SendEmailHandler : RequestHandler<SendEmail>
  {
    private readonly AppConfiguration _appConfiguration;

    private static readonly string AuthenticationMechanism = "XOAUTH2";

		private List<MailboxAddress> DevelopToAddress => new List<MailboxAddress>(1)
		{
			new MailboxAddress("Aspire - Development Override", _appConfiguration.EmailSettings.EmailAddress)
		}; 

    public SendEmailHandler(IAppConfiguration appConfiguration)
    {
      _appConfiguration = appConfiguration.GetAppConfiguration();
    }

    protected override void Handle(SendEmail message)
    {
      var emailConfig = _appConfiguration.GetAppConfiguration().EmailSettings;

      using (var client = new SmtpClient())
      {
        client.ServerCertificateValidationCallback = (s, c, h, e) => true;

        client.Connect(emailConfig.SmtpServerHost, emailConfig.SmtpServerPort, true);
        client.AuthenticationMechanisms.Remove(AuthenticationMechanism);
        client.Authenticate(emailConfig.EmailAddress, emailConfig.EmailAddressPassword);
        client.Send(GetMimeMessage(message));

        client.Disconnect(true);
      }
    }

    private MimeMessage GetMimeMessage(SendEmail message)
    {
      var mimeMessage = new MimeMessage();

			mimeMessage.To.AddRange(
				_appConfiguration.IsDevelop 
					? DevelopToAddress
					: message.ToEmailAddresses.Select(address => new MailboxAddress(address))
			);

			mimeMessage.From.Add(new MailboxAddress(_appConfiguration.EmailSettings.EmailAddressName, _appConfiguration.EmailSettings.EmailAddress));
			mimeMessage.Subject = message.Subject;
			mimeMessage.Body = new TextPart(message.BodyType)
			{
				Text = message.Body
			};

			return mimeMessage;
		}
  }
}