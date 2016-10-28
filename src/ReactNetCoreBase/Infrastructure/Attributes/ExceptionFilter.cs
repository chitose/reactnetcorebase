using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Security;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ReactNetCoreBase.Models.View;

namespace ReactNetCoreBase.Infrastructure.Attributes
{
  public class ExceptionFilter : ExceptionFilterAttribute
  {
    private readonly IHostingEnvironment _env;
    public ExceptionFilter(IHostingEnvironment env) : base()
    {
      _env = env;
    }

    public override void OnException(ExceptionContext context)
    {
      var ex = context.Exception;

      if (ExceptionToHttpResult(ex, context))
        Loggers.Default.Warn(ex);
      else
        Loggers.Default.Error(ex);
    }

    private bool ExceptionToHttpResult(Exception ex, ExceptionContext context)
    {
      var response = new ApiResponse<object> {
        ErrorOptions = new object()
      };
      try
      {
        if (ex is DbUpdateConcurrencyException)
        {
          response.ErrorMessage = "common:message.concurrency_exception";
          return true;
        }
        else if (ex is BusinessException)
        {
          response.ErrorMessage = ex.Message;
          response.ErrorOptions = (ex as BusinessException).Options ?? new object();
          response.IsBusinessError = true;
          return true;
        }
        else if (ex is SecurityException)
        {
          response.ErrorMessage = "common:message.security_exception";
          return true;
        } else
        {
          response.ErrorMessage = "common:message.runtime_exception";
        }

        return false;
      }
      finally
      {
        if (!response.IsBusinessError && !(ex is SecurityException) && _env.IsDevelopment())
        {
          response.ErrorDetails = ex.ToString();
        }
        context.Result = new ObjectResult(response);
      }
    }
  }
}
