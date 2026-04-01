using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeatHub.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "User ID is required.")]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Required(ErrorMessage = "Spotify Item ID is required.")]
        public string SpotifyItemId { get; set; } = string.Empty; // Album/Track Spotify ID

        [Required(ErrorMessage = "Item type is required.")]
        public string ItemType { get; set; } = string.Empty; // album/track

        [Required(ErrorMessage = "Rating is required.")]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5 stars.")]
        public int Rating { get; set; } // 1 to 5 stars review

        [MaxLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters.")]
        public string? Comment { get; set; } = string.Empty; // Review text

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}