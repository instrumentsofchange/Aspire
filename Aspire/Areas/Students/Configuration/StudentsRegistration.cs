using Aspire.Areas.Students.Services;
using Aspire.Areas.Students.Services.Interfaces;
using Aspire.Configuration;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Aspire.Areas.Students.Configuration
{
    public static class StudentsRegistration
    {
        public static IServiceCollection RegisterStudentsArea(this IServiceCollection @this)
        {
            @this.AddTransient<IStudentService, StudentService>(sp =>
            {
                var iocDbConnectionFactory = sp.GetService<IIocDbConnectionFactory>();
                var appConfiguration = sp.GetService<IAppConfiguration>();
                var mediator = sp.GetService<IMediator>();

                return new StudentService(iocDbConnectionFactory, appConfiguration, mediator);
            });

            return @this;
        }
    }
}