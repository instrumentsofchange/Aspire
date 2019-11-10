using System;
namespace Aspire.Areas.Users.Exceptions
{
    public class EmailNotAvailableException : Exception
    {
        public EmailNotAvailableException(string email)
            : base($"Email {email} is not available") { }
    }
}
