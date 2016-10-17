using System.Data.Entity.ModelConfiguration.Conventions;
using ReactNetCoreBase.Models.Db;

namespace ReactNetCoreBase.Data
{
  internal class RowVersionConvention : Convention
  {
    public RowVersionConvention()
    {
      Properties<byte[]>().Where(p => p.Name == nameof(Base.RowVersion))
        .Configure(c => c.IsRowVersion());
    }
  }
}