using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Theaters;

public class CinemaHall
{
    public int Id { get; set; }

    public string Name { get; set; }
    public Theater Theater { get; set; }
    public int TheaterId { get; set; }
    public List<Seat> Seats { get; set; }
}
