import apiClient from './apiClient.service';

const END_POINT = {
    CLIENT_AUTH: 'client-accounts',
};

export const RegisterClient = (data) => {
    return apiClient.post(`${END_POINT.CLIENT_AUTH}/signup-client`, data);
};
export const LoginClient = (data) => {
    return apiClient.post(`${END_POINT.CLIENT_AUTH}/signin-client`, data);
};
export const GetInfoClient = (data) => {
    return apiClient.get(`${END_POINT.CLIENT_AUTH}/get-info-client`, data);
};
export const ChangePassWordClient = (data) => {
    return apiClient.post(`${END_POINT.CLIENT_AUTH}/change-password-client`, data);
};
export const ChangePassWordClientService = (data) => {
    return apiClient.post(`${END_POINT.CLIENT_AUTH}/change-password-client`, data);
};
export const UpdateInfoClientService = (data) => {
    return apiClient.post(`${END_POINT.CLIENT_AUTH}/update-info-client`, data);
};
