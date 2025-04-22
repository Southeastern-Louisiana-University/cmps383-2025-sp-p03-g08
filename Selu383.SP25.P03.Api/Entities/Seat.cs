using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Features.Seats
{
    public class Seat
    {
        public int Id { get; set; }
        public required char Row { get; set; }
        public required int Number { get; set; }
        public string Status { get; set; } = "Available";

        public string SeatType { get; set; } = "Regular";

        public CinemaHall CinemaHall { get; set; }
        public int CinemaHallId { get; set; }
    }
}
