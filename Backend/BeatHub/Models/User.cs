using Microsoft.AspNetCore.Mvc.ViewEngines;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BeatHub.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "Username is required.")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [JsonIgnore]
    [MinLength(5, ErrorMessage = "Password must be at least 5 characters long.")]
    public string PasswordHash { get; set; } = string.Empty;

    [StringLength(2048)]
    public string? AvatarUrl { get; set; }
    public ICollection<UserFollow> Followers { get; set; } = new List<UserFollow>();
    public ICollection<UserFollow> Following { get; set; } = new List<UserFollow>();

    // Navigation Properties
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<FavoriteItem> Favorites { get; set; } = new List<FavoriteItem>();
}