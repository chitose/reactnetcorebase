using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactNetCoreBase.Models.View
{
  public class ApiResponse<T>
  {
    public string ErrorMessage { get; set; }
    public object ErrorOptions { get; set; }
    public string ErrorDetails { get; set; }
    public bool IsBusinessError { get; set; }
    public T Data { get; set; }
    public int StatusCode { get; set; }
  }
}
