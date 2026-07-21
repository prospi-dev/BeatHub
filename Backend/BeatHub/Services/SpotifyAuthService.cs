using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

public class SpotifyAuthService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly SemaphoreSlim _lock = new(1, 1);

    private string? _cachedToken;
    private DateTime _tokenExpiresAtUtc = DateTime.MinValue;

    public SpotifyAuthService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    public async Task<string> GetAccessTokenAsync()
    {
        // 1-minute safety margin so we never send a token that expires mid-request
        if (_cachedToken != null && DateTime.UtcNow < _tokenExpiresAtUtc - TimeSpan.FromMinutes(1))
        {
            return _cachedToken;
        }

        await _lock.WaitAsync();
        try
        {
            // Another request may have already refreshed it while we waited for the lock
            if (_cachedToken != null && DateTime.UtcNow < _tokenExpiresAtUtc - TimeSpan.FromMinutes(1))
            {
                return _cachedToken;
            }

            var clientId = _configuration["Spotify:ClientId"] ?? Environment.GetEnvironmentVariable("SPOTIFY_CLIENT_ID");
            var clientSecret = _configuration["Spotify:ClientSecret"] ?? Environment.GetEnvironmentVariable("SPOTIFY_CLIENT_SECRET");

            var client = _httpClientFactory.CreateClient();

            var authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));

            var request = new HttpRequestMessage(HttpMethod.Post, "https://accounts.spotify.com/api/token");
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeader);
            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "grant_type", "client_credentials" }
            });

            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            var accessToken = doc.RootElement.GetProperty("access_token").GetString();
            var expiresInSeconds = doc.RootElement.GetProperty("expires_in").GetInt32();

            _cachedToken = accessToken;
            _tokenExpiresAtUtc = DateTime.UtcNow.AddSeconds(expiresInSeconds);

            return accessToken!;
        }
        finally
        {
            _lock.Release();
        }
    }
}
