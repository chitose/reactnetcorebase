using System.ComponentModel.DataAnnotations;

namespace ReactNetCoreBase.Data.Validation
{
  public class MatchValidationAttribute : ValidationAttribute
  {
    public MatchValidationAttribute(string target) : base("{0} must be the same as {1}")
    {
      this.Target = target;
    }

    public string Target { get; set; }
    protected override ValidationResult IsValid(object value, ValidationContext context)
    {
      var otherValue = context.ObjectType.GetProperty(this.Target).GetValue(context.ObjectInstance);
      return otherValue != value ? new ValidationResult(FormatErrorMessage(context.DisplayName)) : ValidationResult.Success;
    }

    public override string FormatErrorMessage(string name) => string.Format(ErrorMessageString, name, Target);
  }
}
