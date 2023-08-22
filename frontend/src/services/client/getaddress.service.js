import axios from 'axios';
export const callAPIGetProvince = async () => {
    let response = await axios.get('https://provinces.open-api.vn/api/?depth=1');
    return response.data;
};
export const callAPIGetDistrict = async (code) => {
    let response = await axios.get(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
    return response.data;
};
export const callAPIGetWard = async (code) => {
    let response = await axios.get(`https://provinces.open-api.vn/api/d/${code}?depth=2
    `);
    return response.data;
};
