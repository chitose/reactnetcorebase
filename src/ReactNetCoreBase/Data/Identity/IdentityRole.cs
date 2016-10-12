using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ReactNetCoreBase.Models.Db;

namespace ReactNetCoreBase.Data.Identity {
    public class IdentityRole
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public virtual ICollection<RoleRight> Rights { get; set; }
    }
}
