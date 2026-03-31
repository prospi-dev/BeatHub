using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace BeatHub.Services
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IConfiguration config)
        {
            var account = new Account(
                config["Cloudinary:CloudName"],
                config["Cloudinary:ApiKey"],
                config["Cloudinary:ApiSecret"]
            );
            _cloudinary = new Cloudinary(account);
            _cloudinary.Api.Secure = true;
        }

        public async Task<string> UploadAvatarAsync(IFormFile file)
        {
            if (file.Length == 0)
                throw new ArgumentException("File is empty.");

            // Only allow images
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                throw new ArgumentException("Only JPEG, PNG, GIF and WEBP images are allowed.");

            // Max 5MB
            if (file.Length > 5 * 1024 * 1024)
                throw new ArgumentException("File size must be under 5MB.");

            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "beathub/avatars",
                // Auto crop to square and resize to 256x256
                Transformation = new Transformation()
                    .Width(256).Height(256).Crop("fill").Gravity("face")
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.Error != null)
                throw new Exception($"Cloudinary upload failed: {result.Error.Message}");

            return result.SecureUrl.ToString();
        }
    }
}