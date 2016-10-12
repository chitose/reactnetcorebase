using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReactNetCoreBase.Models.Enum;

namespace ReactNetCoreBase.Models.View
{
  public class LoginResponse
  {
    public string UserName { get; set; }
    public IEnumerable<Right> Rights { get; set; }
    public string DisplayName { get; set; }
    public string CsrfToken { get; set; }
  }
}
