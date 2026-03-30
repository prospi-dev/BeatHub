using BeatHub.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeatHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Users/{username}
        [HttpGet("{username}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserProfile(string username)
        {
            var user = await _context.Users
                .Include(u => u.Reviews)
                .Include(u => u.Favorites)
                .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // We map it to an anonymous object 
            // IMPORTANT: For security reasons, we do not return the email address or password hash.
            var userProfile = new
            {
                Username = user.Username,
                JoinedAt = user.Reviews.FirstOrDefault()?.CreatedAt ?? DateTime.UtcNow, // Si tuvieras un CreatedAt en User, úsalo aquí
                TotalReviews = user.Reviews.Count,
                TotalFavorites = user.Favorites.Count,
                Reviews = user.Reviews.OrderByDescending(r => r.CreatedAt).Select(r => new
                {
                    r.Id,
                    r.SpotifyItemId,
                    r.ItemType,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt
                }),
                Favorites = user.Favorites.OrderByDescending(f => f.AddedAt).Select(f => new
                {
                    f.SpotifyItemId,
                    f.ItemType,
                    f.AddedAt
                })
            };

            return Ok(userProfile);
        }
    }
}