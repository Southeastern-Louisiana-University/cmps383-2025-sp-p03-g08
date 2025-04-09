using Microsoft.EntityFrameworkCore;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedPricingModels
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (
                var context = new DataContext(
                    serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()
                )
            )
            {
                // Look for any pricing models.
                if (await context.PricingModels.AnyAsync())
                {
                    return; // DB has been seeded
                }

                context.PricingModels.AddRange(
                    new PricingModel
                    {
                        ModelName = "Standard",
                        AdultPrice = 12.50m,
                        ChildPrice = 8.00m,
                        SeniorPrice = 10.00m,
                    },
                    new PricingModel
                    {
                        ModelName = "Premium",
                        AdultPrice = 15.00m,
                        ChildPrice = 10.00m,
                        SeniorPrice = 12.50m,
                    },
                    new PricingModel
                    {
                        ModelName = "Discount",
                        AdultPrice = 10.00m,
                        ChildPrice = 6.00m,
                        SeniorPrice = 8.00m,
                    }
                );

                await context.SaveChangesAsync();
            }
        }
    }
}
