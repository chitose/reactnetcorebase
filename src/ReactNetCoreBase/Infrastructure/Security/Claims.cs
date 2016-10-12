using System.Security.Claims;
using ReactNetCoreBase.Models.Enum;

namespace ReactNetCoreBase.Infrastructure.Security
{
  public static class Claims
  {
    public const string Right = "ReactNetCoreBase/right";
    public const string DisplayName = "ReactNetCoreBase/displayName";
    public const string SecurityToken = "ReactNetCoreBase/csrf";

    public static int GetId(this ClaimsPrincipal identity)
    {
      string userId = identity?.FindFirstValue(ClaimTypes.NameIdentifier);
      if (userId == null)
        return 0;
      return int.Parse(userId);
    }

    public static string GetUsername(this ClaimsPrincipal identity)
      => identity?.FindFirstValue(ClaimTypes.Name) ?? "N/A";

    public static string GetFullName(this ClaimsPrincipal identity)
      => identity?.FindFirstValue(DisplayName) ?? "N/A";

    public static bool HasRight(this ClaimsPrincipal identity, Right right)
      => identity?.HasClaim(Right, right.ToString("d")) ?? false;

    public static bool ValidateSecurityToken(this ClaimsPrincipal identity, string token)
      => token != null && identity.FindFirstValue(SecurityToken) == token;
  }
}
