using Microsoft.AspNetCore.Mvc.Filters;

namespace ReactNetCoreBase.Infrastructure {
  public class ModelValidationFilter : IActionFilter {
    public void OnActionExecuted(ActionExecutedContext context) {
    }

    public void OnActionExecuting(ActionExecutingContext context) {
      if (!context.ModelState.IsValid) {
        throw new BusinessException("common:message.validation_error");
      }
    }
  }
}