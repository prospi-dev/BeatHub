using BeatHub.Data;
using BeatHub.DTOs;
using BeatHub.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BeatHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavoritesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Favorites/my-favorites
        [HttpGet("my-favorites")]
        public async Task<IActionResult> GetUserFavorites()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token.");
            }

            var favorites = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Select(f => new { f.SpotifyItemId, f.ItemType, f.AddedAt })
                .ToListAsync();

            return Ok(favorites);
        }

        // GET: api/Favorites/check/{spotifyItemId}
        [HttpGet("check/{spotifyItemId}")]
        public async Task<IActionResult> CheckFavorite(string spotifyItemId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token.");
            }

            var isFavorite = await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.SpotifyItemId == spotifyItemId);

            return Ok(new { isFavorite });
        }

        // POST: api/Favorites
        [HttpPost]
        public async Task<IActionResult> AddFavorite([FromBody] CreateFavoriteDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token.");
            }

            var existingFavorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.SpotifyItemId == dto.SpotifyItemId);

            if (existingFavorite != null)
            {
                return BadRequest(new { message = "Item is already in favorites." });
            }

            var favorite = new FavoriteItem
            {
                UserId = userId,
                SpotifyItemId = dto.SpotifyItemId,
                ItemType = dto.ItemType,
                AddedAt = DateTime.UtcNow
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Added to favorites successfully!", favoriteId = favorite.Id });
        }

        // DELETE: api/Favorites/{spotifyItemId}
        [HttpDelete("{spotifyItemId}")]
        public async Task<IActionResult> RemoveFavorite(string spotifyItemId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token.");
            }

            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.SpotifyItemId == spotifyItemId);

            if (favorite == null)
            {
                return NotFound(new { message = "Favorite not found." });
            }

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Removed from favorites successfully!" });
        }
    }
}