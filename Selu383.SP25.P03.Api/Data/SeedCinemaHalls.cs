using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Seats;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedCinemaHalls
    {
public static async Task Initialize(IServiceProvider serviceProvider)
{
    using (var context = new DataContext(
        serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
    {
        // Check if any cinema halls already exist.
        if (await context.CinemaHalls.AnyAsync())
        {
            return; // DB has been seeded.
        }

        var theater1 = context.Theaters.FirstOrDefault(_ => _.Name == "New Orleans");
        var theater2 = context.Theaters.FirstOrDefault(_ => _.Name == "New York");

        if (theater1 != null && theater2 != null)
        {
            // Create a list of cinema halls with appropriate TheaterId references.
            var cinemaHalls = new List<CinemaHall>
            {
                new CinemaHall
                {
                    Name = "Hall 1",
                    TheaterId = theater1.Id,
                    Seats = new List<Seat>(),
                },
                new CinemaHall
                {
                    Name = "Hall 2",
                    TheaterId = theater1.Id,
                    Seats = new List<Seat>(),
                },
                new CinemaHall
                {
                    Name = "Hall 3",
                    TheaterId = theater1.Id,
                    Seats = new List<Seat>(),
                },
                new CinemaHall
                {
                    Name = "Hall 4",
                    TheaterId = theater2.Id,
                    Seats = new List<Seat>(),
                },
            };

            context.CinemaHalls.AddRange(cinemaHalls);
            await context.SaveChangesAsync();
        }
        else
        {
            throw new Exception("Seeding failed: The necessary theaters were not found.");
        }
    }
}
    }
}
