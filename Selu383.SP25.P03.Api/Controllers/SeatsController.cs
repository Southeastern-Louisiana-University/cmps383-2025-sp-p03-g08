using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Seats;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatsController : ControllerBase
    {
        private readonly DataContext _context;

        public SeatsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Seats
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Seat>>> GetSeats()
        {
            return await _context.Seats.ToListAsync();
        }

        // GET: api/Seats/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SeatDto>> GetSeat(int id)
        {
            var seat = await _context
                .Seats.Where(s => s.Id == id)
                .Select(s => new SeatDto
                {
                    Row = s.Row,
                    Number = s.Number,
                    Status = s.Status,
                    SeatType = s.SeatType,
                })
                .FirstOrDefaultAsync();

            if (seat == null)
            {
                return NotFound();
            }
            return seat;
        }

        [HttpGet("by-showing/{showingId}")]
        public async Task<ActionResult<List<SeatDto>>> GetByHallId(int showingId)
        {
            var hallId = await _context
                .Showings.Where(s => s.Id == showingId)
                .Select(s => s.CinemaHallId)
                .FirstOrDefaultAsync();

            var hallCount = await _context.CinemaHalls.CountAsync(_ => _.Id == hallId);

            if (hallCount < 1)
            {
                return NotFound($"No cinema hall associated with showing with Id: {showingId}");
            }

            var seats = await _context
                .Seats.Where(_ => _.CinemaHallId == hallId)
                .Select(_ => new SeatDto
                {
                    Id = _.Id,
                    Row = _.Row,
                    Number = _.Number,
                    SeatType = _.SeatType,
                    Status = _.Status,
                })
                .ToListAsync();

            var ticketsSold = await _context
                .Tickets.Where(_ => _.ShowingId == showingId)
                .ToListAsync();

            foreach (var ticket in ticketsSold)
            {
                var seat = seats.FirstOrDefault(_ => _.Id == ticket.SeatId);
                if (seat is not null)
                {
                    seat.Status = "Unavailable";
                }
            }

            return Ok(seats);
        }

        // POST: api/Seats
        [HttpPost]
        public async Task<ActionResult<Seat>> PostSeat(Seat seat)
        {
            _context.Seats.Add(seat);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSeat), new { id = seat.Id }, seat);
        }

        // PUT: api/Seats/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSeat(int id, Seat seat)
        {
            if (id != seat.Id)
            {
                return BadRequest("Seat ID mismatch.");
            }

            _context.Entry(seat).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await SeatExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Seats/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeat(int id)
        {
            var seat = await _context.Seats.FindAsync(id);
            if (seat == null)
            {
                return NotFound();
            }

            _context.Seats.Remove(seat);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> SeatExists(int id)
        {
            return await _context.Seats.AnyAsync(e => e.Id == id);
        }
    }
}
