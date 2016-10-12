using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace ReactNetCoreBase.Data
{
    public class AppDbConfig : DbConfiguration
    {
        public static string ConnectionString;

        public AppDbConfig() {
            SetDatabaseInitializer<>
        }
    }
}
