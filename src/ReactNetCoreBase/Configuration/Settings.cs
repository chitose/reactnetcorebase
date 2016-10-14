using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace ReactNetCoreBase.Configuration
{
  public class Settings
  {
    public Settings()
    {
      PasswordOptions = new PasswordOptions();
    }

    public PasswordOptions PasswordOptions { get; set; }
  }
}