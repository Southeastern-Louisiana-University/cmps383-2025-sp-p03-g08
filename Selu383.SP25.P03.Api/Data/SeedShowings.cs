using Microsoft.EntityFrameworkCore;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedShowings
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (
                var context = new DataContext(
                    serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()
                )
            )
            {
                // Check if any showings exist to avoid reseeding.
                if (await context.Showings.AnyAsync())
                {
                    return;
                }

                // Retrieve related entities for creating valid foreign key relationships.
                // Adjust these queries as needed based on your seeded data.
                var movie1 = await context.Movies.FirstOrDefaultAsync(m => m.Id == 0);
                var movie2 = await context.Movies.FirstOrDefaultAsync(m => m.Id == 1);
                var movie3 = await context.Movies.FirstOrDefaultAsync(m => m.Id == 1);
                var cinemaHall1 = await context.CinemaHalls.FirstOrDefaultAsync(c => c.Id == 0);
                var cinemaHall2 = await context.CinemaHalls.FirstOrDefaultAsync(c => c.Id == 1);

                var pricingModel1 = await context.PricingModels.FirstOrDefaultAsync(p =>
                    p.ModelName == "Standard"
                );
                var pricingModel2 = await context.PricingModels.FirstOrDefaultAsync(p =>
                    p.ModelName == "Premium"
                );

                // Ensure all related data exists.
                if (
                    movie1 == null
                    || movie2 == null
                    || cinemaHall1 == null
                    || cinemaHall2 == null
                    || pricingModel1 == null
                    || pricingModel2 == null
                )
                {
                    // You may log a warning or throw an exception if necessary.
                    return;
                }

                // Define start times for each showing.
                var startTime1 = new DateTime(2023, 04, 15, 19, 00, 00);
                var startTime2 = new DateTime(2023, 04, 15, 21, 00, 00);

                // Create showings, calculating EndTime by adding the movie's duration.
                var showing1 = new Showing
                {
                    ShowType = "Regular",
                    MovieId = movie1.Id,
                    CinemaHallId = cinemaHall1.Id,
                    PricingModelId = pricingModel1.Id,
                    StartTime = startTime1,
                    EndTime = startTime1.Add(movie1.Duration),
                    IsSoldOut = false,
                };

                var showing2 = new Showing
                {
                    ShowType = "IMAX",
                    MovieId = movie2.Id,
                    CinemaHallId = cinemaHall2.Id,
                    PricingModelId = pricingModel2.Id,
                    StartTime = startTime2,
                    EndTime = startTime2.Add(movie2.Duration),
                    IsSoldOut = false,
                };

                var showing3 = new Showing
                {
                    ShowType = "IMAX",
                    MovieId = movie3.Id,
                    CinemaHallId = cinemaHall2.Id,
                    PricingModelId = pricingModel2.Id,
                    StartTime = startTime2,
                    EndTime = startTime2.Add(movie2.Duration),
                    IsSoldOut = false,
                };

                var showing4 = new Showing
                {
                    ShowType = "IMAX",
                    MovieId = movie2.Id,
                    CinemaHallId = cinemaHall2.Id,
                    PricingModelId = pricingModel2.Id,
                    StartTime = startTime2,
                    EndTime = startTime2.Add(movie2.Duration),
                    IsSoldOut = false,
                };

                // Add the new showings.
                context.Showings.AddRange(showing1, showing2, showing3, showing4);
                await context.SaveChangesAsync();
            }
        }
    }
}
