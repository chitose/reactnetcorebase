using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReactNetCoreBase.Data;
using ReactNetCoreBase.Infrastructure.Attributes;
using ReactNetCoreBase.Infrastructure.Security;
using ReactNetCoreBase.Models.View;
using ReactNetCoreBase.Util;
using AutoMapper;
using ReactNetCoreBase.Models.Db;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using ReactNetCoreBase.Data.Identity;

namespace ReactNetCoreBase.Controllers {
  [Route("api/[controller]")]
  public class UserController : BaseApiController {
    public UserController(ApplicationDbContext db, IMapper mapper) : base(db, mapper) {
    }

    [FileResponseAction]
    [HttpGet("userImage{id}")]
    public FileResult UserImage(int id) {
      var image = db.Users.Where(x => x.Id == id).Select(x => x.Image).FirstOrDefault();
      return PhotoHelper.GetPhotoResponse(image);
    }

    [FileResponseAction]
    [HttpGet("userThumb{id}")]
    public FileResult UserThumb(int id) {
      var image = db.Users.Where(x => x.Id == id).Select(x => x.Image).FirstOrDefault();
      return PhotoHelper.GetPhotoResponse(PhotoHelper.GetPhotoThumb(image, 60));
    }

    [HttpPost("updateProfile")]
    public async Task<LoginResponse> UpdateProfile([FromBody]ProfileUpdateRequest request,[FromServices] UserManager<User> userManager, CancellationToken cancellationToken) {
      var userId = User.GetId();
      var dbUser = db.Users
      .Include(x => x.Role.Rights)
      .FirstOrDefault(u => u.Id == userId);
      var role = dbUser.Role;
      mapper.Map(request, dbUser);
      await db.SaveChangesAsync(cancellationToken);
      if (!string.IsNullOrEmpty(request.Password) && !string.IsNullOrEmpty(request.NewPassword)) {
        await userManager.ChangePasswordAsync(dbUser, request.Password, request.NewPassword);
      }
      dbUser.Role = role;
      return mapper.Map<LoginResponse>(dbUser);
    }
  }
}
