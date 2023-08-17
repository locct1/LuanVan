import apiAdmin from './apiAdmin.service';
const END_POINT = {
    ADMIN_AUTH: 'admin-accounts',
};

export const Register = (data) => {
    return apiAdmin.post(`${END_POINT.ADMIN_AUTH}/signup`, data);
};
export const Login = (data) => {
    return apiAdmin.post(`${END_POINT.ADMIN_AUTH}/signin`, data);
};
export const GetInfo = (data) => {
    return apiAdmin.get(`${END_POINT.ADMIN_AUTH}/get-info-admin`, data);
};
