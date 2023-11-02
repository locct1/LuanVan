import apiAdmin from './apiAdmin.service';
const END_POINT = {
    MANAGEACCOUNTS: 'manage-accounts',
};

export const getAllAccounts = async () => {
    return await apiAdmin.get(`${END_POINT.MANAGEACCOUNTS}`);
};
export const addAccount = async (data) => {
    return await apiAdmin.post(`${END_POINT.MANAGEACCOUNTS}`, data);
};
export const deleteAccount = async (id) => {
    return await apiAdmin.delete(`${END_POINT.MANAGEACCOUNTS}/${id}`);
};
export const updateAccount = async (data) => {
    return await apiAdmin.put(`${END_POINT.MANAGEACCOUNTS}/${data.id}`, data);
};
export const getAccountById = async (id) => {
    return await apiAdmin.get(`${END_POINT.MANAGEACCOUNTS}/${id}`);
};
