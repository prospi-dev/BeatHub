using Microsoft.AspNetCore.Mvc.ViewEngines;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BeatHub.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [JsonIgnore]
    public string PasswordHash { get; set; } = string.Empty;

    [StringLength(500)]
    public string? AvatarUrl { get; set; }
    public ICollection<UserFollow> Followers { get; set; } = new List<UserFollow>();
    public ICollection<UserFollow> Following { get; set; } = new List<UserFollow>();

    // Navigation Properties
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<FavoriteItem> Favorites { get; set; } = new List<FavoriteItem>();
}