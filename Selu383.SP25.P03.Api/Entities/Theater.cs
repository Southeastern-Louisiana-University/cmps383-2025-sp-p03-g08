using System.ComponentModel.DataAnnotations;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class Theater
    {
        public int Id { get; set; }

        [MaxLength(120)]
        public required string Name { get; set; }
        public required string Address { get; set; }
        public int? ManagerId { get; set; }
        public virtual User? Manager { get; set; }
        public List<CinemaHall> CinemaHalls { get; set; }
        public string? ImageURL { get; set; }
    }
}
