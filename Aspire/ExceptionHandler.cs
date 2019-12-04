using System;
using System.Net;
using System.Threading.Tasks;
using Aspire.Areas.Users.Exceptions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Aspire
{
    public class ExceptionHandler
    {
        private readonly RequestDelegate _next;

        public ExceptionHandler(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch(Exception ex)
            {
                var response = httpContext.Response;
                response.ContentType = "application/json";
                response.StatusCode = GetStatusCode(ex);
                await response.WriteAsync(JsonConvert.SerializeObject(new
                {
                    error = new
                    {
                        message = ex.Message,
                        exception = ex.GetType().Name
                    }
                }));
            }
        }

        private int GetStatusCode(Exception ex)
        {
            int result;

            switch(ex){
                case EmailNotAvailableException emailNotAvailableException:
                    result = (int)HttpStatusCode.BadRequest;
                    break;

                default:
                    result = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            return result;
        }
    }

    public static class ExceptionHandlerExtensions
    {
        public static IApplicationBuilder UseMiddlewareExceptionHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionHandler>();
        }
    }
}
