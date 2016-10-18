using System.Collections.Generic;

namespace ReactNetCoreBase.Infrastructure
{
  public class SecurityHeaderPolicy
  {
    public IDictionary<string, string> SetHeaders { get; }
      = new Dictionary<string, string>();
    public ISet<string> RemoveHeaders { get; }
      = new HashSet<string>();
  }
}
