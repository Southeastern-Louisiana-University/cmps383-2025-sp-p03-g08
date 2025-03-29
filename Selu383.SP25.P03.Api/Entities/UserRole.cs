using Microsoft.AspNetCore.Identity;

namespace Selu383.SP25.P03.Api.Features.Users
{
    public class UserRole : IdentityUserRole<int>
    {
        public virtual User User { get; set; }
        public virtual Role Role { get; set; }
    }
}
