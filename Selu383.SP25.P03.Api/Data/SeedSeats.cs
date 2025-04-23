using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Seats;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedSeats
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (
                var context = new DataContext(
                    serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()
                )
            )
            {
                // Check if any seats already exist.
                if (await context.Seats.AnyAsync())
                {
                    return; // DB has been seeded
                }

                // Prepare a list to hold all the seats to be added.
                var seatsToAdd = new List<Seat>();

                // Fetch all CinemaHalls that belong to one of the three seeded theaters.
                var cinemaHalls = await context
                    .CinemaHalls.Where(ch =>
                        ch.TheaterId == 0 || ch.TheaterId == 1 || ch.TheaterId == 2
                    )
                    .ToListAsync();

                // For each CinemaHall, add 100 seats in a 10 by 10 layout (rows A-J, numbers 1-10).
                foreach (var cinemaHall in cinemaHalls)
                {
                    for (char row = 'A'; row <= 'E'; row++)
                    {
                        for (int number = 1; number <= 10; number++)
                        {
                            var seat = new Seat
                            {
                                Row = row,
                                Number = number,
                                CinemaHallId = cinemaHall.Id,
                                SeatType = "Regular",
                                Status = "Available"
                                // Status and SeatType use their default values.
                            };
                            seatsToAdd.Add(seat);
                        }
                    }
                }

                // Add the seats using AddRange (not AddRangeAsync).
                context.Seats.AddRange(seatsToAdd);
                await context.SaveChangesAsync();
            }
        }
    }
}
