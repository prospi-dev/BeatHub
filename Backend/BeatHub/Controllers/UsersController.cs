using BeatHub.Data;
using BeatHub.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

            bool isFollowing = false;

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out int loggedUserId))
            {
                isFollowing = await _context.UserFollows
                    .AnyAsync(uf => uf.FollowerId == loggedUserId && uf.FollowingId == user.Id);
            }


            // We map it to an anonymous object 
            // IMPORTANT: For security reasons, we do not return the email address or password hash.
            var userProfile = new
            {
                Username = user.Username,
                AvatarUrl = user.AvatarUrl,
                JoinedAt = user.Reviews.FirstOrDefault()?.CreatedAt ?? DateTime.UtcNow, 
                TotalReviews = user.Reviews.Count,
                TotalFavorites = user.Favorites.Count,
                isFollowing = isFollowing,
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
                }),
                
            };

            return Ok(userProfile);
        }

        // POST: api/Users/avatar
        [HttpPost("avatar")]
        [Authorize]
        public async Task<IActionResult> UpdateAvatar([FromBody] UpdateAvatarDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int loggedUserId))
                return Unauthorized("Invalid user token.");

            // Guard: reject base64 strings — only accept real URLs
            if (string.IsNullOrWhiteSpace(dto.AvatarUrl) || dto.AvatarUrl.StartsWith("data:"))
                return BadRequest("AvatarUrl must be a valid URL, not a base64 string. Upload the image to a storage service first.");

            if (!Uri.TryCreate(dto.AvatarUrl, UriKind.Absolute, out _))
                return BadRequest("AvatarUrl is not a valid URL.");

            var user = await _context.Users.FindAsync(loggedUserId);
            if (user == null) return NotFound("User not found.");

            user.AvatarUrl = dto.AvatarUrl;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Avatar updated successfully!", avatarUrl = user.AvatarUrl });
        }
    }
}