using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ReactNetCoreBase.Data.Validation;
using ReactNetCoreBase.Infrastructure.Attributes;

namespace ReactNetCoreBase.Models.View {
  public class ProfileUpdateRequest {

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; }

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; }

    [MatchValidation(nameof(PasswordMatch))]
    public string Password { get; set; }

    [MatchValidation(nameof(Password))]
    public string PasswordMatch { get; set; }

    [MaxLength(30)]
    public string Phone { get; set; }

    [MaxLength(256)]
    [NullableEmailValidation]
    public string Email { get; set; }

    [BinaryImage]
    public byte[] Image { get; set; }
  }
}
