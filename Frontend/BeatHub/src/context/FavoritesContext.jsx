import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppAuth } from '../hooks/useAppAuth';
import { getUserFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite } from '../api/favorites';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { user } = useAppAuth();
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchFavorites();
        } else {
            setFavoriteIds(new Set());
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const favorites = await getUserFavorites();
            const ids = new Set(favorites.map(f => f.spotifyItemId));
            setFavoriteIds(ids);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = (itemId) => favoriteIds.has(itemId);

    const toggleFavorite = async (itemId, itemType) => {
        if (!user) return false;

        const currentlyFavorite = isFavorite(itemId);
        
        // Optimistic UI update
        const newSet = new Set(favoriteIds);
        if (currentlyFavorite) {
            newSet.delete(itemId);
        } else {
            newSet.add(itemId);
        }
        setFavoriteIds(newSet);

        try {
            if (currentlyFavorite) {
                await apiRemoveFavorite(itemId);
            } else {
                await apiAddFavorite({ spotifyItemId: itemId, itemType });
            }
            return true;
        } catch (error) {
            console.error("Error toggling favorite:", error);
            // Revert on error
            setFavoriteIds(favoriteIds);
            return false;
        }
    };

    return (
        <FavoritesContext.Provider value={{ isFavorite, toggleFavorite, loading }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);