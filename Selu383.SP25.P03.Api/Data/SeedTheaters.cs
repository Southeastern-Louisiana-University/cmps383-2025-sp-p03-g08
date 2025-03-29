using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedTheaters
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (
                var context = new DataContext(
                    serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()
                )
            )
            {
                // Look for any theaters.
                if (context.Theaters.Any())
                {
                    return; // DB has been seeded
                }
                context.Theaters.AddRange(
                    new Theater { Name = "AMC Palace 10", Address = "123 Main St, Springfield" },
                    new Theater { Name = "Regal Cinema", Address = "456 Elm St, Shelbyville" },
                    new Theater
                    {
                        Name = "Grand Theater",
                        Address = "789 Broadway Ave, Metropolis",
                    },
                    new Theater { Name = "Vintage Drive-In", Address = "101 Retro Rd, Smallville" }
                );
                context.SaveChanges();
            }
        }
    }
}
