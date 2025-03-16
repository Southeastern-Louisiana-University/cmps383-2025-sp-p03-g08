namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class Showtimes
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public int TheaterId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int SeatCount { get; set; }
        public int AvailableSeats { get; set; }
        public int Price
        {
            get; set;
        }
    }
}
