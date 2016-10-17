using System.Data.Entity;
using System.Data.Entity.SqlServer;

namespace ReactNetCoreBase.Data
{
  public class AppDbConfig : DbConfiguration
  {
    public static string ConnectionString;

    public AppDbConfig()
    {
      SetDatabaseInitializer<ApplicationDbContext>(null);
      SetProviderServices("System.Data.SqlClient", SqlProviderServices.Instance);
    }
  }
}
