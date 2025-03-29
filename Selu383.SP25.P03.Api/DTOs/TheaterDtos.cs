namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class TheaterDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public int SeatCount { get; set; }
        public int? ManagerId { get; set; }
    }
}
