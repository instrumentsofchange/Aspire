using Aspire.Areas.Schedules.Services;
using Aspire.Areas.Schedules.Services.Interfaces;
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

            @this.AddTransient<IAttendanceService, AttendanceService>(sp =>
            {
                var iocDbConnectionFactory = sp.GetService<IIocDbConnectionFactory>();

                return new AttendanceService(iocDbConnectionFactory);
            });

            return @this;
        }
    }
}
