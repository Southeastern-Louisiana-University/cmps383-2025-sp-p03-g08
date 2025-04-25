public class OrderDto
{
    public int? ShowingId { get; set; }
    public List<SeatInfoDto>? Seats { get; set; }
    public string? GuestName { get; set; }
    public string? Email { get; set; } // Optional for guests
    public List<MenuItemOrderDto>? FoodItems { get; set; } = null;
}

public class MenuItemOrderDto
{
    public int? MenuItemId { get; set; } = null;
    public int Quantity { get; set; } = 0;
}

public class GetOrderDto
{
    public int Id { get; set; }
    public string ConfirmationCode { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Email { get; set; }

    public List<GetTicketDto> Tickets { get; set; } = new();
    public List<MenuItemOrderDto> FoodItems { get; set; } = new();

    public decimal TicketSubtotal { get; set; }
    public decimal FoodSubtotal { get; set; }
    public decimal OrderTotal { get; set; }
}
