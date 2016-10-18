using System;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using ReactNetCoreBase.Data;

namespace ReactNetCoreBase.Controllers
{
  public class BaseApiController : Controller
  {
    protected readonly ApplicationDbContext db;
    public BaseApiController(ApplicationDbContext db)
    {
      this.db = db;
    }

    protected byte[] GetImageFromClient(string dataUrl, int entityId)
    {
      if (!string.IsNullOrEmpty(dataUrl) && dataUrl != entityId.ToString())
      {
        var base64Data = Regex.Match(dataUrl, @"data:image/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
        return Convert.FromBase64String(base64Data);
      }
      return null;
    }
  }
}
