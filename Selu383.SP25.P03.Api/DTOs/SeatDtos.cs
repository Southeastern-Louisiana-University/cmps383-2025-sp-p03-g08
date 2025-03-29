using Selu383.SP25.P03.Api.Features.Seats;

public class SeatDto
{
    public int Id { get; set; }
    public string Row { get; set; }
    public int Number { get; set; }
    public bool Accessibility { get; set; }
    public SeatStatus Status { get; set; }
}

