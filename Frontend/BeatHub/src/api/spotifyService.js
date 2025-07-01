import api from './axios';

export const getNewReleases = async (offset = 0) => {
    const response = await api.get(`/new-releases?limit=20&offset=${offset}`);
    return response.data;
};

export const search = async (query, type, offset = 0) => {
    if (!query || !query.trim()) {
        throw new Error('Search query is required')
    }
    
    const typeMapping = {
        'albums': 'album',
        'artists': 'artist', 
        'tracks': 'track',
        'album': 'album',
        'artist': 'artist',
        'track': 'track'
    }
    
    const spotifyType = typeMapping[type]
    if (!spotifyType) {
        throw new Error('Invalid search type')
    }
    
    let searchUrl = `/search?q=${encodeURIComponent(query.trim())}&type=${spotifyType}&limit=20&offset=${offset}`
    
    if (spotifyType === 'album') {
        searchUrl += `&album_type=album`
    }
    
    const response = await api.get(searchUrl);
    return response.data;
};

export const getArtistsFromNewReleases = async () => {
    const newReleases = await getNewReleases()
    const basicArtists = newReleases.albums?.items?.map(album => album.artists[0]) || []

    const uniqueBasicArtists = basicArtists.filter((artist, index, self) =>
        index === self.findIndex(a => a.id === artist.id)
    )

    const artistIds = uniqueBasicArtists.map(artist => artist.id).slice(0, 20)
    const detailedArtists = await getArtistsDetails(artistIds)

    return detailedArtists
}

export const getArtistsByGenres = async () => {
    const genres = ['pop', 'rock', 'hip-hop', 'electronic', 'indie', 'latin']

    try {
        const searchPromises = genres.map(genre =>
            api.get(`/search?q=genre:${genre}&type=artist`)
        )

        const results = await Promise.all(searchPromises)
        const artists = []

        results.forEach(result => {
            if (result.data.artists?.items) {
                artists.push(...result.data.artists.items)
            }
        })

        const uniqueArtists = artists.filter((artist, index, self) =>
            index === self.findIndex(a => a.id === artist.id)
        )

        return uniqueArtists.slice(0, 50)
    } catch (error) {
        console.error('Error fetching artists by genres:', error)
        return []
    }
}

export const getPopularArtists = async (offset = 0) => {
    try {
        if (offset === 0) {
            const [newReleaseArtists, genreArtists] = await Promise.all([
                getArtistsFromNewReleases(),
                getArtistsByGenres()
            ])

            const allArtists = [...newReleaseArtists, ...genreArtists]
            const uniqueArtists = allArtists.filter((artist, index, self) =>
                index === self.findIndex(a => a.id === artist.id)
            )

            return uniqueArtists.slice(0, 50) 
        } else {
            const [newReleaseArtists, genreArtists] = await Promise.all([
                getArtistsFromNewReleases(),
                getArtistsByGenres()
            ])

            const allArtists = [...newReleaseArtists, ...genreArtists]
            const uniqueArtists = allArtists.filter((artist, index, self) =>
                index === self.findIndex(a => a.id === artist.id)
            )

            return uniqueArtists.slice(offset, offset + 20)
        }
    } catch (error) {
        console.error('Error fetching popular artists:', error)
        return []
    }
}

export const getArtistsDetails = async (artistIds) => {
    try {
        const idsString = artistIds.join(',')
        const response = await api.get(`/artists?ids=${idsString}`)
        return response.data.artists || []
    } catch (error) {
        console.error('Error fetching artists details:', error)
        return []
    }
}

export const getTopTracks = async (offset = 0) => {
    try {
        const newReleases = await getNewReleases(0) 
        const albums = newReleases.albums?.items?.slice(0, 50) || []

        const trackPromises = albums.map(album =>
            api.get(`/albums/${album.id}/tracks?limit=1`)
        )

        const results = await Promise.all(trackPromises)
        const tracks = []

        results.forEach((result, index) => {
            if (result.data.items) {
                const albumInfo = albums[index]
                const tracksWithAlbum = result.data.items.map(track => ({
                    ...track,
                    album: {
                        id: albumInfo.id,
                        name: albumInfo.name,
                        images: albumInfo.images,
                        release_date: albumInfo.release_date
                    }
                }))
                tracks.push(...tracksWithAlbum)
            }
        })

        return tracks.slice(offset, offset + 20)
    } catch (error) {
        console.error('Error fetching tracks from albums:', error)
        return []
    }
}