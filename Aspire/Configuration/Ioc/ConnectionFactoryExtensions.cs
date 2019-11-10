using Microsoft.Extensions.DependencyInjection;

namespace Aspire.Configuration.IoC
{
    public static class ConnectionFactoryExtension
    {
        public static IServiceCollection AddConnectionFactories(this IServiceCollection @this)
        {
            @this.AddSingleton<IIocDbConnectionFactory>(sp =>
            {
                var configuration = sp.GetService<AppConfiguration>();

                return new IocDbConnectionFactory(configuration.ConnectionStrings.IocDbReadOnly, configuration.ConnectionStrings.IocDbReadWrite);
            });

            return @this;
        }
    }
}
