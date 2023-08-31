import apiAdmin from './apiAdmin.service';
const END_POINT = {
    PAYMENT_METHODS: 'payment-methods',
};

export const getAllPaymentMethods = async () => {
    return await apiAdmin.get(`${END_POINT.PAYMENT_METHODS}`);
};
export const addPaymentMethod = async (data) => {
    return await apiAdmin.post(`${END_POINT.PAYMENT_METHODS}`, data);
};
export const deletePaymentMethod = async (id) => {
    return await apiAdmin.delete(`${END_POINT.PAYMENT_METHODS}/${id}`);
};
export const updatePaymentMethod = async (data) => {
    return await apiAdmin.put(`${END_POINT.PAYMENT_METHODS}/${data.id}`, data);
};
export const getPaymentMethodById = async (id) => {
    return await apiAdmin.get(`${END_POINT.PAYMENT_METHODS}/${id}`);
};
