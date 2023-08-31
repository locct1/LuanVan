import apiAdmin from './apiAdmin.service';
const END_POINT = {
    ORDERS: 'orders',
};

export const getAllOrders = async () => {
    return await apiAdmin.get(`${END_POINT.ORDERS}`);
};
export const getAllOrderStatuses = async () => {
    return await apiAdmin.get(`${END_POINT.ORDERS}/get-all-order-statuses`);
};
export const addOrder = async (data) => {
    return await apiAdmin.post(`${END_POINT.ORDERS}`, data);
};
export const deleteOrder = async (id) => {
    return await apiAdmin.delete(`${END_POINT.ORDERS}/${id}`);
};
export const updateOrder = async (data) => {
    return await apiAdmin.put(`${END_POINT.ORDERS}/${data.id}`, data);
};
export const getOrderById = async (id) => {
    return await apiAdmin.get(`${END_POINT.ORDERS}/${id}`);
};
export const updateOrderStatus = async (data) => {
    return await apiAdmin.put(`${END_POINT.ORDERS}/update-order-status/${data.orderId}`, data);
};
