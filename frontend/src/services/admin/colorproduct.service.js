import apiAdmin from './apiAdmin.service';
const END_POINT = {
    COLORPRODUCTS: 'colorproducts',
};

export const getAllColorProducts = async () => {
    return await apiAdmin.get(`${END_POINT.COLORPRODUCTS}`);
};
export const addColorProduct = async (data) => {
    return await apiAdmin.post(`${END_POINT.COLORPRODUCTS}`, data);
};
export const deleteColorProduct = async (id) => {
    return await apiAdmin.delete(`${END_POINT.COLORPRODUCTS}/${id}`);
};
export const updateColorProduct = async (data) => {
    return await apiAdmin.put(`${END_POINT.COLORPRODUCTS}/${data.id}`, data);
};
export const getColorProductById = async (id) => {
    return await apiAdmin.get(`${END_POINT.COLORPRODUCTS}/${id}`);
};
