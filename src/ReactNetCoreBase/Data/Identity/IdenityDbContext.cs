using System.Data.Entity;
using System.Data.Entity.Infrastructure;

namespace ReactNetCoreBase.Data.Identity
{
    public class IdentityDbContext<TUser, TRole> : DbContext
      where TUser : IdentityUser<TRole>
      where TRole : class
    {
        public IdentityDbContext(string nameOrConnectionString)
            : base(nameOrConnectionString) { }

        public IdentityDbContext(DbCompiledModel model) : base(model) { }

        public IdentityDbContext(string nameOrConnectionString, DbCompiledModel model) : base(nameOrConnectionString, model) { }

        public DbSet<TUser> Users { get; set; }
        public DbSet<TRole> Roles { get; set; }
    }
}