using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Features.Seats
{
    public enum SeatStatus
    {
        Available,
        Reserved,
        Occupied,
        Maintenance,
    }

    public enum SeatType
    {
        Regular,
        VIP,
        Handicap,
    }

    public class Seat
    {
        public int Id { get; set; }
        public required char Row { get; set; }
        public required int Number { get; set; }
        public SeatStatus Status { get; set; } = SeatStatus.Available;

        public SeatType SeatType { get; set; } = SeatType.Regular;

        public CinemaHall CinemaHall { get; set; }
        public int CinemaHallId { get; set; }
    }
}
