using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;
using ReactNetCoreBase.Configuration;
using Microsoft.Extensions.Configuration;

namespace ReactNetCoreBase.Models.View
{
  internal class PasswordAttribute : ValidationAttribute
  {
    private readonly Settings m_settings;

    public PasswordAttribute() : base()
    {
      m_settings = Startup.settings;
    }

    protected override ValidationResult IsValid(object value, ValidationContext context)
    {
      if (string.IsNullOrEmpty(value?.ToString()))
        return ValidationResult.Success;
      var password = value.ToString();
      if (password.Length < this.m_settings.PasswordOptions.RequiredLength)
        return new ValidationResult($"Password length invalid");
      if (m_settings.PasswordOptions.RequireDigit && !Regex.IsMatch(password, "(.+)?(\\d+)(.+)?"))
        return new ValidationResult("Password must contain digit character");
      if (m_settings.PasswordOptions.RequireLowercase && !Regex.IsMatch(password, "(.+)?([a-z]+)(.+)?"))
        return new ValidationResult("Password must contain lowercase character");
      if (m_settings.PasswordOptions.RequireUppercase && !Regex.IsMatch(password, "(.+)?([A-Z]+)(.+)?"))
        return new ValidationResult("Password must contain uppercase character");
      if (m_settings.PasswordOptions.RequireNonAlphanumeric && !Regex.IsMatch(password, "(.+)?([^a-zA-Z0-9]+)(.+)?"))
        return new ValidationResult("Password must contain non-alphnumeric character");
      return ValidationResult.Success;
    }
  }
}