using BeatHub.Data;
using BeatHub.DTOs;
using BeatHub.Services;
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
        private readonly CloudinaryService _cloudinary;
        public UsersController(AppDbContext context, CloudinaryService cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
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

        // POST: api/Users/upload-avatar
        // Receives a file, uploads to Cloudinary, returns the URL
        [HttpPost("upload-avatar")]
        [Authorize]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided." });

            try
            {
                var url = await _cloudinary.UploadAvatarAsync(file);
                return Ok(new { url });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // POST: api/Users/avatar
        // Saves a Cloudinary URL to the user's profile (no base64 allowed)
        [HttpPost("avatar")]
        [Authorize]
        public async Task<IActionResult> UpdateAvatar([FromBody] UpdateAvatarDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int loggedUserId))
                return Unauthorized("Invalid user token.");

            // Guard: reject base64 strings
            if (string.IsNullOrWhiteSpace(dto.AvatarUrl) || dto.AvatarUrl.StartsWith("data:"))
                return BadRequest(new { message = "AvatarUrl must be a valid URL, not a base64 string." });

            if (!Uri.TryCreate(dto.AvatarUrl, UriKind.Absolute, out _))
                return BadRequest(new { message = "AvatarUrl is not a valid URL." });

            var user = await _context.Users.FindAsync(loggedUserId);
            if (user == null) return NotFound("User not found.");

            user.AvatarUrl = dto.AvatarUrl;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Avatar updated successfully!", avatarUrl = user.AvatarUrl });
        }
    }
}
