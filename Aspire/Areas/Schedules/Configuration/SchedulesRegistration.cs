using Aspire.Areas.Schedules.Services;
using Aspire.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Aspire.Areas.Schedules.Configuration
{
    public static class SchedulesRegistration
    {
        public static IServiceCollection RegisterSchedulesArea(this IServiceCollection @this)
        {
            @this.AddTransient<IScheduleService, ScheduleService>(sp =>
            {
                var iocDbConnectionFactory = sp.GetService<IIocDbConnectionFactory>();

                return new ScheduleService(iocDbConnectionFactory);
            });

            return @this;
        }
    }
}
