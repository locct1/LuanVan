import apiAdmin from './apiAdmin.service';
const END_POINT = {
    WAREHOUSES: 'warehouses',
};

export const getAllWareHouses = async () => {
    return await apiAdmin.get(`${END_POINT.WAREHOUSES}`);
};
export const addWareHouse = async (data) => {
    return await apiAdmin.post(`${END_POINT.WAREHOUSES}`, data);
};
export const deleteWareHouse = async (id) => {
    return await apiAdmin.delete(`${END_POINT.WAREHOUSES}/${id}`);
};
export const updateWareHouse = async (data) => {
    return await apiAdmin.put(`${END_POINT.WAREHOUSES}/${data.id}`, data);
};
export const getWareHouseById = async (id) => {
    return await apiAdmin.get(`${END_POINT.WAREHOUSES}/${id}`);
};
