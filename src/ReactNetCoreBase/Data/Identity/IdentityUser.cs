using System;
using System.ComponentModel.DataAnnotations;
using ReactNetCoreBase.Models.Db;

namespace ReactNetCoreBase.Data.Identity {
    public class IdentityUser<TRole> : Base
    {
        public IdentityUser() {

        }

        public IdentityUser(string userName) : this() {

        }

        [Required, MaxLength(256)]
        public virtual string UserName { get; set; }

        [Required, MaxLength(100)]
        public string FirstName { get; set; }

        [Required, MaxLength(100)]
        public string LastName { get; set; }

        [Required]
        public int RoleId { get; set; }

        public TRole Role { get; set; }        

        public virtual string PasswordHash { get; set; }

        /// <summary>
        /// A random value that must change whenever a user credentials change
        /// </summary>
        public virtual string SecurityStamp { get; set; }
        

        /// <summary>
        /// Gets or sets the date and time, in UTC, when any user lockout ends.
        /// </summary>
        /// <remarks>
        /// A value in the past means the user is not locked out.
        /// </remarks>
        public virtual DateTimeOffset? LockoutEnd { get; set; }

        /// <summary>
        /// Gets or sets a flag indicating if this user is locked out.
        /// </summary>
        /// <value>True if the user is locked out, otherwise false.</value>
        public virtual bool LockoutEnabled { get; set; }

        /// <summary>
        /// Gets or sets the number of failed login attempts for the current user.
        /// </summary>
        public virtual int AccessFailedCount { get; set; }
    }
}
