import axiosInstance from "./axiosInstance";

export const addFavorite = async (data) => {
    const response = await axiosInstance.post(`/favorites`, data);
    return response.data;
};

export const removeFavorite = async (spotifyItemId) => {
    const response = await axiosInstance.delete(`/favorites/${spotifyItemId}`);
    return response.data;
};

export const getUserFavorites = async () => {
    const response = await axiosInstance.get(`/favorites/my-favorites`);
    return response.data;
};