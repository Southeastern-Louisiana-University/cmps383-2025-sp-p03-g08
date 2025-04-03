using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/cinemahalls")]
    [ApiController]
    public class CinemaHallsController : ControllerBase
    {
        private readonly DbSet<Theater> theaters;
        private readonly DbSet<CinemaHall> cinemaHalls;
        private readonly DataContext context;

        public CinemaHallsController(DataContext dataContext)
        {
            this.context = dataContext;
            theaters = dataContext.Set<Theater>();
            cinemaHalls = dataContext.Set<CinemaHall>();
        }

        [HttpGet]
        public async Task<ActionResult<List<CinemaHall>>> GetCinemaHalls()
        {
            try
            {
                var cinemaHalls = await context.CinemaHalls.ToListAsync();

                return Ok(cinemaHalls);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal Server Error: {e.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CinemaHall>> GetCinemaHallById(int id)
        {
            try
            {
                var cinemaHall = await context.CinemaHalls.FirstOrDefaultAsync(_ => _.Id == id);

                if (cinemaHall is null)
                {
                    return NotFound();
                }
                var newCinemaHallDto = new CinemaHallDto
                {
                    Id = cinemaHall.Id,
                    Name = cinemaHall.Name,
                    TheaterId = cinemaHall.TheaterId,
                };

                return Ok(newCinemaHallDto);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal Server Error:  {e.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<CinemaHall>> CreateCinemaHall(
            CreateCinemaHallDto cinemaHallDTO
        )
        {
            try
            {
                var newCinemaHall = new CinemaHall
                {
                    Name = cinemaHallDTO.Name,
                    TheaterId = cinemaHallDTO.TheaterId,
                };

                await context.CinemaHalls.AddAsync(newCinemaHall);
                await context.SaveChangesAsync();

                newCinemaHall.Seats = SetDefaultSeats(newCinemaHall, 5, 5);

                await context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetCinemaHalls),
                    new { id = newCinemaHall.Id },
                    cinemaHallDTO
                );
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal Server Error: {e.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CinemaHall>> UpdateCinemaHall(
            int id,
            CreateCinemaHallDto cinemaHallDTO
        )
        {
            var cinemaHallToUpdate = await cinemaHalls.FirstOrDefaultAsync(_ => _.Id == id);

            if (cinemaHallToUpdate is not null)
            {
                cinemaHallToUpdate.Name = cinemaHallDTO.Name;
                cinemaHallToUpdate.TheaterId = cinemaHallDTO.TheaterId;
                await context.SaveChangesAsync();
                return Ok(cinemaHallToUpdate);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCinemaHall(int id)
        {
            var cinemaHall = await cinemaHalls.FirstOrDefaultAsync(_ => _.Id == id);

            if (cinemaHall is not null)
            {
                cinemaHalls.Remove(cinemaHall);

                await context.SaveChangesAsync();

                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

        private List<Seat> SetDefaultSeats(
            CinemaHall cinemaHall,
            int defaultRows,
            int defaultColumns
        )
        {
            var seats = new List<Seat>();

            for (int i = 0; i < defaultRows; i++)
            {
                char rowLabel = (char)('A' + i);

                for (int j = 0; j < defaultColumns; j++)
                {
                    seats.Add(
                        new Seat
                        {
                            Row = rowLabel, 
                            Number = j + 1, 
                            CinemaHallId = cinemaHall.Id, 
                        }
                    );
                }
            }

            return seats;
        }
    }
}
