import apiAdmin from './apiAdmin.service';
const END_POINT = {
    SUPPLIERS: 'suppliers',
};

export const getAllSuppliers = async () => {
    return await apiAdmin.get(`${END_POINT.SUPPLIERS}`);
};
export const addSupplier = async (data) => {
    return await apiAdmin.post(`${END_POINT.SUPPLIERS}`, data);
};
export const deleteSupplier = async (id) => {
    return await apiAdmin.delete(`${END_POINT.SUPPLIERS}/${id}`);
};
export const updateSupplier = async (data) => {
    return await apiAdmin.put(`${END_POINT.SUPPLIERS}/${data.id}`, data);
};
export const getSupplierById = async (id) => {
    return await apiAdmin.get(`${END_POINT.SUPPLIERS}/${id}`);
};
