using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using ReactNetCoreBase.Data.Identity;
using ReactNetCoreBase.Models.Db;

namespace ReactNetCoreBase.Data
{

  [DbConfigurationType(typeof(AppDbConfig))]
  public class ApplicationDbContext : IdentityDbContext<User, Role>
  {
    private readonly int userId;
    private readonly string name;
    public ApplicationDbContext(int userId, string name) : base(AppDbConfig.ConnectionString)
    {
      Configuration.LazyLoadingEnabled = false;
      Configuration.UseDatabaseNullSemantics = true;
      this.userId = userId;
      this.name = name;
    }

    protected override void OnModelCreating(DbModelBuilder builder)
    {
      builder.Conventions.Remove<PluralizingTableNameConvention>();
      builder.Conventions.Add(new RowVersionConvention());
    }
  }
}
