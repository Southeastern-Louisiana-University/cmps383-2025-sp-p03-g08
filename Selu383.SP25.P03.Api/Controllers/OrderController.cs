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
            var confirmationCode = GenerateConfirmationCode();
            var order = new Order
            {
                User = currentUser,
                UserId = userId,
                Email = dto.Email ?? currentUser?.Email,
                CreatedAt = DateTime.UtcNow,
                ConfirmationCode = confirmationCode,
                Tickets = null, // Add tickets after
                OrderMenuItems = new List<OrderMenuItem>(),
            };

            context.Orders.Add(order);
            await context.SaveChangesAsync();
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
                        OrderId = order.Id,
                    })
                    .ToList();
                context.Tickets.AddRange(tickets);
            }
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
                }
            );
        }
        catch (DbUpdateException)
        {
            await transaction.RollbackAsync();
            return Conflict("A seat was taken just before checkout completed.");
        }
    }

    [HttpPost("checkout-food")]
    public async Task<IActionResult> CheckoutFoodOrder([FromBody] OrderDto dto)
    {
        var currentUser = await userManager.GetUserAsync(User);
        var userId = currentUser?.Id;

        if (dto.FoodItems == null || !dto.FoodItems.Any())
        {
            return BadRequest("No food items provided.");
        }

        var confirmationCode = GenerateConfirmationCode();

        var order = new Order
        {
            User = currentUser,
            UserId = userId,
            Email = dto.Email ?? currentUser?.Email,
            CreatedAt = DateTime.UtcNow,
            ConfirmationCode = confirmationCode,
            OrderMenuItems = new List<OrderMenuItem>(),
        };

        context.Orders.Add(order);
        await context.SaveChangesAsync();

        var newOrderMenuItems = new List<OrderMenuItem>();

        foreach (var item in dto.FoodItems)
        {
            var menuItemExists = await context.MenuItems.AnyAsync(m => m.Id == item.Id);

            if (!menuItemExists)
            {
                return BadRequest($"Menu item with ID {item.MenuItemId} not found.");
            }

            newOrderMenuItems.Add(
                new OrderMenuItem
                {
                    OrderId = order.Id,
                    MenuItemId = item.Id,
                    Quantity = item.Quantity,
                }
            );
        }

        context.OrderMenuItems.AddRange(newOrderMenuItems);
        await context.SaveChangesAsync();

        return Ok(
            new GetOrderDto
            {
                Id = order.Id,
                ConfirmationCode = order.ConfirmationCode,
                CreatedAt = order.CreatedAt,
                Email = order.Email,
                FoodItems = newOrderMenuItems
                    .Select(omi => new MenuItemOrderDto
                    {
                        MenuItemId = omi.MenuItemId,
                        Quantity = omi.Quantity,
                    })
                    .ToList(),
            }
        );
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
            .Include(o => o.OrderMenuItems)
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
                .OrderMenuItems.GroupBy(m => m.MenuItemId)
                .Select(g => new MenuItemOrderDto { MenuItemId = g.Key, Quantity = g.Count() })
                .ToList(),
        };

        return Ok(dto);
    }

    [HttpGet("by-confirmation")]
    public async Task<IActionResult> GetOrderByConfirmationCode([FromQuery] string code)
    {
        var order = await context
            .Orders.Include(o => o.Tickets)
            .ThenInclude(t => t.Showing)
            .ThenInclude(s => s.Movie)
            .Include(o => o.Tickets)
            .ThenInclude(t => t.Showing)
            .ThenInclude(s => s.CinemaHall)
            .Include(o => o.Tickets)
            .ThenInclude(t => t.Seat)
            .Include(o => o.OrderMenuItems)
            .ThenInclude(omi => omi.MenuItem)
            .FirstOrDefaultAsync(o => o.ConfirmationCode == code);

        if (order == null)
        {
            return NotFound();
        }

        return Ok(
            new
            {
                tickets = order.Tickets.Select(t => new
                {
                    t.Id,
                    t.SeatId,
                    SeatLabel = t.Seat.Row + "-" + t.Seat.Id,
                    t.TicketType,
                    ShowingTime = t.Showing.StartTime,
                    PurchasedDate = t.PurchaseDate,
                    TicketCode = t.TicketCode,
                    MovieName = t.Showing.Movie.Title,
                    CinemaHallName = t.Showing.CinemaHall.Name,
                    Price = t.Price,
                }),
                foodItems = order.OrderMenuItems.Select(omi => new
                {
                    MenuItemId = omi.MenuItemId,
                    Name = omi.MenuItem.Name,
                    Quantity = omi.Quantity,
                    Price = omi.MenuItem.Price,
                }),
            }
        );
    }
}
