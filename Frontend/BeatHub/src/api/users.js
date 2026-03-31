import axiosInstance from "./axiosInstance";

export const getUserProfile = async (username) => {
    const response = await axiosInstance.get(`/users/${username}`);
    return response.data;
};

export const updateAvatar = async (avatarUrl) => {
    const response = await axiosInstance.post(`/users/avatar`, { avatarUrl });
    return response.data;
};