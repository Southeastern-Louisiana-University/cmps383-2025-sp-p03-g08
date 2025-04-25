using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Users;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly DataContext context;
    private readonly UserManager<User> userManager;
    private static readonly Random _random = new();

    public OrdersController(DataContext context, UserManager<User> userManager)
    {
        this.context = context;
        this.userManager = userManager;
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> CheckoutOrder([FromBody] OrderDto dto)
    {
        var currentUser = await userManager.GetUserAsync(User);
        var userId = currentUser?.Id;
        bool buyingTickets = dto.Seats != null;
        var tickets = new List<Ticket>();

        if (buyingTickets)
        {
            HashSet<int> seatIds = dto.Seats.Select(_ => _.Id).ToHashSet();

            var takenSeats = await context
                .Tickets.Where(t => t.ShowingId == dto.ShowingId && seatIds.Contains(t.SeatId))
                .Select(t => t.SeatId)
                .ToListAsync();

            var existingSeatCount = await context
                .Seats.Where(s => seatIds.Contains(s.Id))
                .CountAsync();

            if (seatIds.Count != existingSeatCount)
            {
                return Conflict("One or more requested seats do not exist.");
            }

            if (takenSeats.Any())
            {
                return Conflict(
                    $"The following seats are already taken: {string.Join(", ", takenSeats)}"
                );
            }
        }

        using var transaction = await context.Database.BeginTransactionAsync();

        try
        {
            if (buyingTickets)
            {
                var showing = await context
                    .Showings.Include(s => s.PricingModel)
                    .Include(s => s.Movie)
                    .FirstOrDefaultAsync(s => s.Id == dto.ShowingId);

                if (showing?.PricingModel == null)
                {
                    return BadRequest("Invalid showing or missing pricing model.");
                }

                var purchaser = currentUser?.UserName ?? dto.GuestName;
                tickets = dto
                    .Seats.Select(seat => new Ticket
                    {
                        SeatId = seat.Id,
                        ShowingId = dto.ShowingId ?? 0,
                        TicketCode = GenerateTicketCode(),
                        TicketType = seat.TicketType,
                        UserId = userId,
                        PurchasedBy = purchaser,
                        PurchaseDate = DateTime.UtcNow,
                        Price = CalculatePrice(showing.PricingModel, seat.TicketType),
                    })
                    .ToList();
            }

            var confirmationCode = GenerateConfirmationCode();
            var order = new Order
            {
                User = currentUser,
                UserId = userId,
                Email = dto.Email ?? currentUser?.Email,
                CreatedAt = DateTime.UtcNow,
                ConfirmationCode = confirmationCode,
                Tickets = buyingTickets ? tickets : null,
                MenuItems = new List<MenuItem>(),
            };

            var validFoodItems = dto
                .FoodItems?.Where(item => item.MenuItemId > 0 && item.Quantity > 0)
                .ToList();

            if (validFoodItems != null && validFoodItems.Any())
            {
                foreach (var item in validFoodItems)
                {
                    var menuItem = await context.MenuItems.FindAsync(item.MenuItemId);
                    if (menuItem == null)
                    {
                        return BadRequest($"Menu item with ID {item.MenuItemId} not found.");
                    }

                    for (int i = 0; i < item.Quantity; i++)
                    {
                        order.MenuItems.Add(menuItem);
                    }
                }
            }
            context.Orders.Add(order);
            await context.SaveChangesAsync();
            await transaction.CommitAsync();

            List<GetTicketDto> detailedTickets = new List<GetTicketDto>();
            if (buyingTickets)
            {
                detailedTickets = await context
                    .Tickets.Where(t => t.OrderId == order.Id)
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
                    .ToListAsync();
            }
            return Ok(
                new GetOrderDto
                {
                    Id = order.Id,
                    ConfirmationCode = order.ConfirmationCode,
                    CreatedAt = order.CreatedAt,
                    Email = order.Email,
                    Tickets = detailedTickets.Any() ? detailedTickets : null,
                    FoodItems = order
                        .MenuItems.GroupBy(m => m.Id)
                        .Select(g => new MenuItemOrderDto
                        {
                            MenuItemId = g.Key,
                            Quantity = g.Count(),
                        })
                        .ToList(),
                }
            );
        }
        catch (DbUpdateException)
        {
            await transaction.RollbackAsync();
            return Conflict("A seat was taken just before checkout completed.");
        }
    }

    private string GenerateTicketCode()
    {
        var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        return new string(
            Enumerable.Range(0, 8).Select(_ => chars[_random.Next(chars.Length)]).ToArray()
        );
    }

    private string GenerateConfirmationCode()
    {
        var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        return new string(
            Enumerable.Range(0, 6).Select(_ => chars[_random.Next(chars.Length)]).ToArray()
        );
    }

    private decimal CalculatePrice(PricingModel pricingModel, string ticketType)
    {
        return ticketType switch
        {
            "Adult" => pricingModel.AdultPrice,
            "Child" => pricingModel.ChildPrice,
            "Senior" => pricingModel.SeniorPrice,
            _ => pricingModel.AdultPrice,
        };
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(int id)
    {
        var order = await context
            .Orders.Include(o => o.Tickets)
            .Include(o => o.MenuItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound("Order not found.");
        }

        var dto = new GetOrderDto
        {
            Id = order.Id,
            ConfirmationCode = order.ConfirmationCode,
            CreatedAt = order.CreatedAt,
            Email = order.Email,
            Tickets = context
                .Tickets.Where(t => t.OrderId == order.Id)
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
                .ToList(),
            FoodItems = order
                .MenuItems.GroupBy(m => m.Id)
                .Select(g => new MenuItemOrderDto { MenuItemId = g.Key, Quantity = g.Count() })
                .ToList(),
        };

        return Ok(dto);
    }

    [HttpGet("by-confirmation/{confirmationCode}")]
    public async Task<IActionResult> GetOrderByConfirmationCode(string confirmationCode)
    {
        var order = await context
            .Orders.Include(o => o.Tickets)
            .Include(o => o.MenuItems)
            .FirstOrDefaultAsync(o => o.ConfirmationCode == confirmationCode);

        if (order == null)
        {
            return NotFound("Order not found.");
        }

        var dto = new GetOrderDto
        {
            Id = order.Id,
            ConfirmationCode = order.ConfirmationCode,
            CreatedAt = order.CreatedAt,
            Email = order.Email,
            Tickets = context
                .Tickets.Where(t => t.OrderId == order.Id)
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
                .ToList(),
            FoodItems = order
                .MenuItems.GroupBy(m => m.Id)
                .Select(g => new MenuItemOrderDto { MenuItemId = g.Key, Quantity = g.Count() })
                .ToList(),
        };

        return Ok(dto);
    }
}
