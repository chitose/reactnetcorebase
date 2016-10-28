namespace ReactNetCoreBase.Infrastructure
{
  public class SecurityHeadersBuilder
  {
    private readonly SecurityHeaderPolicy _policy = new SecurityHeaderPolicy();

    public SecurityHeadersBuilder AddDefaultSecurePolicy()
    {
      AddCustomHeader("X-Frame-Options", "deny");
      AddCustomHeader("X-XSS-Protection", "1; mode=block");
      
      //RemoveHeader("X-Powered-By");
      // remove by web.config
      return this;
    }

    public SecurityHeadersBuilder AddCustomHeader(string header, string value)
    {
      _policy.SetHeaders[header] = value;
      return this;
    }

    public SecurityHeadersBuilder RemoveHeader(string header)
    {
      _policy.RemoveHeaders.Add(header);
      return this;
    }

    public SecurityHeaderPolicy Build()
    {
      return _policy;
    }
  }
}
