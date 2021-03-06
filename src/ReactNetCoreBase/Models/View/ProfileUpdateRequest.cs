﻿using System.ComponentModel.DataAnnotations;
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

    public string Password { get; set; }

    [MatchValidation(nameof(NewPasswordMatch))]
    [Password]
    public string NewPassword { get; set; }

    [MatchValidation(nameof(NewPassword))]
    public string NewPasswordMatch { get; set; }

    [MaxLength(30)]
    public string Phone { get; set; }

    [MaxLength(256)]
    [NullableEmailValidation]
    public string Email { get; set; }

    [BinaryImage]
    public byte[] Image { get; set; }
  }
}
