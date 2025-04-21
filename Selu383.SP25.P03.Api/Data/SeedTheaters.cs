using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedTheaters
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (
                var context = new DataContext(
                    serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()
                )
            )
            {
                // Look for any theaters.
                if (await context.Theaters.AnyAsync())
                {
                    return; // DB has been seeded
                }

                context.Theaters.AddRange(
                    new Theater { 
                        Name = "New York",
                        Address = "570 2nd Ave, New York, NY", 
                        ZipCode = "10016", },
                    new Theater
                    {
                        Name = "New Orleans",
                        Address = "636 N Broad St, New Orleans, LA",
                        ZipCode = "70119",
                    },
                    new Theater
                    {
                        Name = "Los Angeles",
                        Address = "4020 Marlton Ave, Los Angeles, CA",
                        ZipCode = "90008",
                    }
                );

                await context.SaveChangesAsync();
            }
        }
    }
}
