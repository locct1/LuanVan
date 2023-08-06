import apiAdmin from './apiAdmin.service';
const END_POINT = {
    PRODUCTS: 'products',
};

export const getAllProducts = async () => {
    return await apiAdmin.get(`${END_POINT.PRODUCTS}`);
};
export const addProduct = async (data) => {
    return await apiAdmin.post(`${END_POINT.PRODUCTS}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const deleteProduct = async (id) => {
    return await apiAdmin.delete(`${END_POINT.PRODUCTS}/${id}`);
};
export const changeStatusProduct = async (id) => {
    return await apiAdmin.put(`${END_POINT.PRODUCTS}/change-status-product/${id}`);
};
export const updateProduct = async (data) => {
    return await apiAdmin.put(`${END_POINT.PRODUCTS}/${data.get('id')}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const getProductById = async (id) => {
    return await apiAdmin.get(`${END_POINT.PRODUCTS}/${id}`);
};
