using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;

namespace YourNamespace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemsController : ControllerBase
    {
        private readonly DataContext _context;

        public MenuItemsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/MenuItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItems()
        {
            return await _context.MenuItems.ToListAsync();
        }

        // GET: api/MenuItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MenuItem>> GetMenuItem(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }
            return menuItem;
        }

        [HttpGet("showcase")]
        public async Task<ActionResult<List<GetMenuItemDto>>> GetShowcasedItems()
        {
            var items = await _context
                .MenuItems.Where(_ => _.Showcase == true)
                .Select(_ => new GetMenuItemDto
                {
                    Category = _.Category,
                    Name = _.Name,
                    Description = _.Description,
                    ImageURL = _.ImageURL,
                    Price = _.Price,
                    Calories = _.Calories,
                })
                .Take(3)
                .ToListAsync();

            return Ok(items);
        }

        // POST: api/MenuItems
        [HttpPost]
        public async Task<ActionResult<MenuItem>> PostMenuItem(CreateMenuItemDto menuItemDto)
        {
            bool isShowcase = menuItemDto.Showcase;
            int showcaseCount = await _context.MenuItems.Where(_ => _.Showcase).CountAsync();

            if (isShowcase && showcaseCount >= 3)
            {
                isShowcase = false;
            }

            var newItem = new MenuItem
            {
                Category = menuItemDto.Category,
                Name = menuItemDto.Name,
                Description = menuItemDto.Description,
                ImageURL = menuItemDto.ImageURL,
                Price = menuItemDto.Price,
                Calories = menuItemDto.Calories,
                Showcase = isShowcase,
            };

            _context.MenuItems.AddAsync(newItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMenuItem), new { id = newItem.Id }, newItem);
        }

        // PUT: api/MenuItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMenuItem(int id, MenuItem menuItem)
        {
            if (id != menuItem.Id)
            {
                return BadRequest("MenuItem ID mismatch.");
            }

            _context.Entry(menuItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await MenuItemExists(id))
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

        // DELETE: api/MenuItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }

            _context.MenuItems.Remove(menuItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> MenuItemExists(int id)
        {
            return await _context.MenuItems.AnyAsync(e => e.Id == id);
        }
    }
}
