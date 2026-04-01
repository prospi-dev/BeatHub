using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeatHub.Models
{
    public class FavoriteItem
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "User ID is required.")]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Required(ErrorMessage = "Spotify Item ID is required.")]
        public string SpotifyItemId { get; set; } = string.Empty; // Spotify ID 

        [Required(ErrorMessage = "Item type is required.")]
        public string ItemType { get; set; } = string.Empty; // "artist", "album", or "track"

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}