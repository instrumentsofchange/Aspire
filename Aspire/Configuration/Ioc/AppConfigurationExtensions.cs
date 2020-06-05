using Microsoft.Extensions.DependencyInjection;

namespace Aspire.Configuration
{
    public static class AppConfigurationExtensions
    {
        public static IServiceCollection AppCofigurationExtensions(this IServiceCollection @this)
		{
            @this.AddSingleton<IAppConfiguration>(sp =>
            {
                var configuration = sp.GetService<AppConfiguration>();

                return configuration;
            });

            return @this;
        }
    }
}
