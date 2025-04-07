using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedCinemaHalls
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (
                var context = new DataContext(
                    serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()
                )
            )
            {
                // Check if any cinema halls already exist.
                if (await context.CinemaHalls.AnyAsync())
                {
                    return; // DB has been seeded
                }

                // Create a list of cinema halls with appropriate TheaterId references.
                var cinemaHalls = new List<CinemaHall>
                {
                    new CinemaHall
                    {
                        Name = "Hall 1",
                        TheaterId = 1, // Make sure this TheaterId exists from your SeedTheaters
                        Seats = new List<Seat>(), // Optionally, you can seed seats here.
                    },
                    new CinemaHall
                    {
                        Name = "Hall 2",
                        TheaterId = 1,
                        Seats = new List<Seat>(),
                    },
                    new CinemaHall
                    {
                        Name = "Hall 3",
                        TheaterId = 2, // Assuming Theater with Id 2 exists.
                        Seats = new List<Seat>(),
                    },
                    new CinemaHall
                    {
                        Name = "Hall 4",
                        TheaterId = 2,
                        Seats = new List<Seat>(),
                    },
                };

                context.CinemaHalls.AddRange(cinemaHalls);
                await context.SaveChangesAsync();
            }
        }
    }
}
