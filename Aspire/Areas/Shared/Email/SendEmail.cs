using Aspire.Configuration;
using MailKit.Net.Smtp;
using MediatR;
using MimeKit;

namespace Aspire.Areas.Shared
{
    public class SendEmail : IRequest
    {
        public MimeMessage MimeMessage { get; private set; }

        public SendEmail(MimeMessage mimeMessage)
		{
            MimeMessage = mimeMessage;
		}
    }

    public class SendEmailHandler : RequestHandler<SendEmail>
    {
        private readonly IEmailConfiguration _emailConfiguration;

        private static readonly string AuthenticationMechanism = "XOAUTH2";


        public SendEmailHandler(IEmailConfiguration emailConfiguration)
        {
            _emailConfiguration = emailConfiguration;
        }

        protected override void Handle(SendEmail message)
        {
            var emailConfig = _emailConfiguration.GetEmailSettings();

            using(var client = new SmtpClient())
            {
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                client.Connect(emailConfig.SmtpServerHost, emailConfig.SmtpServerPort, true);
                client.AuthenticationMechanisms.Remove(AuthenticationMechanism);
                client.Authenticate(emailConfig.EmailAddress, emailConfig.EmailAddressPassword);
                client.Send(message.MimeMessage);

                client.Disconnect(true); 
            }
        }
    }
}
