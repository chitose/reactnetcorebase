using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ReactNetCoreBase.Infrastructure.MiddleWares
{
    public class ResponseWrapperMiddleWare
    {
        private readonly RequestDelegate _next;

        public ResponseWrapperMiddleWare(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            await _next.Invoke(context);
        }
    }
}
