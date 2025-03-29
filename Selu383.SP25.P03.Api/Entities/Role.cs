using Microsoft.AspNetCore.Identity;

namespace Selu383.SP25.P03.Api.Features.Users
{
    public class Role : IdentityRole<int>
    {
        public virtual ICollection<UserRole> UserRoles { get; } = new List<UserRole>();
    }
}
