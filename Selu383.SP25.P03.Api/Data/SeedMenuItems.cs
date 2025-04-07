using Microsoft.EntityFrameworkCore;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedMenuItems
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (
                var context = new DataContext(
                    serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()
                )
            )
            {
                // Look for any existing menu items to avoid reseeding.
                if (await context.MenuItems.AnyAsync())
                {
                    return; // DB has been seeded
                }

                // Add the specified menu items
                context.MenuItems.AddRange(
                    new MenuItem
                    {
                        Category = "Appetizer",
                        Name = "Mozarella Sticks",
                        Description = "4 Fried Mozarella Sticks served with marinara sauce",
                        ImageURL = "https://imgur.com/ZPJRaPj.jpg", // Replace with a valid URL if available
                        Price = 5.99m,
                        Calories = 350,
                    },
                    new MenuItem
                    {
                        Category = "Appetizer",
                        Name = "Sliders",
                        Description =
                            "3 Delicious Cheeseburger Sliders dressed with cheddar cheese and a pickle",
                        ImageURL = "https://imgur.com/TkGozIU.jpg", // Replace with a valid URL if available
                        Price = 7.99m,
                        Calories = 450,
                    },
                    new MenuItem
                    {
                        Category = "Appetizer",
                        Name = "Egg Rolls",
                        Description = "6 Tasty Southwest Egg Rolls served with dipping sauce",
                        ImageURL = "https://imgur.com/nAikWFY.jpg", // Replace with a valid URL if available
                        Price = 4.99m,
                        Calories = 300,
                    }
                );

                await context.SaveChangesAsync();
            }
        }
    }
}
