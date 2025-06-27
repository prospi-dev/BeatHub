using System.Net.Http.Headers;

public class SpotifyApiService
{
    private readonly SpotifyAuthService _authService;
    private readonly IHttpClientFactory _httpClientFactory;

    public SpotifyApiService(SpotifyAuthService authService, IHttpClientFactory httpClientFactory)
    {
        _authService = authService;
        _httpClientFactory = httpClientFactory;
    }

    private async Task<HttpClient> GetAuthenticatedClientAsync()
    {
        var token = await _authService.GetAccessTokenAsync();
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }

    public async Task<string> GetNewReleasesAsync()
    {
        var client = await GetAuthenticatedClientAsync();
        var response = await client.GetAsync("https://api.spotify.com/v1/browse/new-releases");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> SearchAsync(string query, string type)
    {
        var client = await GetAuthenticatedClientAsync();
        var url = $"https://api.spotify.com/v1/search?q={Uri.EscapeDataString(query)}&type={Uri.EscapeDataString(type)}";
        var response = await client.GetAsync(url);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> GetAlbumAsync(string albumId)
    {
        var client = await GetAuthenticatedClientAsync();
        var response = await client.GetAsync($"https://api.spotify.com/v1/albums/{albumId}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> GetArtistAsync(string artistId)
    {
        var client = await GetAuthenticatedClientAsync();
        var response = await client.GetAsync($"https://api.spotify.com/v1/artists/{artistId}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> GetArtistAlbumsAsync(string artistId)
    {
        var client = await GetAuthenticatedClientAsync();
        var response = await client.GetAsync($"https://api.spotify.com/v1/artists/{artistId}/albums");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> GetArtistTopTracksAsync(string artistId, string country = "US")
    {
        var client = await GetAuthenticatedClientAsync();
        var response = await client.GetAsync($"https://api.spotify.com/v1/artists/{artistId}/top-tracks?country={country}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> GetTrackAsync(string trackId)
    {
        var client = await GetAuthenticatedClientAsync();
        var response = await client.GetAsync($"https://api.spotify.com/v1/tracks/{trackId}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }
}
