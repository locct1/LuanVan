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
export const getOrderClient = async (id) => {
    console.log('da', id);
    return await apiClient.get(`${END_POINT.PAGES}/get-order-by-client/${id}`);
};
