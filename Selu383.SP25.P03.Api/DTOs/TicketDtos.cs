public class GetTicketDto
{
    public Guid Id { get; set; }

    public string TicketCode { get; set; }

    public string SeatLabel { get; set; } // e.g., "A-12"
    public int SeatId { get; set; }

    public string TicketType { get; set; }

    public DateTime ShowingTime { get; set; } // Start time of the showing
    public DateTime PurchasedDate { get; set; }

    public string MovieName { get; set; }
    public string CinemaHallName { get; set; }

    public decimal Price { get; set; }
    public string ConfirmationCode { get; set; }
}

public class createTicketDto
{
    public int ShowingId { get; set; }
    public int SeatId { get; set; }
    public int UserId { get; set; }
    public string TicketType { get; set; }
    public string? GuestName { get; set; }
}

public class BulkCreateTicketsDto
{
    public int ShowingId { get; set; }
    public List<SeatInfoDto> Seats { get; set; }
    public string? GuestName { get; set; }
}

public class SeatInfoDto
{
    public int Id { get; set; }
    public string TicketType { get; set; }
}
