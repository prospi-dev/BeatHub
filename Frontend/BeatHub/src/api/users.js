import axiosInstance from "./axiosInstance";

export const getUserProfile = async (username) => {
    const response = await axiosInstance.get(`/users/${username}`);
    return response.data;
};