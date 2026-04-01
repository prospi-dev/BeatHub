using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BeatHub.Data;
using BeatHub.Models;
using System.Security.Claims;

namespace BeatHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class NetworkController : ControllerBase
    {
        private readonly AppDbContext _db;

        public NetworkController(AppDbContext db)
        {
            _db = db;
        }

        // POST: api/network/follow/{username}
        [HttpPost("follow/{username}")]
        public async Task<IActionResult> FollowUser(string username)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token.");
            }

            var targetUser = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (targetUser == null) return NotFound("User not found.");
            if (userId == targetUser.Id) return BadRequest("You cannot follow yourself.");

            var alreadyFollowing = await _db.UserFollows
                .AnyAsync(uf => uf.FollowerId == userId && uf.FollowingId == targetUser.Id);

            if (alreadyFollowing) return Ok(new { message = "Already following" });

            _db.UserFollows.Add(new UserFollow
            {
                FollowerId = userId,
                FollowingId = targetUser.Id
            });
            await _db.SaveChangesAsync();

            return Ok(new { message = $"You are now following {username}" });
        }

        // DELETE: api/network/unfollow/{username}
        [HttpDelete("unfollow/{username}")]
        public async Task<IActionResult> UnfollowUser(string username)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token.");
            }
            var targetUser = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (targetUser == null) return NotFound("User not found.");

            var follow = await _db.UserFollows
                .FirstOrDefaultAsync(uf => uf.FollowerId == userId && uf.FollowingId == targetUser.Id);

            if (follow == null) return Ok(new { message = "Not following" });

            _db.UserFollows.Remove(follow);
            await _db.SaveChangesAsync();

            return Ok(new { message = $"Unfollowed {username}" });
        }

        // GET: api/network/feed
        [HttpGet("feed")]
        public async Task<IActionResult> GetActivityFeed()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token.");
            }

            var followingIds = await _db.UserFollows
                .Where(uf => uf.FollowerId == userId)
                .Select(uf => uf.FollowingId)
                .ToListAsync();

            // Get the latest 20 reviews from followed users, we map them to an anonymous object that includes the username for easier display in the feed
            var reviews = await _db.Reviews
                .Include(r => r.User)
                .Where(r => followingIds.Contains(r.UserId))
                .OrderByDescending(r => r.CreatedAt)
                .Take(20)
                .Select(r => new
                {
                    ActivityType = "REVIEW",
                    Id = r.Id,
                    Username = r.User.Username,
                    AvatarUrl = r.User.AvatarUrl,
                    SpotifyItemId = r.SpotifyItemId,
                    ItemType = r.ItemType,
                    Rating = (int?)r.Rating, // Nullable int because favorites won't have a rating
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            // Get the latest 20 favorites from followed users, we map them to the same structure as reviews for easier concatenation
            var favorites = await _db.Favorites
                .Include(f => f.User)
                .Where(f => followingIds.Contains(f.UserId))
                .OrderByDescending(f => f.AddedAt)
                .Take(20)
                .Select(f => new
                {
                    ActivityType = "FAVORITE",
                    Id = f.Id,
                    Username = f.User.Username,
                    AvatarUrl = f.User.AvatarUrl,
                    SpotifyItemId = f.SpotifyItemId,
                    ItemType = f.ItemType,
                    Rating = (int?)null, // Favorites don't have a rating
                    Comment = (string)null, // Favorites don't have a comment
                    CreatedAt = f.AddedAt // We map AddedAt to CreatedAt for easier sorting later
                })
                .ToListAsync();

            // Sort both reviews and favorites by CreatedAt (or AddedAt) and take the top 20 overall
            var feed = reviews.Concat(favorites)
                .OrderByDescending(a => a.CreatedAt)
                .Take(20)
                .ToList();


            return Ok(feed);
        }

        // GET: api/network/search?q={query}
        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return Ok(new List<object>());
            }

            var query = q.ToLower();

            var users = await _db.Users
                .Where(u => u.Username.ToLower().Contains(query))
                .Take(20)
                .Select(u => new
                {
                    u.Username,
                    u.AvatarUrl
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}