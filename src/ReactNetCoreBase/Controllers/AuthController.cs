using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ReactNetCoreBase.Data;
using ReactNetCoreBase.Models.Db;
using ReactNetCoreBase.Models.View;
using ReactNetCoreBase.Infrastructure;

namespace ReactNetCoreBase.Controllers
{
  [Route("api/[controller]")]
  public class AuthController : BaseApiController
  {
    public AuthController(ApplicationDbContext db) : base(db)
    {
    }

    public async Task<LoginResponse> Login([FromBody]LoginRequest request, [FromServices]SignInManager<User> signInManager)
    {      
      var user = db.Users.AsNoTracking()
          .Include(x => x.Role.Rights)
          .FirstOrDefault(x => x.UserName == request.UserName);
      if (user == null)
      {
        Loggers.Authentication.Warn($"security: Invalid login for user name '{request.UserName}'.");
        throw new BusinessException("security:message.invalid");
      }

      var result = await signInManager.PasswordSignInAsync(user, request.Password, isPersistent: false, lockoutOnFailure: false);
      if (!result.Succeeded)
      {
        Loggers.Authentication.Warn($"security: Unsuccess login for user '{request.UserName}'.");
        throw new BusinessException("security:message.invalid");
      }
      Loggers.Authentication.Info($"Login: User {request.UserName} logged in successfully.");
      return new LoginResponse {
        UserName = user.UserName,
        DisplayName = user.DisplayName,
        Rights = user.Role.Rights.Select(p => p.Right)
      };
    }
  }
}
