using Selu383.SP25.P03.Api.Features.Seats;

public class SeatDto
{
    public int Id { get; set; }
    public char Row { get; set; }
    public int Number { get; set; }
    public SeatStatus Status { get; set; }
}

public class GetSeatDto
{
    public char Row { get; set; }
    public int Number { get; set; }
    public SeatType SeatType { get; set; }
    public SeatStatus Status { get; set; }
}
