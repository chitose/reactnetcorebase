using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ReactNetCoreBase.Infrastructure
{
  public class SecurityHeaderMiddleWare
  {
    private readonly RequestDelegate _next;
    private readonly SecurityHeaderPolicy _policy;
    public SecurityHeaderMiddleWare(RequestDelegate next, SecurityHeaderPolicy policy)
    {
      _next = next;
      _policy = policy;
    }

    public async Task Invoke(HttpContext context)
    {
      IHeaderDictionary headers = context.Response.Headers;
      foreach (var headerPair in _policy.SetHeaders)
      {
        if (!headers.ContainsKey(headerPair.Key))
        {
          headers[headerPair.Key] = headerPair.Value;
        }
      }
      foreach (var header in _policy.RemoveHeaders)
      {
        headers.Remove(header);
      }
      await _next(context);
    }
  }
}
