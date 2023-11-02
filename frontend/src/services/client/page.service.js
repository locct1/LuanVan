import apiClient from './apiClient.service';
const END_POINT = {
    PAGES: 'pages',
};

export const getAllBrandsClient = async () => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-brands`);
};
export const getAllPaymentMethodsClient = async () => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-paymentmethods`);
};
export const getAllProductsClient = async () => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-products`);
};
export const getAllPromotionProductsClient = async () => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-promotion-products`);
};
export const getAllShockDealsClient = async () => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-shock-deals`);
};
export const getAllProductsByBrandIdClient = async (id) => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-products-by-brand-id/${id}`);
};
export const getProductByIdClient = async (id) => {
    return await apiClient.get(`${END_POINT.PAGES}/get-product-by-id/${id}`);
};
export const getAllOrdersClient = async () => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-orders-by-client`);
};
export const createOrderClient = (data) => {
    return apiClient.post(`${END_POINT.PAGES}/create-order-client`, data);
};
export const updateOrderClient = (data) => {
    return apiClient.put(`${END_POINT.PAGES}/update-order-client/${data.orderId}`, data);
};
export const getOrderClient = async (id) => {
    console.log('da', id);
    return await apiClient.get(`${END_POINT.PAGES}/get-order-by-client/${id}`);
};
export const getAllProductSamplesClient = async () => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-productsamples`);
};

export const getAllRamsClient = async () => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-rams`);
};
export const getAllRomsClient = async () => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-roms`);
};
export const getAllOperatingSystemTypesClient = async () => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-operating-system-types`);
};
export const getAllProductVersionsClient = async () => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-product-versions`);
};
export const createReviewProductClient = async (data) => {
    return await apiClient.post(`${END_POINT.PAGES}/create-review-product`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const getAllReviewProductsByProductIdClient = async (id) => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-review-products-by-product-id/${id}`);
};
export const likeReviewProduct = async (id) => {
    return await apiClient.post(`${END_POINT.PAGES}/like-review-product/${id}`);
};
export const unLikeReviewProduct = async (id) => {
    return await apiClient.delete(`${END_POINT.PAGES}/unlike-review-product/${id}`);
};
export const deleteReviewProduct = async (id) => {
    return await apiClient.delete(`${END_POINT.PAGES}/delete-review-product/${id}`);
};
export const requestCancelOrderClient = async (data) => {
    return await apiClient.put(`${END_POINT.PAGES}/request-cancel-order-client/${data.orderId}`, data);
};
