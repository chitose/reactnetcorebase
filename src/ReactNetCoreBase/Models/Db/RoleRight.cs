using ReactNetCoreBase.Models.Enum;

namespace ReactNetCoreBase.Models.Db {
    public class RoleRight : Base
    {
        public int RoleId { get; set; }

        public Right Right { get; set; }
    }
}
