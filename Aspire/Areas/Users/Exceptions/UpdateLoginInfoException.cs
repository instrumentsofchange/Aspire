using System;
namespace Aspire.Areas.Users.Exceptions
{
    public class UpdateLoginInfoException : Exception
    {
        private static readonly string defaultMessage = "There was an error updating Login Info";

        private static readonly string prefixCustomMessage = "Failed to update Login Info:";

        public UpdateLoginInfoException()
            : base(defaultMessage) { }

        public UpdateLoginInfoException(string message)
            : base($"{prefixCustomMessage} {message}") { }
    }
}
