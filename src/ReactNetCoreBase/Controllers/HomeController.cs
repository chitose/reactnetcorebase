using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using ReactNetCoreBase.Configuration;
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
    private readonly IHostingEnvironment env;
    private readonly Settings settings;
    public HomeController(ApplicationDbContext db, IOptions<Settings> settings, IHostingEnvironment env)
    {
      this.db = db;
      this.settings = settings.Value;
      this.env = env;
    }
        
    public IActionResult Index()
    {
      LoginResponse profile = null;
      if (User.Identity.IsAuthenticated)
      {
        var user = db.Users.Find(User.GetId());
        if (user != null)
        {
          profile = new LoginResponse {
            Id = user.Id,
            Rights = User.Claims.Where(c => c.Type == Claims.Right).Select(c => (Right)int.Parse(c.Value)),
            CsrfToken = User.FindFirst(Claims.SecurityToken).Value,
            UserName = user.UserName,
            DisplayName = user.DisplayName,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Phone = user.Phone
          };
        }
      }

      var languages = Request.Headers["Accept-Language"].FirstOrDefault();
      if (!string.IsNullOrEmpty(languages))
      {
        languages = languages.Split(',').First();
      }

      return View(new Model {
        CacheDate = cacheDate,
        Profile = profile,
        Language = languages,
        Settings = settings,
        Resources = GetJsonResource()
      });
    }

    private static string GetCacheDate()
    {
      string assemblyFile = typeof(HomeController).Assembly.Location;
      return new FileInfo(assemblyFile).LastWriteTime.ToString("yyyy-MM-dd@HH:mm:ss", CultureInfo.InvariantCulture);
    }    

    private object GetJsonResource()
    {
      DirectoryInfo dir = new DirectoryInfo(Path.Combine(env.WebRootPath, "locales"));
      var res = new Dictionary<string, Dictionary<string, object>>();
      if (dir.Exists)
      {
        foreach (var s in dir.GetDirectories())
        {
          var lang = new Dictionary<string, object>();
          res.Add(s.Name, lang);
          var jsonFiles = s.GetFiles("*.json");
          foreach (var json in jsonFiles)
          {
            using (var st = new StreamReader(json.FullName))
            {
              var jsonData = JsonConvert.DeserializeObject<object>(st.ReadToEnd());
              lang.Add(Path.GetFileNameWithoutExtension(json.Name), jsonData);
            }
          }
        }
      }
      return res;
    }

    public class Model
    {
      public string CacheDate { get; set; }
      public LoginResponse Profile { get; set; }
      public Settings Settings { get; set; }
      public string Language { get; set; }
      public object Resources { get; set; }
    }
  }
}
