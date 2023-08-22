import apiClient from './apiClient.service';
const END_POINT = {
    PAGES: 'pages',
};

export const getAllBrandsClient = async () => {
    return await apiClient.get(`${END_POINT.PAGES}/get-all-brands`);
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
