using System.ComponentModel.DataAnnotations;

namespace ReactNetCoreBase.Models.View {
  public class LoginRequest {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
