using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/theaters")]
    [ApiController]
    public class TheatersController : ControllerBase
    {
        private readonly DbSet<Theater> theaters;
        private readonly DataContext dataContext;
        private readonly DbSet<User> users;
        private readonly UserManager<User> userManager;

        public TheatersController(DataContext dataContext, UserManager<User> userManager)
        {
            this.dataContext = dataContext;
            theaters = dataContext.Set<Theater>();
            users = dataContext.Set<User>();
            this.userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TheaterDto>>> GetAllTheaters()
        {
            var results = await GetTheaterDtos(theaters).ToListAsync();
            return Ok(results);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TheaterDto>> GetTheaterById(int id)
        {
            var result = await GetTheaterDtos(theaters.Where(x => x.Id == id)).FirstOrDefaultAsync();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("zipcode/{zipcode}")]
        public async Task<ActionResult<TheaterDto>> GetTheaterByZipcode(string zipcode)
        {
               if (zipcode == null || zipcode.Length != 5)
                {
                    throw new Exception("Please enter a 5 digit zip code.");
                }
                
                var theater = await GetTheaterDtos(theaters.Where(_=>_.Address.Contains(zipcode))).FirstOrDefaultAsync();

                if(theater is null)
                {
                    return NotFound();
                };

                return theater;
        }

        [HttpPost]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult<TheaterDto>> CreateTheater(TheaterDto dto)
        {
            if (await IsInvalid(dto))
            {
                return BadRequest();
            }

            var theater = new Theater
            {
                Name = dto.Name,
                Address = dto.Address,
                ManagerId = dto.ManagerId,
            };
            theaters.Add(theater);

            await dataContext.SaveChangesAsync();

            dto.Id = theater.Id;

            return CreatedAtAction(nameof(GetTheaterById), new { id = dto.Id }, dto);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<TheaterDto>> UpdateTheater(int id, TheaterDto dto)
        {
            if (await IsInvalid(dto))
            {
                return BadRequest();
            }

            var currentUser = await userManager.GetUserAsync(User);

            if (!User.IsInRole(UserRoleNames.Admin) && currentUser.Id != dto.ManagerId)
            {
                return Forbid();
            }

            var theater = await theaters.FirstOrDefaultAsync(x => x.Id == id);
            if (theater == null)
            {
                return NotFound();
            }

            theater.Name = dto.Name;
            theater.Address = dto.Address;

            if (User.IsInRole(UserRoleNames.Admin))
            {
                theater.ManagerId = dto.ManagerId;
            }

            await dataContext.SaveChangesAsync();

            dto.Id = theater.Id;
            dto.ManagerId = theater.ManagerId;

            return Ok(dto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult> DeleteTheater(int id)
        {
            var theater = await theaters.FirstOrDefaultAsync(x => x.Id == id);
            if (theater == null)
            {
                return NotFound();
            }

            theaters.Remove(theater);

            await dataContext.SaveChangesAsync();

            return Ok();
        }

        private async Task<bool> IsInvalid(TheaterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name)
                || dto.Name.Length > 120
                || string.IsNullOrWhiteSpace(dto.Address))
            {
                return true;
            }

            if (dto.ManagerId != null)
            {
                bool exists = await users.AnyAsync(x => x.Id == dto.ManagerId);
                if (!exists)
                {
                    return true;
                }
            }

            return false;
        }

        private static IQueryable<TheaterDto> GetTheaterDtos(IQueryable<Theater> theaters)
        {
            return theaters.Select(x => new TheaterDto
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address,
                ManagerId = x.ManagerId,
            });
        }
    }
}
