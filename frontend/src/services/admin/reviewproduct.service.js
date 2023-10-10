import apiAdmin from './apiAdmin.service';
const END_POINT = {
    ReviewProduct: 'review-products',
};

export const getAllReviewProducts = async () => {
    return await apiAdmin.get(`${END_POINT.ReviewProduct}`);
};
export const addFeedBackReviewProduct = async (data) => {
    return await apiAdmin.post(`${END_POINT.ReviewProduct}/create-feed-back-review-product`, data);
};
export const deleteReviewProduct = async (id) => {
    return await apiAdmin.delete(`${END_POINT.ReviewProduct}/${id}`);
};
export const updateReviewProduct = async (data) => {
    return await apiAdmin.put(`${END_POINT.ReviewProduct}/${data.id}`, data);
};
export const getReviewProductById = async (id) => {
    return await apiAdmin.get(`${END_POINT.ReviewProduct}/${id}`);
};
export const deleteFeedBackReviewProduct = async (id) => {
    return await apiAdmin.delete(`${END_POINT.ReviewProduct}/delete-feed-back-review-product/${id}`);
};
