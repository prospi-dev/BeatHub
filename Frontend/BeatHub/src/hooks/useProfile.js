import { useState, useEffect, useCallback, useRef } from 'react';
import { getUserProfile } from '../api/users';
import { getTrackDetails, getAlbumDetails, getArtistsDetails } from '../api/spotifyService';

const ITEMS_PER_PAGE = 5;

export const useProfile = (username, debouncedSearch, favFilter) => {
    // Raw data from backend (IDs only)
    const [profile, setProfile] = useState(null);
    const [rawReviews, setRawReviews] = useState([]);
    const [rawFavorites, setRawFavorites] = useState([]);
const [initialIsFollowing, setInitialIsFollowing] = useState(false);

    // Hydrated data with Spotify info
    const [enrichedReviews, setEnrichedReviews] = useState([]);
    const [enrichedFavorites, setEnrichedFavorites] = useState([]);

    // Loading states
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [loadingFavs, setLoadingFavs] = useState(false);
    const [error, setError] = useState(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    // Use debouncedSearch in useEffect and filters, not searchQuery directly

    // Pagination
    const ITEMS_PER_PAGE = 5;
    const [reviewsPage, setReviewsPage] = useState(1);
    const [favsPage, setFavsPage] = useState(1);

    // Why useRef and not useState for the cache? Because useRef stores the value between renders without causing a new render.
    // If I used useState, saving an item in the cache would cause a re-render, which would re-execute the effect, which would save more items… infinite loop.
    // useRef is invisible to React: it changes the value but React doesn't know about it or react to it.
    const spotifyCache = useRef(new Map()); // persists across renders, doesn't cause re-renders

    // Helper: Function to fetch Spotify data for an item
    const fetchSpotifyDetails = useCallback(async (item) => {
        // 1. Is it already in the component's local cache?
        if (spotifyCache.current.has(item.spotifyItemId)) {
            return { ...item, spotifyData: spotifyCache.current.get(item.spotifyItemId) };
        }

        try {
            let spotifyData = null;
            if (item.itemType === 'track') {
                const res = await getTrackDetails(item.spotifyItemId);
                spotifyData = { name: res.track.name, image: res.track.album.images[0]?.url, artist: res.track.artists[0]?.name };
            } else if (item.itemType === 'album') {
                const res = await getAlbumDetails(item.spotifyItemId);
                spotifyData = { name: res.album.name, image: res.album.images[0]?.url, artist: res.album.artists[0]?.name };
            } else if (item.itemType === 'artist') {
                const res = await getArtistsDetails(item.spotifyItemId);
                spotifyData = { name: res.artist.name, image: res.artist.images[0]?.url, artist: 'Artist' };
            }

            // 2. Save to cache before returning
            spotifyCache.current.set(item.spotifyItemId, spotifyData);
            return { ...item, spotifyData };
        } catch (e) {
            const fallback = { name: 'Unknown Item', image: null, artist: 'Unknown' };
            spotifyCache.current.set(item.spotifyItemId, fallback);
            return { ...item, spotifyData: fallback };
        }
    }, []);

    // 1. INITIAL LOAD
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoadingProfile(true);
                const data = await getUserProfile(username);
                setProfile(data);
                setInitialIsFollowing(data.isFollowing || false);
                setRawReviews(data.reviews || []);
                setRawFavorites(data.favorites || []);
                setError(null);
            } catch (err) {
                setError("User not found or an error occurred.");
            } finally {
                setLoadingProfile(false);
            }
        };

        if (username) {
            fetchProfileData();
            setEnrichedReviews([]);
            setEnrichedFavorites([]);
            setReviewsPage(1);
            setFavsPage(1);
        }
    }, [username]);

    // 2. LAZY HYDRATION REVIEWS
    useEffect(() => {
        // Abort Controller: While Spotify responds (can take 200-500ms), the user might clear the search and type something else.
        // Without the controller, two responses could arrive and the second might overwrite the first unpredictably.
        const controller = new AbortController();

        const hydrateVisibleReviews = async () => {
            if (rawReviews.length === 0) return;
            setLoadingReviews(true);

            const itemsToHydrate = debouncedSearch
                ? rawReviews
                : rawReviews.slice(0, reviewsPage * ITEMS_PER_PAGE);

            const hydrated = await Promise.all(itemsToHydrate.map(fetchSpotifyDetails));

            // If this effect was already canceled (user kept typing), we don't update state
            if (!controller.signal.aborted) {
                setEnrichedReviews(hydrated);
                setLoadingReviews(false);
            }
        };

        hydrateVisibleReviews();
        return () => controller.abort(); // cleanup on unmount or re-run
    }, [reviewsPage, rawReviews, debouncedSearch, fetchSpotifyDetails]);

    // 3. LAZY HYDRATION FAVORITES
    useEffect(() => {
        const controller = new AbortController();
        const hydrateVisibleFavs = async () => {
            if (rawFavorites.length === 0) {
                setEnrichedFavorites([]);
                setLoadingFavs(false);
                return;
            }
            if (favsPage === 1) setLoadingFavs(true);

            const itemsToHydrate = debouncedSearch ? rawFavorites : rawFavorites.slice(0, favsPage * ITEMS_PER_PAGE);
            const hydrated = await Promise.all(itemsToHydrate.map(fetchSpotifyDetails));

            if (!controller.signal.aborted) {
                setEnrichedFavorites(hydrated);
                setLoadingFavs(false);
            }
        };
        hydrateVisibleFavs();
        return () => controller.abort();
    }, [favsPage, rawFavorites, debouncedSearch, fetchSpotifyDetails]);

    useEffect(() => { setReviewsPage(1); setFavsPage(1); }, [debouncedSearch]);
    useEffect(() => { setFavsPage(1); }, [favFilter]);

    // 4. FILTERING
    const lowerQuery = debouncedSearch.toLowerCase();

    const displayedReviews = enrichedReviews.filter(review => {
        if (!debouncedSearch) return true;
        return (
            review.spotifyData?.name?.toLowerCase().includes(lowerQuery) ||
            review.spotifyData?.artist?.toLowerCase().includes(lowerQuery) ||
            review.comment?.toLowerCase().includes(lowerQuery) ||
            review.itemType.includes(lowerQuery)
        );
    });

    const displayedFavorites = enrichedFavorites.filter(fav => {
        const matchesTab = favFilter === 'all' || fav.itemType === favFilter;
        const matchesSearch = !debouncedSearch ||
            fav.spotifyData?.name?.toLowerCase().includes(lowerQuery) ||
            fav.spotifyData?.artist?.toLowerCase().includes(lowerQuery) ||
            fav.itemType.includes(lowerQuery);
        return matchesTab && matchesSearch;
    });

    const hasMoreReviews = !debouncedSearch && enrichedReviews.length < rawReviews.length;
    const hasMoreFavorites = !debouncedSearch && enrichedFavorites.length < rawFavorites.length;

    return {
        profile, loadingProfile, error,
        rawReviews, rawFavorites,
        displayedReviews, displayedFavorites,
        loadingReviews, loadingFavs,
        reviewsPage, setReviewsPage,
        favsPage, setFavsPage,
        hasMoreReviews, hasMoreFavorites,
        initialIsFollowing
    };
};