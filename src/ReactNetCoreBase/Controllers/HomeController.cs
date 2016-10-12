using System.Globalization;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ReactNetCoreBase.Data;
using ReactNetCoreBase.Infrastructure.Attributes;
using ReactNetCoreBase.Infrastructure.Security;
using ReactNetCoreBase.Models.Enum;
using ReactNetCoreBase.Models.View;

namespace ReactNetCoreBase.Controllers
{
  public class HomeController : Controller
  {
    private static readonly string cacheDate = GetCacheDate();
    private readonly ApplicationDbContext db;
    public HomeController(ApplicationDbContext db)
    {
      this.db = db;
    }

    [AddHeader("X-Frame-Options", "deny")]
    [AddHeader("X-XSS-Protection", "1; mode=block")]
    public IActionResult Index()
    {
      UserResponse profile = null;
      if (User.Identity.IsAuthenticated)
      {
        var user = db.Users.Find(User.GetId());
        if (user != null)
        {
          profile = new UserResponse {
            Rights = User.Claims.Select(c => (Right)int.Parse(c.Value)),
            CsrfToken = User.FindFirst(Claims.SecurityToken).Value,
            UserName = user.UserName,
            DisplayName = user.DisplayName
          };
        }
      }
      return View(new Model {
        CacheDate = cacheDate,
        Profile = profile
      });
    }

    private static string GetCacheDate()
    {
      string assemblyFile = typeof(HomeController).Assembly.Location;
      return new FileInfo(assemblyFile).LastWriteTime.ToString("yyyy-MM-dd@HH:mm:ss", CultureInfo.InvariantCulture);
    }

    public class Model
    {
      public string CacheDate { get; set; }
      public UserResponse Profile { get; set; }
    }
  }
}
