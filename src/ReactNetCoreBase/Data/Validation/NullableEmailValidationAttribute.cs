using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ReactNetCoreBase.Data.Validation {
  public class NullableEmailValidationAttribute : ValidationAttribute {
    public NullableEmailValidationAttribute() : base("{0} is not valid email address.") {

    }
    protected override ValidationResult IsValid(object value, ValidationContext context) {
      return string.IsNullOrEmpty(value?.ToString()) || new EmailAddressAttribute().IsValid(value)
      ? ValidationResult.Success : new ValidationResult(FormatErrorMessage(context.DisplayName));
    }

    public override string FormatErrorMessage(string name) => string.Format(ErrorMessageString, name);
  }
}
