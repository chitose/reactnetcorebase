using System.ComponentModel.DataAnnotations;

namespace ReactNetCoreBase.Models.View {
  public class LoginRequest {
        [Required]
        public string UserName { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }
    }
}
