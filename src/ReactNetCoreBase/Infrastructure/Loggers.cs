using NLog;

namespace ReactNetCoreBase.Infrastructure {
    public static class Loggers {
        public static readonly Logger Authentication;
        public static readonly Logger Default;
        public static readonly Logger Sql;

        static Loggers() {
            Authentication = LogManager.GetLogger("AUTH");
            Default = LogManager.GetLogger("WEB");
            Sql = LogManager.GetLogger("SQL");
        }
    }
}
