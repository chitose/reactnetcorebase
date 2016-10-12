using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReactNetCoreBase.Data.Identity;
using ReactNetCoreBase.Infrastructure.Attributes;

namespace ReactNetCoreBase.Models.Db
{
    public class User : IdentityUser<Role>
    {
        [OptionalTypeScriptProperty]
        public string DisplayName {
            get {
                return $"{LastName} {FirstName}";
            }
        }
    }
}
