import apiAdmin from './apiAdmin.service';
const END_POINT = {
    PROMOTION_PRODUCTS: 'promotion-products',
};

export const getAllPromotionProducts = async () => {
    return await apiAdmin.get(`${END_POINT.PROMOTION_PRODUCTS}`);
};
export const addPromotionProduct = async (data) => {
    return await apiAdmin.post(`${END_POINT.PROMOTION_PRODUCTS}`, data);
};
export const deletePromotionProduct = async (id) => {
    return await apiAdmin.delete(`${END_POINT.PROMOTION_PRODUCTS}/${id}`);
};
export const updatePromotionProduct = async (data) => {
    console.log('dsd', data);
    return await apiAdmin.put(`${END_POINT.PROMOTION_PRODUCTS}/${data.id}`, data);
};
export const getPromotionProductById = async (id) => {
    return await apiAdmin.get(`${END_POINT.PROMOTION_PRODUCTS}/${id}`);
};
export const getAllProductsInPromotionProduct = async () => {
    return await apiAdmin.get(`${END_POINT.PROMOTION_PRODUCTS}/get-all-products`);
};
export const changeStatusPromotionProduct = async (id) => {
    return await apiAdmin.put(`${END_POINT.PROMOTION_PRODUCTS}/change-status-promotion-product/${id}`);
};
