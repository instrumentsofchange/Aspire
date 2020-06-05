using System.Reflection;
using Aspire.Areas.Instruments.Configuration;
using Aspire.Areas.Instruments.Models;
using Aspire.Areas.Schedules.Configuration;
using Aspire.Areas.Students.Configuration;
using Aspire.Configuration;
using Aspire.Configuration.IoC;
using Aspire.Users.Configuration;
using Aspire.Areas.Shared.Utils;
using DapperExtensions.Mapper;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Aspire
{
  public class Startup
  {
    private readonly AppConfiguration _configuration = new AppConfiguration();

    public Startup(IConfiguration configuration, IWebHostEnvironment environment)
    {
      Configuration = configuration;

      Configuration.Bind(_configuration);

      _configuration.IsDevelop = environment.IsDevelopment();
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      var currentAssembly = typeof(Startup).GetTypeInfo().Assembly;

      services.AddControllers().AddJsonOptions(options => 
      {
        options.JsonSerializerOptions.Converters.Add(new AspireJsonStringEnumConverter());
      });
      // services.AddControllersWithViews();

      // In production, the React files will be served from this directory
      services.AddSpaStaticFiles(configuration =>
      {
        configuration.RootPath = "ClientApp/build";
      });

      // DapperExtensions.DapperExtensions.SetMappingAssemblies(new[] { typeof(Instrument).Assembly });

      #region Dependency Injection

      services.AddMediatR(currentAssembly);

      services.AddSingleton(_configuration);

      services.AddAppCofigurationExtensions();

      services.AddConnectionFactories();

      services.RegisterInstrumentsArea();

      services.AddEmailConfiguration();

      services.RegisterUsersArea();

      services.RegisterSchedulesArea();

      services.RegisterStudentsArea();

      #endregion
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseExceptionHandler("/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
      }

      app.UseMiddlewareExceptionHandler();

      app.UseHttpsRedirection();
      app.UseStaticFiles();
      app.UseSpaStaticFiles();

      app.UseRouting();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllerRoute(
                  name: "default",
                  pattern: "{controller}/{action=Index}/{id?}");
      });

      app.UseSpa(spa =>
      {
        spa.Options.SourcePath = "ClientApp";

        if (env.IsDevelopment())
        {
          spa.UseReactDevelopmentServer(npmScript: "start");
        }
      });
    }
  }
}
