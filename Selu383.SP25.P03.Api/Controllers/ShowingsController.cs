using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShowingsController : ControllerBase
    {
        private readonly DataContext _context;

        public ShowingsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Showings
        // GET: api/Showings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetShowingDto>>> GetShowings()
        {
            var showings = await _context
                .Showings.Include(s => s.Movie)
                .Include(s => s.CinemaHall)
                .Include(s => s.PricingModel)
                .Select(s => new GetShowingDto
                {
                    StartTime = s.StartTime,
                    ShowType = s.ShowType,
                    MovieName = s.Movie.Title,
                    CinemaHallName = s.CinemaHall.Name,
                })
                .ToListAsync();

            return showings;
        }

        // GET: api/Showings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GetShowingDto>> GetShowing(int id)
        {
            var showing = await _context
                .Showings.Include(s => s.Movie)
                .Include(s => s.CinemaHall)
                .Include(s => s.PricingModel)
                .Where(s => s.Id == id)
                .Select(s => new GetShowingDto
                {
                    StartTime = s.StartTime,
                    ShowType = s.ShowType,
                    MovieName = s.Movie.Title,
                    CinemaHallName = s.CinemaHall.Name,
                })
                .FirstOrDefaultAsync();

            if (showing == null)
            {
                return NotFound();
            }

            return showing;
        }

        [HttpPost]
        public async Task<ActionResult<Showing>> PostShowing(CreateShowingDto showingDto)
        {
            // Validate movie existence
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.Id == showingDto.MovieId);
            if (movie is null)
            {
                return NotFound($"Movie with ID {showingDto.MovieId} not found.");
            }

            // Validate cinema hall existence
            var cinemaHall = await _context.CinemaHalls.FirstOrDefaultAsync(c =>
                c.Id == showingDto.CinemaHallId
            );
            if (cinemaHall is null)
            {
                return NotFound($"Cinema Hall with ID {showingDto.CinemaHallId} not found.");
            }

            // Validate pricing model existence
            var pricingModel = await _context.PricingModels.FirstOrDefaultAsync(p =>
                p.Id == showingDto.PricingModelId
            );
            if (pricingModel is null)
            {
                return NotFound($"Pricing Model with ID {showingDto.PricingModelId} not found.");
            }

            DateTime endtime = showingDto.StartTime.Add(movie.Duration);

            var newShowing = new Showing
            {
                ShowType = showingDto.ShowType,
                MovieId = showingDto.MovieId,
                CinemaHallId = showingDto.CinemaHallId,
                PricingModelId = showingDto.PricingModelId,
                StartTime = showingDto.StartTime,
                EndTime = endtime,
            };

            await _context.Showings.AddAsync(newShowing);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetShowing), new { id = newShowing.Id }, showingDto);
        }

        // PUT: api/Showings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShowing(int id, CreateShowingDto showingDto)
        {
            // Retrieve the existing showing by id.
            var showing = await _context.Showings.FindAsync(id);
            if (showing == null)
            {
                return NotFound($"Movie with ID {id} not found.");
            }

            // Validate that the related movie exists and retrieve it to get its Duration.
            var movie = await _context.Movies.FindAsync(showingDto.MovieId);
            if (movie == null)
            {
                return NotFound($"Movie with ID {showingDto.MovieId} not found.");
            }

            // (Optional) Validate the existence of the CinemaHall.
            var cinemaHall = await _context.CinemaHalls.FindAsync(showingDto.CinemaHallId);
            if (cinemaHall == null)
            {
                return NotFound($"Cinema Hall with ID {showingDto.CinemaHallId} not found.");
            }

            // (Optional) Validate the existence of the PricingModel.
            var pricingModel = await _context.PricingModels.FindAsync(showingDto.PricingModelId);
            if (pricingModel == null)
            {
                return NotFound($"Pricing Model with ID {showingDto.PricingModelId} not found.");
            }

            // Update the existing showing with values from the DTO.
            showing.ShowType = showingDto.ShowType;
            showing.MovieId = showingDto.MovieId;
            showing.CinemaHallId = showingDto.CinemaHallId;
            showing.PricingModelId = showingDto.PricingModelId;
            showing.StartTime = showingDto.StartTime;
            showing.EndTime = showingDto.StartTime.Add(movie.Duration);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShowingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(showingDto);
        }

        // DELETE: api/Showings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShowing(int id)
        {
            var showing = await _context.Showings.FindAsync(id);
            if (showing == null)
            {
                return NotFound();
            }

            _context.Showings.Remove(showing);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShowingExists(int id)
        {
            return _context.Showings.Any(e => e.Id == id);
        }
    }
}
