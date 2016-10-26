﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReactNetCoreBase.Data;
using ReactNetCoreBase.Infrastructure.Attributes;
using ReactNetCoreBase.Infrastructure.Security;
using ReactNetCoreBase.Models.View;
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

    [HttpPost("updateProfile")]
    public ProfileUpdateRequest UpdateProfile([FromBody]ProfileUpdateRequest request)
    {
      var userId = User.GetId();
      var dbUser = db.Users.FirstOrDefault(u => u.Id == userId);
      dbUser.FirstName = request.FirstName;
      dbUser.LastName = request.LastName;
      dbUser.Email = request.Email;
      dbUser.Phone = request.Phone;
      dbUser.Image = request.Image;
      db.SaveChanges();
      request.Image = null;
      return request;
    }
  }
}
