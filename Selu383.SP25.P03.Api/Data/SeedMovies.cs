using Microsoft.EntityFrameworkCore;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedMovies
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (
                var context = new DataContext(
                    serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()
                )
            )
            {
                // Look for any movies.
                if (await context.Movies.AnyAsync())
                {
                    return; // DB has been seeded
                }

                context.Movies.AddRange(
                    new Movie
                    {
                        Title = "Anora",
                        Description =
                            "A critically acclaimed drama exploring the complexities of life, love, and loss in a modern world.",
                        Genre = "Drama",
                        ReleaseDate = new DateTime(2024, 10, 18),
                        NowPlaying = true,
                        Duration = new TimeSpan(1, 52, 0), // 112 minutes
                        PosterURL = "https://imgur.com/cIj8NsO.jpg",
                    },
                    new Movie
                    {
                        Title = "Captain America: New World Order",
                        Description =
                            "In a turbulent post-Avengers era, a new Captain America rises to lead against global threats while wrestling with his own legacy.",
                        Genre = "Action/Adventure",
                        ReleaseDate = new DateTime(2025, 03, 14),
                        NowPlaying = true,
                        Duration = new TimeSpan(2, 22, 0), // 142 minutes
                        PosterURL = "https://imgur.com/q01x2l0.jpg",
                    },
                    new Movie
                    {
                        Title = "The Monkey",
                        Description =
                            "A suspenseful thriller that blurs the lines between human and animal instincts, as a mysterious presence disrupts a quiet community.",
                        Genre = "Thriller",
                        ReleaseDate = new DateTime(2025, 03, 21),
                        NowPlaying = true,
                        Duration = new TimeSpan(1, 45, 0), // 105 minutes
                        PosterURL = "https://imgur.com/AEJ9A4D.jpg",
                    },
                    new Movie
                    {
                        Title = "Mickey 17",
                        Description =
                            "A futuristic sci-fi adventure where a flawed, yet determined, human replicant embarks on a perilous intergalactic mission.",
                        Genre = "Science Fiction",
                        ReleaseDate = new DateTime(2023, 09, 15),
                        NowPlaying = true,
                        Duration = new TimeSpan(2, 0, 0), // 120 minutes
                        PosterURL = "https://imgur.com/nyrRI13.jpg",
                    },
                    new Movie
                    {
                        Title = "Last Breath",
                        Description =
                            "A gripping documentary that captures the raw power and beauty of human endurance in extreme underwater environments.",
                        Genre = "Documentary",
                        ReleaseDate = new DateTime(2025, 3, 7),
                        NowPlaying = true,
                        Duration = new TimeSpan(1, 37, 0), // 97 minutes
                        PosterURL = "https://imgur.com/iaZh6XJ.jpg",
                    }
                );

                await context.SaveChangesAsync();
            }
        }
    }
}
