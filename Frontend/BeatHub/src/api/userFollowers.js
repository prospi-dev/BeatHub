import axiosInstance from "./axiosInstance";

export const followUser = async (username) => {
    const response = await axiosInstance.post(`/network/follow/${username}`);
    return response.data;
};

export const unfollowUser = async (username) => {
    const response = await axiosInstance.delete(`/network/unfollow/${username}`);
    return response.data;
};

export const getActivityFeed = async () => {
    const response = await axiosInstance.get(`/network/feed`);
    return response.data;
};