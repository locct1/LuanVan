import apiAdmin from './apiAdmin.service';
const END_POINT = {
    BRANDS: 'brands',
};

export const getAllBrands = async () => {
    return await apiAdmin.get(`${END_POINT.BRANDS}`);
};
export const addBrand = async (data) => {
    return await apiAdmin.post(`${END_POINT.BRANDS}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const deleteBrand = async (id) => {
    return await apiAdmin.delete(`${END_POINT.BRANDS}/${id}`);
};
export const changeStatusBrand = async (id) => {
    return await apiAdmin.put(`${END_POINT.BRANDS}/change-status-brand/${id}`);
};
export const updateBrand = async (data) => {
    return await apiAdmin.put(`${END_POINT.BRANDS}/${data.get('id')}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const getBrandById = async (id) => {
    return await apiAdmin.get(`${END_POINT.BRANDS}/${id}`);
};
