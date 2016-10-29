using System;
using System.IO;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NLog;
using NLog.Config;
using ReactNetCoreBase.Configuration;
using ReactNetCoreBase.Data;
using ReactNetCoreBase.Data.Identity;
using ReactNetCoreBase.Infrastructure;
using ReactNetCoreBase.Infrastructure.Attributes;
using ReactNetCoreBase.Infrastructure.Security;
using ReactNetCoreBase.Models.Db;
using ReactNetCoreBase.Models.Map;

namespace ReactNetCoreBase
{
  public class Startup
  {
    private static Settings settings = new Settings();
    private static IHostingEnvironment s_env;
    private static MapperConfiguration s_mapConfiguration;
    public Startup(IHostingEnvironment env)
    {
      s_env = env;

      var logConfig = new XmlLoggingConfiguration(Path.Combine(env.ContentRootPath, "NLog.config"));
      LogManager.Configuration = logConfig;
      Loggers.Default.Info($"Starting Web - mode: {env.EnvironmentName}");

      var builder = new ConfigurationBuilder()
          .SetBasePath(env.ContentRootPath)
          .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
          .AddJsonFile($"appsettings.{env.EnvironmentName.Trim()}.json", optional: true);

      if (env.IsDevelopment())
      {
        builder.AddUserSecrets();
      }

      builder.AddEnvironmentVariables();
      Configuration = builder.Build();

      Configuration.GetSection("Settings").Bind(settings);

      AppDbConfig.ConnectionString = Configuration["ConnectionStrings:DefaultConnection"];

      Loggers.Default.Info($"Data connection: {AppDbConfig.ConnectionString}");

      s_mapConfiguration = new MapperConfiguration(cfg => {
        cfg.AddProfile<MapConfigurationProfile>();
      });
    }

    public IConfigurationRoot Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      Loggers.Default.Info("WEB Configuring services");
      services
          .Configure<Settings>(Configuration.GetSection("Settings"))
          .AddSingleton<IAuthorizationPolicyProvider, ClaimPolicyProvider>()
          .AddScoped(provider => {
            var user = provider.GetService<IHttpContextAccessor>()?.HttpContext?.User;
            return new ApplicationDbContext(user.GetId(), user.GetFullName());
          })
          .AddIdentity<User, Role>(options => {
            var cookie = options.Cookies.ApplicationCookie;
            cookie.AuthenticationScheme = "Cookies";
            cookie.ExpireTimeSpan = TimeSpan.FromHours(1);
            cookie.CookieName = "ReactNetCoreBase.Auth";
            cookie.Events = new CookieAuthenticationEvents {
              OnRedirectToLogin = context => { context.Response.StatusCode = 401; return Task.CompletedTask; },
              OnRedirectToAccessDenied = context => { context.Response.StatusCode = 403; return Task.CompletedTask; }
            };
          })
          .AddUserStore<UserStore<User, Role, ApplicationDbContext>>()
          .AddRoleStore<RoleStore<User, Role, ApplicationDbContext>>()
          .AddDefaultTokenProviders();

      services.AddMvc(options => {
        options.OutputFormatters.RemoveType<StringOutputFormatter>();
        options.Filters.Add(new ResponseCacheFilter(new CacheProfile { NoStore = true }));
        options.Filters.Add(new ModelValidationFilter());
        options.Filters.Add(new ResultWrapperFilter());
        options.Filters.Add(new ExceptionFilter(s_env));
      });

      services.AddSingleton(sp => s_mapConfiguration.CreateMapper());

      // node service for server-side rendering
      //services.AddNodeServices();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
      loggerFactory.AddConsole(Configuration.GetSection("Logging"));
      if (env.IsDevelopment())
      {
        loggerFactory.AddDebug();
      }

      app.UseSecurityHeaders(new SecurityHeadersBuilder().AddDefaultSecurePolicy());

      app.UseStaticFiles();

      app.UseIdentity();

      app.UseMvc(routes => {
        routes.MapSpaFallbackRoute("spa-fallback", new { controller = "Home", action = "Index" });
      });
    }
  }
}
