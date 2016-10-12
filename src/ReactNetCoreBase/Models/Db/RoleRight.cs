using ReactNetCoreBase.Models.Enum;

namespace ReactNetCoreBase.Models.Db
{
    public class RoleRight
    {
        public int Id { get; set; }

        public int RoleId { get; set; }

        public Right Right { get; set; }
    }
}
