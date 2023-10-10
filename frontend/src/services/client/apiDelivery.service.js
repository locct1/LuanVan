import axios from 'axios';
import { LOCAL_STORAGE_TOKEN_CLIENT, SHOP_ID } from '~/helpers/constants';
import { TOKEN_API_DELIVERY } from '~/helpers/constants';
const commonConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
};
// eslint-disable-next-line import/no-anonymous-default-export
const apiDelivery = axios.create({
    baseURL: process.env.REACT_APP_URL_API,
    timeout: 3000000,
    ...commonConfig,
});
apiDelivery.interceptors.request.use(
    (config) => {
        config.headers['token'] = TOKEN_API_DELIVERY;
        config.headers['Authorization'] = `Bearer ${localStorage[LOCAL_STORAGE_TOKEN_CLIENT]}`;
        config.headers['ShopId'] = SHOP_ID;
        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);
apiDelivery.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.log(error);
        if (error.response.data) return error.response.data;
        else return { success: false, message: error.message };
    },
);
export default apiDelivery;
