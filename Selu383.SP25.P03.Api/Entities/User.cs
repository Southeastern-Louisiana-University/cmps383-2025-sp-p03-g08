using Microsoft.AspNetCore.Identity;

namespace Selu383.SP25.P03.Api.Features.Users
{
    public class User : IdentityUser<int>
    {
        /// <summary>
        /// Navigation property for the roles this user belongs to.
        /// </summary>
        public virtual ICollection<UserRole> UserRoles { get; } = new List<UserRole>();
    }
}
