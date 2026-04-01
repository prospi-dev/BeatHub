using BeatHub.Data;
using BeatHub.DTOs;
using BeatHub.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BeatHub.Controllers
{
    /// <summary>
    /// Controller for managing reviews.
    /// Handles creating, reading, updating, and deleting user reviews for Spotify items.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context)
        {
            _context = context;
        }

        /// Retrieves all reviews for a specific Spotify item.
        // GET: api/Reviews?spotifyItemId={spotifyItemId}
        [HttpGet("item/{spotifyItemId}")] 
        [AllowAnonymous]
        public async Task<IActionResult> GetReviewsByItem(string spotifyItemId)
        {
            // Include user so we can see who made the review (its Username)
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.SpotifyItemId == spotifyItemId)
                .OrderByDescending(r => r.CreatedAt) // Newest first
                .Select(r => new
                {
                    r.Id,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt,
                    r.ItemType,
                    Username = r.User.Username,
                    Email = r.User.Email,
                    AvatarUrl = r.User.AvatarUrl
                })
                .ToListAsync();

            return Ok(reviews);
        }

        /// Creates a new review for a Spotify item.
        // POST: api/Reviews
        [HttpPost]
        public async Task<IActionResult> CreateReview(CreateReviewDto reviewDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token.");
            }

            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.UserId == userId && r.SpotifyItemId == reviewDto.SpotifyItemId);

            if (existingReview != null)
            {
                return BadRequest("You have already reviewed this item. Edit your existing review instead.");
            }

            var review = new Review
            {
                UserId = userId,
                SpotifyItemId = reviewDto.SpotifyItemId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                ItemType = reviewDto.ItemType,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Review saved successfully!", reviewId = review.Id });
        }

        /// Updates an existing review.
        // PUT api/Reviews/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> EditReview(int id, UpdateReviewDto reviewDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token.");
            }

            var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

            if (review == null)
            {
                return NotFound("Review not found or you do not have permission to edit it.");
            }

            review.Rating = reviewDto.Rating;
            review.Comment = reviewDto.Comment;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Review updated successfully!" });
        }

        /// Deletes a specific review completely.
        // DELETE: api/Reviews/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token.");
            }

            var review = await _context.Reviews.FindAsync(id);

            if (review == null)
            {
                return NotFound("Review not found.");
            }

            if (review.UserId != userId)
            {
                return Forbid("You are not authorized to delete this review.");
            }

            _context.Reviews.Remove(review);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Review deleted successfully!" });
        }
    }
}