import axios from 'axios';
import apiDelivery from './apiDelivery.service';

export const callAPIGetProvince = async () => {
    let response = await apiDelivery.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province');
    return response.data;
};
export const callAPIGetDistrict = async (ProvinceID) => {
    let response = await apiDelivery.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
        params: {
            province_id: ProvinceID,
        },
    });
    return response.data;
};
export const callAPIGetWard = async (DistrictID) => {
    let response = await apiDelivery.get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id
    `,
        {
            params: {
                district_id: DistrictID,
            },
        },
    );
    return response.data;
};
export const callAPIGetAllShops = async () => {
    let response = await apiDelivery.get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shop/all
    `,
    );
    return response.data;
};
export const callAPIGetServiceDeliverys = async (data) => {
    let response = await apiDelivery.post(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services
    `,
        data,
    );
    return response.data;
};
export const callAPICaculateShippingFee = async (data) => {
    let response = await apiDelivery.post(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee
    `,
        data,
    );
    return response.data;
};
export const callAPIPickShift = async () => {
    let response = await apiDelivery.get('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shift/date');
    return response.data;
};
export const callAPICreateOrder = async (data) => {
    let response = await apiDelivery.post(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create
    `,
        data,
    );
    return response;
};
export const callAPIGetOrderDetail = async (data) => {
    let response = await apiDelivery.post(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail
    `,
        data,
    );
    return response;
};
export const callAPIGetOrderTrackingDetail = async (data) => {
    let response = await apiDelivery.post(
        `https://dev-online-gateway.ghn.vn/order-tracking/public-api/client/tracking-logs
    `,
        data,
    );
    return response;
};
export const callAPIA5GenToken = async (data) => {
    let response = await apiDelivery.post(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token
    `,
        data,
    );
    return response;
};
// export const callAPIPrintA5 = async (data) => {
//     let response = await apiDelivery.get(
//         `https://dev-online-gateway.ghn.vn/a5/public-api/printA5?token=ed9b05cf-6353-11ee-965a-1a530fd250d1
//     `,
//         {
//             headers: {
//                 'Content-Type': 'text/html',
//             },
//         },
//     );
//     return response;
// };
export const callAPICancelOrder = async (data) => {
    let response = await apiDelivery.post(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel
    `,
        data,
    );
    return response;
};
