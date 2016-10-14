using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ReactNetCoreBase.Infrastructure
{
  public class BusinessException : Exception
  {
    public object Options { get; set; }

    public BusinessException(string resource_key, object options = null) : base(resource_key)
    {
      this.Options = options;
    }
  }
}
