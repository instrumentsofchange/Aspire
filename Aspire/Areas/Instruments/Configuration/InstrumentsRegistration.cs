using Aspire.Areas.Instruments.Services;
using Aspire.Areas.Instruments.Services.Interfaces;
using Aspire.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Aspire.Areas.Instruments.Configuration
{
    public static class InstrumentsRegistration
    {
        public static IServiceCollection RegisterInstrumentsArea(this IServiceCollection @this)
        {
            @this.AddTransient<IInstrumentService, InstrumentService>(sp => 
            {
                var iocDbConnectionFactory = sp.GetService<IIocDbConnectionFactory>();

                return new InstrumentService(iocDbConnectionFactory);
            });

            return @this;
        }
    }
}