using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using ReactNetCoreBase.Infrastructure;

namespace ReactNetCoreBase.Configuration
{
  public static class ConfigurationExtensions
  {
    public static IConfigurationBuilder AddEnvironmentConfig(this IConfigurationBuilder config, string filename, string basePath)
    {
      // We want to be able to read config one level higher than the deployed package
      // Note that for security reasons, PhysicalFileProvider does not accept relative paths that
      // navigates out of the root path, such as '..\envsettings.json'
      config.AddJsonFile(provider: new PhysicalFileProvider(Path.Combine(basePath, "..")),
                         path: filename,
                         optional: true,
                         reloadOnChange: true);
      return config;
    }

    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder app, SecurityHeadersBuilder builder)
    {
      SecurityHeaderPolicy policy = builder.Build();
      return app.UseMiddleware<SecurityHeaderMiddleWare>(policy);
    }
  }
}
