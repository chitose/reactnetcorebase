using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ReactNetCoreBase.Models.View;

namespace ReactNetCoreBase.Infrastructure.Attributes
{
  public class ResultWrapperFilter : ResultFilterAttribute
  {
    public override void OnResultExecuting(ResultExecutingContext context)
    {
      if (context.Result is ObjectResult)
      {
        context.Result = new ObjectResult(new ApiResponse<object> {
          Data = (context.Result as ObjectResult).Value
        });
      }
      base.OnResultExecuting(context);
    }    
  }
}
