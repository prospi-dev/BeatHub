using System.Net.Http.Headers;
using System.Text.Json;

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

    public async Task<string> GetArtistAsync(string artistId)
    {
        var client = await GetAuthenticatedClientAsync();
        var response = await client.GetAsync($"https://api.spotify.com/v1/artists/{artistId}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }
}
