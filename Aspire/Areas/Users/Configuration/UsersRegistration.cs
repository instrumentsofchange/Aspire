using Aspire.Areas.Users.Services;
using Aspire.Areas.Users.Services.Interfaces;
using Aspire.Configuration;
using Aspire.Users.Authentication;
using Microsoft.Extensions.DependencyInjection;

namespace Aspire.Users.Configuration
{
    public static class UsersRegistration
    {
        public static IServiceCollection RegisterUsersArea(this IServiceCollection @this)
        {
            @this.AddTransient<IAuthorizationService, AuthorizationService>(sp =>
            {
                var iocDbConnectionFactory = sp.GetService<IIocDbConnectionFactory>();

                return new AuthorizationService(iocDbConnectionFactory);
            });

            @this.AddTransient<IUserService, UserService>(sp =>
            {
                var authorizationService = sp.GetService<IAuthorizationService>();
                var iocDbConnectionFactory = sp.GetService<IIocDbConnectionFactory>();

                return new UserService(authorizationService, iocDbConnectionFactory);
            });

            return @this;
        }
    }
}
