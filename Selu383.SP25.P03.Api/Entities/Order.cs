using Selu383.SP25.P03.Api.Features.Users;

public class Order
{
    public int Id { get; set; }
    public User? User { get; set; }
    public int? UserId { get; set; }
    public string? Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public string ConfirmationCode { get; set; }
    public List<Ticket>? Tickets { get; set; }
    public List<OrderMenuItem>? OrderMenuItems { get; set; }
}
