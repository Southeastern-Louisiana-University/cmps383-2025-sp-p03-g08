using Selu383.SP25.P03.Api.Features.Seats;

public class CinemaHallDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int TheaterId { get; set; }
}

public class GetCinemaHallDto
{
    public string Name { get; set; }
    public string Theater { get; set; }
    public int SeatCount { get; set; }
}

public class CreateCinemaHallDto
{
    public string Name { get; set; }
    public int TheaterId { get; set; }
}
