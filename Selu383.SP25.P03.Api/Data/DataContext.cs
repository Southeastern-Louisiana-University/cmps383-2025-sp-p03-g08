using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Data
{
    public class DataContext
        : IdentityDbContext<
            User,
            Role,
            int,
            IdentityUserClaim<int>,
            UserRole,
            IdentityUserLogin<int>,
            IdentityRoleClaim<int>,
            IdentityUserToken<int>
        >
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options) { }

        public DbSet<Theater> Theaters { get; set; }
        public DbSet<CinemaHall> CinemaHalls { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Showing> Showings { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<PricingModel> PricingModels { get; set; }

        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderMenuItem> OrderMenuItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserRole>().HasKey(x => new { x.UserId, x.RoleId });

            builder
                .Entity<User>()
                .HasMany(e => e.UserRoles)
                .WithOne(x => x.User)
                .HasForeignKey(e => e.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<Role>()
                .HasMany(e => e.UserRoles)
                .WithOne(x => x.Role)
                .HasForeignKey(e => e.RoleId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Ticket-Seating relationship
            builder
                .Entity<Ticket>()
                .HasOne(t => t.Seat)
                .WithMany() // Assuming Seat doesn't have Tickets as a navigation property
                .HasForeignKey(t => t.SeatId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            // Configure Ticket-Showing relationship
            builder
                .Entity<Ticket>()
                .HasOne(t => t.Showing)
                .WithMany() // Assuming Showing doesn't have Tickets as a navigation property
                .HasForeignKey(t => t.ShowingId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Ticket>().HasIndex(t => t.TicketCode).IsUnique();
            builder.Entity<Ticket>().HasIndex(t => new { t.ShowingId, t.SeatId }).IsUnique();
        }
    }
}
