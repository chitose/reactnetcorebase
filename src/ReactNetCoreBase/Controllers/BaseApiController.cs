using System;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using ReactNetCoreBase.Data;
using ReactNetCoreBase.Models.Db;
using ReactNetCoreBase.Models.View;

namespace ReactNetCoreBase.Controllers {
  public class BaseApiController : Controller {
    protected readonly ApplicationDbContext db;
    public BaseApiController(ApplicationDbContext db) {
      this.db = db;
    }

    protected byte[] GetImageFromClient(string dataUrl, int entityId) {
      if (!string.IsNullOrEmpty(dataUrl) && dataUrl != entityId.ToString()) {
        var base64Data = Regex.Match(dataUrl, @"data:image/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
        return Convert.FromBase64String(base64Data);
      }
      return null;
    }

    internal static LoginResponse GetLoginResponse(User user) {
      LoginResponse profile = null;
      if (user != null) {
        profile = new LoginResponse {
          Id = user.Id,
          Rights = user.Role.Rights.Select(p => p.Right),
          CsrfToken = user.SecurityStamp,
          UserName = user.UserName,
          DisplayName = user.DisplayName,
          FirstName = user.FirstName,
          LastName = user.LastName,
          Email = user.Email,
          Phone = user.Phone,
          RowVersion = user.RowVersion,
          HasImage = user.Image != null
        };
      }
      return profile;
    }
  }
}
