using Microsoft.AspNetCore.Authorization;
using ReactNetCoreBase.Models.Enum;

namespace ReactNetCoreBase.Infrastructure.Security
{
    public class PermissionAttribute : AuthorizeAttribute
    {
        public PermissionAttribute(Right right)
            : base(ClaimPolicyProvider.CLAIM_PREFIX + right.ToString("d"))
        {
        }
    }
}
