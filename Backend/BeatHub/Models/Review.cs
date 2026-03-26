using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeatHub.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Required]
        public string SpotifyItemId { get; set; } = string.Empty; // Album/Track Spotify ID

        [Required]
        public string ItemType { get; set; } = string.Empty; // album/track

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; } // 1 to 5 stars review

        [MaxLength(1000)]
        public string? Comment { get; set; } = string.Empty; // Review text

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}