using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Features.Tickets
{
    [ApiController]
    [Route("api/tickets")]
    public class TicketsController : ControllerBase
    {
        private readonly DataContext context;
        private readonly UserManager<User> userManager;
        private static readonly Random _random = new();

        public TicketsController(DataContext context, UserManager<User> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        // GET: api/tickets
        [HttpGet]
        public async Task<IActionResult> GetAllTickets()
        {
            var tickets = await context
                .Tickets.Include(t => t.Seat)
                .Include(t => t.Showing)
                .Select(t => new GetTicketDto
                {
                    Id = t.Id,
                    SeatId = t.SeatId,
                    SeatLabel = t.Seat.Row + "-" + t.Seat.Id,
                    TicketType = t.TicketType,
                    ShowingTime = t.Showing.StartTime,
                    PurchasedDate = t.PurchaseDate,
                    TicketCode = t.TicketCode,
                    MovieName = t.Showing.Movie.Title,
                    CinemaHallName = t.Showing.CinemaHall.Name,
                    Price = t.Price,
                })
                .ToListAsync();

            return Ok(tickets);
        }

        // GET: api/tickets/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketById(Guid id)
        {
            var ticket = await context
                .Tickets.Include(t => t.Showing)
                .ThenInclude(s => s.Movie)
                .Include(t => t.Showing)
                .ThenInclude(s => s.CinemaHall)
                .Select(t => new GetTicketDto
                {
                    Id = t.Id,
                    SeatId = t.SeatId,
                    SeatLabel = t.Seat.Row + "-" + t.Seat.Id,
                    TicketType = t.TicketType,
                    ShowingTime = t.Showing.StartTime,
                    PurchasedDate = t.PurchaseDate,
                    TicketCode = t.TicketCode,
                    MovieName = t.Showing.Movie.Title,
                    CinemaHallName = t.Showing.CinemaHall.Name,
                    Price = t.Price,
                })
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }

        [HttpGet("for-user")]
        public async Task<IActionResult> GetTickets([FromQuery] string? guestName)
        {
            // If user is logged in
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                var user = await userManager.GetUserAsync(User);
                if (user == null)
                    return Unauthorized();

                var userTickets = await context
                    .Tickets.Where(t => t.UserId == user.Id && t.IsRedeemed == false)
                    .Include(t => t.Showing)
                    .ThenInclude(s => s.Movie)
                    .Include(t => t.Showing)
                    .ThenInclude(s => s.CinemaHall)
                    .Select(t => new GetTicketDto
                    {
                        Id = t.Id,
                        SeatId = t.SeatId,
                        SeatLabel = t.Seat.Row + "-" + t.Seat.Id,
                        TicketType = t.TicketType,
                        ShowingTime = t.Showing.StartTime,
                        PurchasedDate = t.PurchaseDate,
                        TicketCode = t.TicketCode,
                        MovieName = t.Showing.Movie.Title,
                        CinemaHallName = t.Showing.CinemaHall.Name,
                        Price = t.Price,
                    })
                    .OrderByDescending(t => t.PurchasedDate)
                    .ToListAsync();

                return Ok(userTickets);
            }

            // If guest (not logged in), look up by guest name
            if (!string.IsNullOrEmpty(guestName))
            {
                var guestTickets = await context
                    .Tickets.Where(t => t.PurchasedBy == guestName && t.IsRedeemed == false)
                    .Include(t => t.Showing)
                    .ThenInclude(s => s.Movie)
                    .Include(t => t.Showing)
                    .ThenInclude(s => s.CinemaHall)
                    .Select(t => new GetTicketDto
                    {
                        Id = t.Id,
                        SeatId = t.SeatId,
                        SeatLabel = t.Seat.Row + "-" + t.Seat.Id,
                        TicketType = t.TicketType,
                        ShowingTime = t.Showing.StartTime,
                        PurchasedDate = t.PurchaseDate,
                        TicketCode = t.TicketCode,
                        MovieName = t.Showing.Movie.Title,
                        CinemaHallName = t.Showing.CinemaHall.Name,
                        Price = t.Price,
                    })
                    .OrderByDescending(t => t.PurchasedDate)
                    .ToListAsync();

                return Ok(guestTickets);
            }

            return BadRequest("No guest name provided and no user authenticated.");
        }

        // POST: api/tickets
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] createTicketDto ticketDto)
        {
            User? currentUser = null;

            // Try to get logged-in user (returns null if not authenticated)
            if (User.Identity?.IsAuthenticated == true)
            {
                currentUser = await userManager.GetUserAsync(User);
            }

            // Generate unique ticket code
            string newCode;
            int maxAttempts = 10;
            int attempt = 0;

            while (true)
            {
                newCode = GenerateTicketCode();
                attempt++;
                if (!await context.Tickets.AnyAsync(t => t.TicketCode == newCode))
                {
                    break; // Found a unique code, exit loop
                }
                if (attempt > maxAttempts)
                {
                    return BadRequest("Unable to generate a unique ticket code.");
                }
            }

            var purchaserName =
                currentUser?.UserName != null ? currentUser.UserName : ticketDto.GuestName;

            if (purchaserName == null)
            {
                return BadRequest("Purchaser name is required.");
            }

            var showing = await context
                .Showings.Include(_ => _.PricingModel)
                .FirstOrDefaultAsync(_ => _.Id == ticketDto.ShowingId);

            if (showing == null)
            {
                return BadRequest("Showing does not exist");
            }

            Ticket ticket = new()
            {
                SeatId = ticketDto.SeatId,
                ShowingId = ticketDto.ShowingId,
                PurchaseDate = DateTime.UtcNow,
                PurchasedBy = purchaserName,
                UserId = currentUser?.Id,
                Price = CalculatePrice(showing.PricingModel, ticketDto.TicketType),
                TicketType = ticketDto.TicketType,
                TicketCode = newCode,
            };

            ticket.TicketCode = newCode;
            ticket.PurchaseDate = DateTime.UtcNow;

            bool isTaken = await context.Tickets.AnyAsync(_ =>
                _.ShowingId == ticketDto.ShowingId && _.SeatId == ticketDto.SeatId
            );

            try
            {
                context.Tickets.Add(ticket);
                await context.SaveChangesAsync(); // Will fail if seat already taken due to unique constraint
            }
            catch (DbUpdateException)
            {
                return Conflict("Seat was already taken.");
            }

            ticket = await context
                .Tickets.Include(t => t.Seat)
                .Include(t => t.Showing)
                .ThenInclude(s => s.Movie)
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == ticket.Id);

            // ✅ Map to DTO
            var dto = new GetTicketDto
            {
                Id = ticket.Id,
                SeatId = ticket.SeatId,
                SeatLabel = ticket.Seat.Row + "-" + ticket.Seat.Id,
                TicketType = ticket.TicketType,
                ShowingTime = ticket.Showing.StartTime,
                PurchasedDate = ticket.PurchaseDate,
                TicketCode = ticket.TicketCode,
                MovieName = ticket.Showing.Movie.Title,
                CinemaHallName = ticket.Showing.CinemaHall.Name,
                Price = ticket.Price,
            };

            return CreatedAtAction(nameof(GetTicketById), new { id = ticket.Id }, dto);
        }

        [HttpPost("bulk")]
        public async Task<IActionResult> CreateTicketsBulk([FromBody] BulkCreateTicketsDto dto)
        {
            var currentUser = await userManager.GetUserAsync(User);
            var userId = currentUser?.Id;

            var seatIds = dto.Seats.Select(_ => _.Id).ToList();
            // Step 1: Check if any seat is already taken
            var takenSeats = await context
                .Tickets.Where(t => t.ShowingId == dto.ShowingId && seatIds.Contains(t.SeatId))
                .Select(t => t.SeatId)
                .ToListAsync();

            var existingSeatCount = await context
                .Seats.Where(_ => seatIds.Contains(_.Id))
                .CountAsync();

            if (seatIds.Count() != existingSeatCount)
            {
                return Conflict("One or more seats do not exist.");
            }
            if (takenSeats.Any())
            {
                return Conflict(
                    $"The following seats are already taken: {string.Join(", ", takenSeats)}"
                );
            }

            // Step 2: Start transaction
            using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                var showingInfo = await context
                    .Showings.Include(s => s.PricingModel)
                    .Include(_ => _.Movie)
                    .Select(_ => new
                    {
                        _.Id,
                        _.PricingModel,
                        _.Movie.Title,
                    })
                    .FirstOrDefaultAsync(s => s.Id == dto.ShowingId);

                if (showingInfo.PricingModel == null)
                {
                    return BadRequest("Invalid showing or pricing data.");
                }

                var tickets = dto
                    .Seats.Select(seat => new Ticket
                    {
                        SeatId = seat.Id,
                        ShowingId = dto.ShowingId,
                        TicketCode = GenerateTicketCode(),
                        TicketType = seat.TicketType,
                        UserId = userId,
                        PurchasedBy =
                            currentUser?.UserName != null ? currentUser?.UserName : dto.GuestName,
                        PurchaseDate = DateTime.UtcNow,
                        Price = CalculatePrice(showingInfo.PricingModel, seat.TicketType),
                    })
                    .ToList();

                context.Tickets.AddRange(tickets);
                await context.SaveChangesAsync();

                await transaction.CommitAsync();

                var ticketIds = tickets.Select(_ => _.Id).ToList();

                var ticketDtos = context
                    .Tickets.Where(t => ticketIds.Contains(t.Id))
                    .Include(_ => _.Showing)
                    .Select(t => new GetTicketDto
                    {
                        Id = t.Id,
                        SeatId = t.SeatId,
                        SeatLabel = t.Seat.Row + "-" + t.Seat.Id,
                        TicketType = t.TicketType,
                        ShowingTime = t.Showing.StartTime,
                        PurchasedDate = t.PurchaseDate,
                        TicketCode = t.TicketCode,
                        MovieName = t.Showing.Movie.Title,
                        CinemaHallName = t.Showing.CinemaHall.Name,
                        Price = t.Price,
                    })
                    .ToList();

                return Ok(ticketDtos);
            }
            catch (DbUpdateException)
            {
                await transaction.RollbackAsync();
                return Conflict("A seat was taken just before checkout completed.");
            }
        }

        // PUT: api/tickets/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(Guid id, [FromBody] Ticket updatedTicket)
        {
            var existingTicket = await context.Tickets.FindAsync(id);

            if (existingTicket == null)
            {
                return NotFound();
            }

            existingTicket.SeatId = updatedTicket.SeatId;
            existingTicket.ShowingId = updatedTicket.ShowingId;
            existingTicket.Price = updatedTicket.Price;
            existingTicket.UserId = updatedTicket.UserId;

            await context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/tickets/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(Guid id)
        {
            var ticket = await context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            context.Tickets.Remove(ticket);
            await context.SaveChangesAsync();
            return NoContent();
        }

        public static string GenerateTicketCode(int length = 6, string prefix = "TK")
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var code = new string(
                Enumerable.Repeat(chars, length).Select(s => s[_random.Next(s.Length)]).ToArray()
            );

            return prefix + code;
        }

        public static decimal CalculatePrice(PricingModel model, string ticketType)
        {
            decimal price;

            switch (ticketType)
            {
                case "Adult":
                    price = model.AdultPrice;
                    break;

                case "Child":
                    price = model.ChildPrice;
                    break;

                case "Senior":
                    price = model.SeniorPrice;
                    break;
                default:
                    throw new Exception("Invalid ticket type");
            }
            return price;
        }
    }
}
