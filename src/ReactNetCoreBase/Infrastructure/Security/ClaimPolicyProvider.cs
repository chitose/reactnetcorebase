using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace ReactNetCoreBase.Infrastructure.Security
{
    public class ClaimPolicyProvider : IAuthorizationPolicyProvider
    {
        public const string CLAIM_PREFIX = "Claim:";
        public Task<AuthorizationPolicy> GetDefaultPolicyAsync()
        {
            return Task.FromResult(new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build());
        }

        public Task<AuthorizationPolicy> GetPolicyAsync(string policyName)
        {
            if (!policyName.StartsWith(CLAIM_PREFIX, StringComparison.Ordinal))
                throw new NotSupportedException("Unsupported policy: " + policyName);

            return Task.FromResult(new AuthorizationPolicyBuilder().RequireClaim(Claims.Right, policyName.Substring(CLAIM_PREFIX.Length)).Build());
        }
    }
}
