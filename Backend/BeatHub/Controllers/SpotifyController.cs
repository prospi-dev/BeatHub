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
    public async Task<IActionResult> GetNewReleases([FromQuery] int limit = 20, [FromQuery] int offset = 0)
    {
        var content = await _spotifyApiService.GetNewReleasesAsync(limit, offset);
        return Content(content, "application/json");
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] string type, [FromQuery] int limit = 20, [FromQuery] int offset = 0, [FromQuery] string album_type = null)
    {
        var content = await _spotifyApiService.SearchAsync(q, type, limit, offset, album_type);
        return Content(content, "application/json");
    }

    [HttpGet("albums/{id}")]
    public async Task<IActionResult> GetAlbum(string id)
    {
        var content = await _spotifyApiService.GetAlbumAsync(id);
        return Content(content, "application/json");
    }

    [HttpGet("albums/{id}/tracks")]
    public async Task<IActionResult> GetAlbumTracks(string id, [FromQuery] int limit = 50, [FromQuery] int offset = 0)
    {
        var content = await _spotifyApiService.GetAlbumTracksAsync(id, limit, offset);
        return Content(content, "application/json");
    }

    [HttpGet("artists")]
    public async Task<IActionResult> GetArtists([FromQuery] string ids)
    {
        var content = await _spotifyApiService.GetArtistsAsync(ids);
        return Content(content, "application/json");
    }

    [HttpGet("artists/{id}")]
    public async Task<IActionResult> GetArtist(string id)
    {
        var content = await _spotifyApiService.GetArtistAsync(id);
        return Content(content, "application/json");
    }

    [HttpGet("artists/{id}/albums")]
    public async Task<IActionResult> GetArtistAlbums(string id, [FromQuery] int limit = 20, [FromQuery] int offset = 0)
    {
        var content = await _spotifyApiService.GetArtistAlbumsAsync(id, limit, offset);
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

    [HttpGet("featured-playlists")]
    public async Task<IActionResult> GetFeaturedPlaylists()
    {
        var content = await _spotifyApiService.GetFeaturedPlaylistsAsync();
        return Content(content, "application/json");
    }

    [HttpGet("playlists/{playlistId}")]
    public async Task<IActionResult> GetPlaylistsTracks(string playlistId)
    {
        var content = await _spotifyApiService.GetPlaylistsTracksAsync(playlistId);
        return Content(content, "application/json");
    }
}