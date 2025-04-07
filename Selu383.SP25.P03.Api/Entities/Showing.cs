using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Theaters;

public class Showing
{
    public int Id { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string ShowType { get; set; }
    public bool IsSoldOut { get; set; } = false;

    public Movie Movie { get; set; }
    public int MovieId { get; set; }

    public CinemaHall CinemaHall { get; set; }
    public int CinemaHallId { get; set; }

    public PricingModel PricingModel { get; set; }
    public int PricingModelId { get; set; }
}

