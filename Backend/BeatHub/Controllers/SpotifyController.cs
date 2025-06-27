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

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] string type)
    {
        var content = await _spotifyApiService.SearchAsync(q, type);
        return Content(content, "application/json");
    }

    [HttpGet("albums/{id}")]
    public async Task<IActionResult> GetAlbum(string id)
    {
        var content = await _spotifyApiService.GetAlbumAsync(id);
        return Content(content, "application/json");
    }

    [HttpGet("artists/{id}")]
    public async Task<IActionResult> GetArtist(string id)
    {
        var content = await _spotifyApiService.GetArtistAsync(id);
        return Content(content, "application/json");
    }

    [HttpGet("artists/{id}/albums")]
    public async Task<IActionResult> GetArtistAlbums(string id)
    {
        var content = await _spotifyApiService.GetArtistAlbumsAsync(id);
        return Content(content, "application/json");
    }

    [HttpGet("artists/{id}/top-tracks")]
    public async Task<IActionResult> GetArtistTopTracks(string id, [FromQuery] string country = "US")
    {
        var content = await _spotifyApiService.GetArtistTopTracksAsync(id, country);
        return Content(content, "application/json");
    }

    [HttpGet("tracks/{id}")]
    public async Task<IActionResult> GetTrack(string id)
    {
        var content = await _spotifyApiService.GetTrackAsync(id);
        return Content(content, "application/json");
    }
}
