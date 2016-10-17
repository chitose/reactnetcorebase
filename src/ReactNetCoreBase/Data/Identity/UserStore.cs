using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using ReactNetCoreBase.Infrastructure.Security;

namespace ReactNetCoreBase.Data.Identity
{
  public class UserStore<TUser, TRole, TContext> :
      IUserPasswordStore<TUser>,
      IUserRoleStore<TUser>,
      IUserClaimStore<TUser>,
      IUserSecurityStampStore<TUser>,
      IUserLockoutStore<TUser>,
      IQueryableUserStore<TUser>
      where TUser : IdentityUser<TRole>
      where TRole : IdentityRole
      where TContext : DbContext
  {

    public UserStore(TContext context, IdentityErrorDescriber describer = null)
    {
      if (context == null)
      {
        throw new ArgumentNullException(nameof(context));
      }
      Context = context;
      ErrorDescriber = describer ?? new IdentityErrorDescriber();
    }

    private bool _disposed;

    public TContext Context { get; private set; }

    public IdentityErrorDescriber ErrorDescriber { get; set; }

    public bool AutoSaveChanges { get; set; } = true;

    private Task SaveChanges(CancellationToken cancellationToken)
    {
      return AutoSaveChanges ? Context.SaveChangesAsync(cancellationToken) : Task.CompletedTask;
    }

    public virtual Task<string> GetUserIdAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.Id.ToString());
    }

    public virtual Task<string> GetUserNameAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.UserName);
    }

    public virtual Task SetUserNameAsync(TUser user, string userName, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      user.UserName = userName;
      return Task.CompletedTask;
    }

    public virtual Task<string> GetNormalizedUserNameAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.UserName);
    }

    public virtual Task SetNormalizedUserNameAsync(TUser user, string normalizedName, CancellationToken cancellationToken = default(CancellationToken))
    {
      return Task.CompletedTask;
    }

    public async virtual Task<IdentityResult> CreateAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }

      Context.Set<TUser>().Add(user);

      try
      {
        await SaveChanges(cancellationToken);
      }
      catch (DbUpdateConcurrencyException)
      {
        return IdentityResult.Failed(ErrorDescriber.ConcurrencyFailure());
      }
      catch (DbUpdateException)
      {
        return IdentityResult.Failed(ErrorDescriber.DefaultError());
      }

      return IdentityResult.Success;
    }

    public async virtual Task<IdentityResult> UpdateAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }

      Context.Entry(user).State = EntityState.Modified;

      try
      {
        await SaveChanges(cancellationToken);
      }
      catch (DbUpdateConcurrencyException)
      {
        return IdentityResult.Failed(ErrorDescriber.ConcurrencyFailure());
      }
      return IdentityResult.Success;
    }

    public async virtual Task<IdentityResult> DeleteAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }

      //updated for EF6
      Context.Set<TUser>().Remove(user);

      try
      {
        await SaveChanges(cancellationToken);
      }
      catch (DbUpdateConcurrencyException)
      {
        return IdentityResult.Failed(ErrorDescriber.ConcurrencyFailure());
      }
      return IdentityResult.Success;
    }

    public virtual Task<TUser> FindByIdAsync(string userId, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      var id = int.Parse(userId);
      return Users.FirstOrDefaultAsync(u => u.Id.Equals(id), cancellationToken);
    }

    public virtual Task<TUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      return Users.FirstOrDefaultAsync(u => u.UserName == normalizedUserName, cancellationToken);
    }

    public virtual IQueryable<TUser> Users => Context.Set<TUser>();

    public virtual Task SetPasswordHashAsync(TUser user, string passwordHash, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      user.PasswordHash = passwordHash;
      return Task.FromResult(0);
    }

    public virtual Task<string> GetPasswordHashAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.PasswordHash);
    }

    public virtual Task<bool> HasPasswordAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      return Task.FromResult(user.PasswordHash != null);
    }

    public virtual IQueryable<TRole> Roles => Context.Set<TRole>();

    public virtual Task AddToRoleAsync(TUser user, string roleName, CancellationToken cancellationToken = default(CancellationToken))
    {
      throw new NotSupportedException();
    }

    public virtual Task RemoveFromRoleAsync(TUser user, string roleName, CancellationToken cancellationToken = default(CancellationToken))
    {
      throw new NotSupportedException();
    }

    public virtual async Task<IList<string>> GetRolesAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
        throw new ArgumentNullException(nameof(user));

      var query = from role in Roles
                  where role.Id == user.RoleId
                  select role.Name;
      return await query.ToListAsync();
    }

    public virtual Task<bool> IsInRoleAsync(TUser user, string roleName, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
        throw new ArgumentNullException(nameof(user));
      if (string.IsNullOrWhiteSpace(roleName))
        throw new ArgumentException("Value cannot be null or empty: {0}", nameof(roleName));

      return Roles.AnyAsync(r => r.Id == user.RoleId && r.Name == roleName);
    }

    private void ThrowIfDisposed()
    {
      if (_disposed)
      {
        throw new ObjectDisposedException(GetType().Name);
      }
    }

    public void Dispose()
    {
      _disposed = true;
    }

    public virtual Task<DateTimeOffset?> GetLockoutEndDateAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.LockoutEnd);
    }

    public virtual Task SetLockoutEndDateAsync(TUser user, DateTimeOffset? lockoutEnd, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      user.LockoutEnd = lockoutEnd;
      return Task.FromResult(0);
    }

    public virtual Task<int> IncrementAccessFailedCountAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      user.AccessFailedCount++;
      return Task.FromResult(user.AccessFailedCount);
    }

    public virtual Task ResetAccessFailedCountAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      user.AccessFailedCount = 0;
      return Task.FromResult(0);
    }

    public virtual Task<int> GetAccessFailedCountAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.AccessFailedCount);
    }

    public virtual Task<bool> GetLockoutEnabledAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.LockoutEnabled);
    }

    public virtual Task SetLockoutEnabledAsync(TUser user, bool enabled, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      user.LockoutEnabled = enabled;
      return Task.FromResult(0);
    }

    public virtual Task SetSecurityStampAsync(TUser user, string stamp, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      user.SecurityStamp = stamp;
      return Task.FromResult(0);
    }

    public virtual Task<string> GetSecurityStampAsync(TUser user, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (user == null)
      {
        throw new ArgumentNullException(nameof(user));
      }
      return Task.FromResult(user.SecurityStamp);
    }

    public virtual async Task<IList<TUser>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken = default(CancellationToken))
    {
      cancellationToken.ThrowIfCancellationRequested();
      ThrowIfDisposed();
      if (String.IsNullOrEmpty(roleName))
      {
        throw new ArgumentNullException(nameof(roleName));
      }

      var role = await Roles.Where(x => x.Name.Equals(roleName)).FirstOrDefaultAsync(cancellationToken);

      if (role != null)
      {
        return await Context.Set<TUser>().Where(u => u.RoleId == role.Id).ToListAsync(cancellationToken);
      }
      return new List<TUser>();
    }

    public Task<IList<Claim>> GetClaimsAsync(TUser user, CancellationToken cancellationToken)
    {
      return Task.FromResult<IList<Claim>>(new[] {
              new Claim(Claims.DisplayName, user.FirstName + " " + user.LastName),
              new Claim(Claims.SecurityToken, user.SecurityStamp)
            });
    }

    #region Not implemented
    public Task AddClaimsAsync(TUser user, IEnumerable<Claim> claims, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }

    public Task ReplaceClaimAsync(TUser user, Claim claim, Claim newClaim, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }

    public Task RemoveClaimsAsync(TUser user, IEnumerable<Claim> claims, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }

    public Task<IList<TUser>> GetUsersForClaimAsync(Claim claim, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }
    #endregion
  }
}
