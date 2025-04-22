public class GetTicketDto
{
    public Guid Id { get; set; }

    public string TicketCode { get; set; }

    public string SeatLabel { get; set; } // e.g., "A12"
    public int SeatId { get; set; }

    public int ShowingId { get; set; }
    public string MovieTitle { get; set; }
    public DateTime Showtime { get; set; }

    public decimal Price { get; set; }
    public string TicketType { get; set; } // e.g., "Adult", "Child", "Senior"

    public DateTime PurchaseDate { get; set; }

    public string PurchaserName { get; set; } // UserName or GuestName

    public int? UserId { get; set; }
    public int CinemHallId { get; set; } // Nullable if purchased as guest
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
