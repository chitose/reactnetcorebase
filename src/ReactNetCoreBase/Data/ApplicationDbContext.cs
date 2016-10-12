using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using ReactNetCoreBase.Data.Identity;
using ReactNetCoreBase.Models.Db;

namespace ReactNetCoreBase.Data {

    [DbConfigurationType(typeof(AppDbConfig))]
    public class ApplicationDbContext : IdentityDbContext<User, Role> {
        private readonly int userId;

        public ApplicationDbContext(int userId) : base(AppDbConfig.ConnectionString) {
            Configuration.LazyLoadingEnabled = false;
            Configuration.UseDatabaseNullSemantics = true;
            this.userId = userId;
        }
    }
}
