using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Theaters;

public class Ticket
{
    public int Id { get; set; }
    public Seat Seat { get; set; }
    public int SeatId { get; set; }
    public Showing Showing { get; set; }
    public int ShowingId { get; set; }
    public decimal Price {get; set;}
    public DateTime PurchaseDate { get; set; }

    public string PurchasedBy { get; set; }
}
