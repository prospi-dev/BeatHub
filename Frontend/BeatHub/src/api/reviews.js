import axiosInstance from "./axiosInstance";

export const createReview = (data) =>
    axiosInstance.post(`/reviews`, data);

export const updateReview = (id, data) =>
    axiosInstance.put(`/reviews/${id}`, data);

export const deleteReview = (reviewId) =>
    axiosInstance.delete(`/reviews/${reviewId}`);

export const getReviewsByItem = async (spotifyItemId) => {
    const response = await axiosInstance.get(`/reviews/item/${spotifyItemId}`);
    return response.data;
}