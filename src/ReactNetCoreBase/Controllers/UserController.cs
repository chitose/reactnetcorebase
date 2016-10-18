using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReactNetCoreBase.Data;
using ReactNetCoreBase.Infrastructure.Attributes;
using ReactNetCoreBase.Util;

namespace ReactNetCoreBase.Controllers
{
  [Route("api/[controller]")]
  public class UserController : BaseApiController
  {
    public UserController(ApplicationDbContext db) : base(db)
    {
    }

    [FileResponseAction]
    [HttpGet("userImage{id}")]
    public FileResult UserImage(int id)
    {
      var image = db.Users.Where(x => x.Id == id).Select(x => x.Image).FirstOrDefault();
      return PhotoHelper.GetPhotoResponse(image);
    }

    [FileResponseAction]
    [HttpGet("userThumb{id}")]
    public FileResult UserThumb(int id)
    {
      var image = db.Users.Where(x => x.Id == id).Select(x => x.Image).FirstOrDefault();
      return PhotoHelper.GetPhotoResponse(PhotoHelper.GetPhotoThumb(image, 60));
    }
  }
}
