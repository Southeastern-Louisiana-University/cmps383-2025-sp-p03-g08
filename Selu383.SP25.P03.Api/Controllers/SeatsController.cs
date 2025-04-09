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
        public async Task<ActionResult<Seat>> GetSeat(int id)
        {
            var seat = await _context.Seats.FindAsync(id);
            if (seat == null)
            {
                return NotFound();
            }
            return seat;
        }

        [HttpGet("by-hall/{hallId}")]
        public async Task<ActionResult<List<GetSeatDto>>> GetByHallId(int hallId)
        {
            var hall = await _context.CinemaHalls.FirstOrDefaultAsync(_ => _.Id == hallId);

            if (hall is null)
            {
                return NotFound($"CinemaHall with Id: {hallId} does not exist.");
            }
            var seats = await _context
                .Seats.Where(_ => _.CinemaHallId == hallId)
                .Select(_ => new GetSeatDto
                {
                    Row = _.Row,
                    Number = _.Number,
                    SeatType = _.SeatType,
                    Status = _.Status,
                })
                .ToListAsync();

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
