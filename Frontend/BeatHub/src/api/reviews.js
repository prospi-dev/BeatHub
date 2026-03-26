import axiosInstance from "./axiosInstance";

export const createReview = (data) =>
    axiosInstance.post('/reviews', data);

export const updateReview = (data) =>
    axiosInstance.put('/reviews', data);

export const deleteReview = (reviewId) =>
    axiosInstance.delete(`/reviews/${reviewId}`);