import { useState, useCallback } from 'react';
import { getNewReleases, getPopularArtists, getTopTracks, search } from '../api/spotifyService.js';

export const useCatalogData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const sortResults = (results, sortBy, type) => {
        const sorted = [...results];
        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'date-newest':
            case 'date':
                if (type === 'albums') return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
                return sorted;
            case 'date-oldest':
                if (type === 'albums') return sorted.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
                return sorted;
            case 'popularity':
                return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            case 'followers':
                return sorted.sort((a, b) => (b.followers?.total || 0) - (a.followers?.total || 0));
            default:
                return sorted;
        }
    };

    const fetchInitialData = useCallback(async (type, isSearchActive, searchQuery, sortBy) => {
        try {
            setLoading(true);
            setPage(1);
            let result = [];
            const currentOffset = 0;

            if (isSearchActive && searchQuery.trim()) {
                const searchResult = await search(searchQuery, type, currentOffset);
                switch (type) {
                    case 'albums': result = searchResult.albums?.items || []; break;
                    case 'artists': result = searchResult.artists?.items || []; break;
                    case 'tracks': result = searchResult.tracks?.items || []; break;
                }
            } else {
                switch (type) {
                    case 'albums':
                        const albumsData = await getNewReleases(currentOffset);
                        result = albumsData.albums?.items || [];
                        break;
                    case 'artists': result = await getPopularArtists(currentOffset); break;
                    case 'tracks': result = await getTopTracks(currentOffset); break;
                }
            }

            result = sortResults(result, sortBy, type);
            setData(result);
            setHasMore(result.length >= 20);
            setError(null);
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
            setError(`Failed to load ${type}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMoreData = useCallback(async (type, isSearchActive, searchQuery, sortBy) => {
        const nextPage = page + 1;
        setPage(nextPage);
        setLoadingMore(true);
        const nextOffset = nextPage * 20;

        try {
            let result = [];
            if (isSearchActive && searchQuery.trim()) {
                const searchResult = await search(searchQuery, type, nextOffset);
                switch (type) {
                    case 'albums': result = searchResult.albums?.items || []; break;
                    case 'artists': result = searchResult.artists?.items || []; break;
                    case 'tracks': result = searchResult.tracks?.items || []; break;
                }
            } else {
                switch (type) {
                    case 'albums':
                        const albumsData = await getNewReleases(nextOffset);
                        result = albumsData.albums?.items || [];
                        break;
                    case 'artists': result = await getPopularArtists(nextOffset); break;
                    case 'tracks': result = await getTopTracks(nextOffset); break;
                }
            }

            result = sortResults(result, sortBy, type);
            setData(prev => [...prev, ...result]);
            setHasMore(result.length >= 20);
        } catch (err) {
            console.error(`Error loading more ${type}:`, err);
            setError(`Failed to load more ${type}`);
        } finally {
            setLoadingMore(false);
        }
    }, [page]);

    return { data, loading, error, hasMore, loadingMore, fetchInitialData, loadMoreData };
};