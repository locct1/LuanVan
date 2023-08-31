import apiClient from './apiClient.service';
const END_POINT = {
    VN_PAY: 'vnpay-client',
};
export const checkOutByVnPay = (data) => {
    return apiClient.post(`${END_POINT.VN_PAY}/create-order`, data);
};
