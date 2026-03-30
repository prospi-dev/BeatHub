import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ itemId, itemType, layout = 'hero' }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { user } = useAuth();
    const navigate = useNavigate();

    const isFav = isFavorite(itemId);

    const handleToggle = (e) => {
        e.stopPropagation(); 
        if (!user) {
            navigate('/login');
            return;
        }
        toggleFavorite(itemId, itemType);
    };

    if (layout === 'hero') {
        return (
            <button 
                onClick={handleToggle}
                className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 border group ${
                    isFav 
                    ? 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white' 
                    : 'border-gray-400 text-white hover:border-white'
                }`}
            >
                <FaHeart className={isFav ? 'text-orange-500 group-hover:text-white transition-colors' : ''} />
                {isFav ? 'Saved' : 'Save'}
            </button>
        );
    }

    return (
        <button 
            onClick={handleToggle}
            className={`transition-colors text-lg ${
                isFav ? 'text-orange-500' : 'text-gray-400 hover:text-white'
            }`}
            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
        >
            <FaHeart />
        </button>
    );
};

export default FavoriteButton;