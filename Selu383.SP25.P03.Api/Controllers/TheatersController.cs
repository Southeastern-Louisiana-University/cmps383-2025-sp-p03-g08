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
        public IQueryable<TheaterDto> GetAllTheaters()
        {
            return GetTheaterDtos(theaters);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<TheaterDto> GetTheaterById(int id)
        {
            var result = GetTheaterDtos(theaters.Where(x => x.Id == id)).FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet]
        [Route("nearest/{zipCode}")]
        public ActionResult<TheaterDto> GetNearestTheater(string zipCode)
        {
            if (string.IsNullOrWhiteSpace(zipCode))
            {
                return BadRequest("ZIP code is required");
            }

            // Get all theaters
            var allTheaters = theaters.ToList();
            
            if (!allTheaters.Any())
            {
                return NotFound("No theaters available");
            }

            // find theater with matching first 3 digits of ZIP code
            var nearestTheater = allTheaters
                .OrderBy(t => CalculateZipCodeSimilarity(t.ZipCode, zipCode))
                .FirstOrDefault();

            if (nearestTheater == null)
            {
                return NotFound("No theaters found near this ZIP code");
            }

            var dto = new TheaterDto
            {
                Id = nearestTheater.Id,
                Name = nearestTheater.Name,
                Address = nearestTheater.Address,
                ZipCode = nearestTheater.ZipCode,
                ManagerId = nearestTheater.ManagerId
            };

            return Ok(dto);
        }

        // similarity measure between ZIP codes, lower value means more similar
        private static int CalculateZipCodeSimilarity(string zip1, string zip2)
        {
            // If the first 3 digits match, they're in the same general area
            if (zip1.Length >= 3 && zip2.Length >= 3 && zip1.Substring(0, 3) == zip2.Substring(0, 3))
            {
                return 0;
            }

            // If the first 2 digits match, they're in the same region
            if (zip1.Length >= 2 && zip2.Length >= 2 && zip1.Substring(0, 2) == zip2.Substring(0, 2))
            {
                return 1;
            }

            // If the first digit matches, they're in the same state/area
            if (zip1.Length >= 1 && zip2.Length >= 1 && zip1[0] == zip2[0])
            {
                return 2;
            }

            // Otherwise, return a large distance
            return 999;
        }

        [HttpPost]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<TheaterDto> CreateTheater(TheaterDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var theater = new Theater
            {
                Name = dto.Name,
                Address = dto.Address,
                ManagerId = dto.ManagerId,
                ZipCode = dto.ZipCode,
            };
            theaters.Add(theater);

            dataContext.SaveChanges();

            dto.Id = theater.Id;

            return CreatedAtAction(nameof(GetTheaterById), new { id = dto.Id }, dto);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize]
        public async Task<ActionResult<TheaterDto>> UpdateTheater(int id, TheaterDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var currentUser = await userManager.GetUserAsync(User);

            if (!User.IsInRole(UserRoleNames.Admin) && currentUser.Id != dto.ManagerId)
            {
                return Forbid();
            }

            var theater = theaters.FirstOrDefault(x => x.Id == id);
            if (theater == null)
            {
                return NotFound();
            }

            theater.Name = dto.Name;
            theater.Address = dto.Address;
            theater.ZipCode = dto.ZipCode;

            if (User.IsInRole(UserRoleNames.Admin))
            {
                theater.ManagerId = dto.ManagerId;
            }

            dataContext.SaveChanges();

            dto.Id = theater.Id;
            dto.ManagerId = theater.ManagerId;

            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult DeleteTheater(int id)
        {
            var theater = theaters.FirstOrDefault(x => x.Id == id);
            if (theater == null)
            {
                return NotFound();
            }

            theaters.Remove(theater);

            dataContext.SaveChanges();

            return Ok();
        }

        private bool IsInvalid(TheaterDto dto)
        {
            return string.IsNullOrWhiteSpace(dto.Name)
                || dto.Name.Length > 120
                || string.IsNullOrWhiteSpace(dto.Address)
                || string.IsNullOrWhiteSpace(dto.ZipCode)
                || dto.ManagerId != null && !users.Any(x => x.Id == dto.ManagerId);
        }

        private static IQueryable<TheaterDto> GetTheaterDtos(IQueryable<Theater> theaters)
        {
            return theaters.Select(x => new TheaterDto
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address,
                ManagerId = x.ManagerId,
                ZipCode = x.ZipCode,
            });
        }
    }
}
