using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SpotifyController : ControllerBase
{
    private readonly SpotifyApiService _spotifyApiService;

    public SpotifyController(SpotifyApiService spotifyApiService)
    {
        _spotifyApiService = spotifyApiService;
    }

    [HttpGet("new-releases")]
    public async Task<IActionResult> GetNewReleases()
    {
        var content = await _spotifyApiService.GetNewReleasesAsync();
        return Content(content, "application/json");
    }

    [HttpGet("artists/{id}")]
    public async Task<IActionResult> GetArtist(string id)
    {
        var content = await _spotifyApiService.GetArtistAsync(id);
        return Content(content, "application/json");
    }
}
