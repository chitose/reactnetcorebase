using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Security;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ReactNetCoreBase.Infrastructure.Attributes
{
    public class KnownExceptionsFilter : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            var ex = context.Exception;
            var request = context.HttpContext.Request;

            if (ExceptionToHttpResult(ex, context))
                Loggers.Default.Warn(ex);
            else
                Loggers.Default.Error(ex);
        }

        private bool ExceptionToHttpResult(Exception ex, ExceptionContext context)
        {
            if (ex is DbUpdateConcurrencyException)
            {
                context.Result = new StatusCodeResult(StatusCodes.Status412PreconditionFailed);
                return true;
            }

            if (ex is SecurityException)
            {
                context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
                return true;
            }

            return false;
        }
    }
}
