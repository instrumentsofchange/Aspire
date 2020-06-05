using Microsoft.Extensions.DependencyInjection;

namespace Aspire.Configuration.IoC
{
  public static class EmailConfigurationExtensions
  {
    public static IServiceCollection AddEmailConfiguration(this IServiceCollection @this)
    {
      @this.AddSingleton<IEmailConfiguration>(sp =>
      {
        var configuration = sp.GetService<AppConfiguration>();

        return new EmailConfiguration(configuration.EmailSettings);
      });

      return @this;
    }
  }
}