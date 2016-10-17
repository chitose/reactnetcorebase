using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Threading.Tasks;
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
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using NLog;
using NLog.Config;
using ReactNetCoreBase.Configuration;
using ReactNetCoreBase.Data;
using ReactNetCoreBase.Data.Identity;
using ReactNetCoreBase.Infrastructure;
using ReactNetCoreBase.Infrastructure.Attributes;
using ReactNetCoreBase.Infrastructure.Security;
using ReactNetCoreBase.Models.Db;

namespace ReactNetCoreBase {
  public class Startup {
    private static Settings settings = new Settings();
    private static IHostingEnvironment s_env;
    public Startup(IHostingEnvironment env) {
      s_env = env;

      var builder = new ConfigurationBuilder()
          .SetBasePath(env.ContentRootPath)
          .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
          .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

      if (env.IsDevelopment()) {
        // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
        builder.AddUserSecrets();
      }

      builder.AddEnvironmentVariables();
      Configuration = builder.Build();

      Configuration.GetSection("Settings").Bind(settings);

      var logConfig = new XmlLoggingConfiguration(Path.Combine(env.ContentRootPath, "NLog.config"));
      LogManager.Configuration = logConfig;
      Loggers.Default.Info("Starting Web");
      AppDbConfig.ConnectionString = Configuration["ConnectionStrings:DefaultConnection"];
    }

    public IConfigurationRoot Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services) {
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
            cookie.AutomaticAuthenticate = true;
            cookie.AuthenticationScheme = "Cookies";
            //cookie.CookieSecure = CookieSecurePolicy.Always;
            //cookie.CookieName = "ReactNetCoreBase.Auth";
            //cookie.Events = new CookieAuthenticationEvents {
            //  OnRedirectToLogin = context => { context.Response.StatusCode = 401; return Task.CompletedTask; },
            //  OnRedirectToAccessDenied = context => { context.Response.StatusCode = 403; return Task.CompletedTask; }
            //};
          })
          .AddUserStore<UserStore<User, Role, ApplicationDbContext>>()
          .AddRoleStore<RoleStore<User, Role, ApplicationDbContext>>()
          .AddDefaultTokenProviders();

      services.AddMvc(options => {
        options.OutputFormatters.RemoveType<StringOutputFormatter>();
        //options.Filters.Add(new RequireHttpsAttribute());
        options.Filters.Add(new ResponseCacheFilter(new CacheProfile { NoStore = true }));
        options.Filters.Add(new ModelValidationFilter());
        options.Filters.Add(new ResultWrapperFilter());
        options.Filters.Add(new ExceptionFilter(s_env));
      });

      // node service for server-side rendering
      services.AddNodeServices();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory) {
      JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

      loggerFactory.AddConsole(Configuration.GetSection("Logging"));
      if (env.IsDevelopment()) {
        loggerFactory.AddDebug();
      }

      app.UseStaticFiles();

      app.UseIdentity();

      app.UseOpenIdConnectAuthentication(new OpenIdConnectOptions {
        ClientId = settings.ClientId,
        ClientSecret = settings.ClientSecret,
        Authority = "https://accounts.google.com",
        ResponseType = OpenIdConnectResponseType.CodeIdToken,
        AuthenticationScheme = "oidc",
        SignInScheme = "Cookies",
        GetClaimsFromUserInfoEndpoint = true,
        SaveTokens = true
      });

      app.UseMvc(routes => {
        routes.MapSpaFallbackRoute("spa-fallback", new { controller = "Home", action = "Index" });
      });
    }
  }
}
