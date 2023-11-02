import apiAdmin from './apiAdmin.service';
const END_POINT = {
    PRODUCTCATEGORIES: 'product-categories',
};

export const getAllProductCategories = async () => {
    return await apiAdmin.get(`${END_POINT.PRODUCTCATEGORIES}`);
};
export const addProductCategory = async (data) => {
    return await apiAdmin.post(`${END_POINT.PRODUCTCATEGORIES}`, data);
};
export const deleteProductCategory = async (id) => {
    return await apiAdmin.delete(`${END_POINT.PRODUCTCATEGORIES}/${id}`);
};
export const updateProductCategory = async (data) => {
    return await apiAdmin.put(`${END_POINT.PRODUCTCATEGORIES}/${data.id}`, data);
};
export const getProductCategoryById = async (id) => {
    return await apiAdmin.get(`${END_POINT.PRODUCTCATEGORIES}/${id}`);
};
