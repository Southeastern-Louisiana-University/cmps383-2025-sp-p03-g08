namespace Selu383.SP25.P03.Api.Features.Users
{
    public class UserDto
    {
        public int Id { get; set; }
        public string? UserName { get; set; }
        public string[]? Roles { get; set; }
    }

    public class LoginDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class CreateUserDto
    {
        public required string Username { get; set; }

        public required string Password { get; set; }

        public string[]? Roles { get; set; }
    }
}
