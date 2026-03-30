using System.ComponentModel.DataAnnotations;

namespace BeatHub.DTOs
{
    public class CreateFavoriteDto
    {
        [Required]
        public string SpotifyItemId { get; set; } = string.Empty;

        [Required]
        public string ItemType { get; set; } = string.Empty; // "artist", "album", or "track"
    }
}