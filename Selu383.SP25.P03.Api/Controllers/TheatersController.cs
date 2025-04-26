using System.Text.Json;
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
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public TheatersController(
            DataContext dataContext,
            UserManager<User> userManager,
            IConfiguration config
        )
        {
            this.dataContext = dataContext;
            theaters = dataContext.Set<Theater>();
            users = dataContext.Set<User>();
            this.userManager = userManager;
            _config = config;
            _httpClient = new HttpClient();
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
            var result = await GetTheaterDtos(theaters.Where(x => x.Id == id))
                .FirstOrDefaultAsync();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("zip")]
        public async Task<IActionResult> GetNearestTheatersByZip(
            [FromQuery] string zipCode,
            [FromQuery] int maxDistance = 50
        )
        {
            var apiKey = _config["GOOGLE_GEOCODING_API_KEY"];
            var url =
                $"https://maps.googleapis.com/maps/api/geocode/json?address={zipCode}&key={apiKey}";

            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Failed to fetch from Google Maps API");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            var data = JsonDocument.Parse(responseString);

            if (data.RootElement.GetProperty("status").GetString() != "OK")
            {
                return BadRequest("Invalid ZIP code or API error");
            }

            var location = data
                .RootElement.GetProperty("results")[0]
                .GetProperty("geometry")
                .GetProperty("location");

            double lat = location.GetProperty("lat").GetDouble();
            double lng = location.GetProperty("lng").GetDouble();

            // 🔥 Now find theaters near this lat/lng
            var theaters = await dataContext
                .Theaters.Where(t =>
                    CalculateDistance(lat, lng, t.Latitude, t.Longitude) <= maxDistance
                )
                .Select(x => new TheaterDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Address = x.Address,
                    ManagerId = x.ManagerId,
                })
                .ToListAsync();

            return Ok(theaters);
        }

        [HttpGet("nearest-location")]
        public async Task<IActionResult> GetNearestTheatersByLocation(
            [FromQuery] double lat,
            [FromQuery] double lng,
            [FromQuery] int maxDistance
        )
        {
            var theaters = await dataContext.Theaters.ToListAsync();

            // Calculate distances
            var nearbyTheaters = theaters
                .Where(t => CalculateDistance(lat, lng, t.Latitude, t.Longitude) <= maxDistance)
                .Select(x => new TheaterDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Address = x.Address,
                    ManagerId = x.ManagerId,
                })
                .ToList();

            return Ok(nearbyTheaters);
        }

        // Haversine formula
        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 3958.8; // Radius of the Earth in miles
            var dLat = DegreesToRadians(lat2 - lat1);
            var dLon = DegreesToRadians(lon2 - lon1);
            lat1 = DegreesToRadians(lat1);
            lat2 = DegreesToRadians(lat2);

            var a =
                Math.Pow(Math.Sin(dLat / 2), 2)
                + Math.Pow(Math.Sin(dLon / 2), 2) * Math.Cos(lat1) * Math.Cos(lat2);
            var c = 2 * Math.Asin(Math.Sqrt(a));
            return R * c;
        }

        private double DegreesToRadians(double degrees)
        {
            return degrees * Math.PI / 180;
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
            if (
                string.IsNullOrWhiteSpace(dto.Name)
                || dto.Name.Length > 120
                || string.IsNullOrWhiteSpace(dto.Address)
            )
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
