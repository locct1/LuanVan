import apiAdmin from './apiAdmin.service';
const END_POINT = {
    SHOCK_DEALS: 'shock-deals',
};

export const getAllShockDeals = async () => {
    return await apiAdmin.get(`${END_POINT.SHOCK_DEALS}`);
};
export const addShockDeal = async (data) => {
    return await apiAdmin.post(`${END_POINT.SHOCK_DEALS}`, data);
};
export const deleteShockDeal = async (id) => {
    return await apiAdmin.delete(`${END_POINT.SHOCK_DEALS}/${id}`);
};
export const updateShockDeal = async (data) => {
    console.log('dsd', data);
    return await apiAdmin.put(`${END_POINT.SHOCK_DEALS}/${data.id}`, data);
};
export const getShockDealById = async (id) => {
    return await apiAdmin.get(`${END_POINT.SHOCK_DEALS}/${id}`);
};
export const changeStatusShockDeal = async (id) => {
    return await apiAdmin.put(`${END_POINT.SHOCK_DEALS}/change-status-shock-deal/${id}`);
};
