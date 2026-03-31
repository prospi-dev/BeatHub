namespace BeatHub.Models
{
    public class UserFollow
    {
        public int FollowerId { get; set; } // Follower
        public User Follower { get; set; }

        public int FollowingId { get; set; } // Followee
        public User Following { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}