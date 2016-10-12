using Microsoft.AspNetCore.Mvc.Filters;

namespace ReactNetCoreBase.Infrastructure.Attributes
{
  public class AddHeaderAttribute : ResultFilterAttribute
  {
    private readonly string name;
    private readonly string value;

    public AddHeaderAttribute(string name, string value)
    {
      this.name = name;
      this.value = value;
    }

    public override void OnResultExecuting(ResultExecutingContext context)
    {
      context.HttpContext.Response.Headers.Add(name, value);
      base.OnResultExecuting(context);
    }
  }
}
