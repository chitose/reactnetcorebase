using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReactNetCoreBase.Data.Identity;

namespace ReactNetCoreBase.Models.Db
{
    public class User : IdentityUser<Role>
    {
    }
}
