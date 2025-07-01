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

    public async Task<string> GetNewReleasesAsync(int limit = 20, int offset = 0)
    {
        var client = await GetAuthenticatedClientAsync();
        var response = await client.GetAsync($"https://api.spotify.com/v1/browse/new-releases?limit={limit}&offset={offset}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> SearchAsync(string query, string type, int limit = 20, int offset = 0, string albumType = null)
    {
        var client = await GetAuthenticatedClientAsync();
        var url = $"https://api.spotify.com/v1/search?q={Uri.EscapeDataString(query)}&type={Uri.EscapeDataString(type)}&limit={limit}&offset={offset}";

        if (!string.IsNullOrEmpty(albumType))
        {
            url += $"&album_type={Uri.EscapeDataString(albumType)}";
        }

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

    public async Task<string> GetAlbumTracksAsync(string albumId, int limit = 50, int offset = 0)
    {
        var client = await GetAuthenticatedClientAsync();
        var response = await client.GetAsync($"https://api.spotify.com/v1/albums/{albumId}/tracks?limit={limit}&offset={offset}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> GetArtistsAsync(string artistIds)
    {
        var client = await GetAuthenticatedClientAsync();
        var response = await client.GetAsync($"https://api.spotify.com/v1/artists?ids={Uri.EscapeDataString(artistIds)}");
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

    public async Task<string> GetArtistAlbumsAsync(string artistId, int limit = 20, int offset = 0)
    {
        var client = await GetAuthenticatedClientAsync();
        var response = await client.GetAsync($"https://api.spotify.com/v1/artists/{artistId}/albums?limit={limit}&offset={offset}");
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

    public async Task<string> GetFeaturedPlaylistsAsync()
    {
        var client = await GetAuthenticatedClientAsync();
        var response = await client.GetAsync("https://api.spotify.com/v1/browse/featured-playlists");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> GetPlaylistsTracksAsync(string playlistId)
    {
        var client = await GetAuthenticatedClientAsync();
        var response = await client.GetAsync($"https://api.spotify.com/v1/playlists/{playlistId}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }
}