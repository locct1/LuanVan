import apiAdmin from './apiAdmin.service';
const END_POINT = {
    PRODUCTS: 'products',
    ALL_RAMS: 'products/get-all-rams',
    ALL_ROMS: 'products/get-all-roms',
    ALL_CHIP_TYPES: 'products/get-all-chip-types',
    ALL_CHIPS: 'products/get-all-chips',
    ALL_OPERATING_SYSTEMS_TYPES: 'products/get-all-operating-systems-types',
    ALL_OPERATING_SYSTEMS: 'products/get-all-operating-systems',
    ALL_SCREEN_TECHNOLOGIES: 'products/get-all-screen-technologies',
    ALL_CHARGE_PORTS: 'products/get-all-charge-ports',
    ALL_JACK_PLUGS: 'products/get-all-jack-plugs',
};

export const getAllProducts = async () => {
    return await apiAdmin.get(`${END_POINT.PRODUCTS}`);
};
export const getAllAccessories = async () => {
    return await apiAdmin.get(`${END_POINT.PRODUCTS}/get-all-accessories`);
};
export const addProduct = async (data) => {
    return await apiAdmin.post(`${END_POINT.PRODUCTS}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const addAccessory = async (data) => {
    return await apiAdmin.post(`${END_POINT.PRODUCTS}/add-accessory`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteProduct = async (id) => {
    return await apiAdmin.delete(`${END_POINT.PRODUCTS}/${id}`);
};
export const changeStatusProduct = async (id) => {
    return await apiAdmin.put(`${END_POINT.PRODUCTS}/change-status-product/${id}`);
};
export const updateProduct = async (data) => {
    return await apiAdmin.put(`${END_POINT.PRODUCTS}/${data.get('id')}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const updateAccessory = async (data) => {
    return await apiAdmin.put(`${END_POINT.PRODUCTS}/update-accessory/${data.get('id')}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const getProductById = async (id) => {
    return await apiAdmin.get(`${END_POINT.PRODUCTS}/${id}`);
};
//
export const getAllRams = async () => {
    return await apiAdmin.get(`${END_POINT.ALL_RAMS}`);
};
export const getAllRoms = async () => {
    return await apiAdmin.get(`${END_POINT.ALL_ROMS}`);
};
export const getAllChipTypes = async () => {
    return await apiAdmin.get(`${END_POINT.ALL_CHIP_TYPES}`);
};
export const getAllChips = async () => {
    return await apiAdmin.get(`${END_POINT.ALL_CHIPS}`);
};
export const getAllOperatingSystemTypes = async () => {
    return await apiAdmin.get(`${END_POINT.ALL_OPERATING_SYSTEMS_TYPES}`);
};
export const getAllOperatingSystems = async () => {
    return await apiAdmin.get(`${END_POINT.ALL_OPERATING_SYSTEMS}`);
};
export const getAllScreenTechnologies = async () => {
    return await apiAdmin.get(`${END_POINT.ALL_SCREEN_TECHNOLOGIES}`);
};
export const deleteProductVersion = async (id) => {
    return await apiAdmin.delete(`${END_POINT.PRODUCTS}/delete-product-version/${id}`);
};
export const getAllChargePorts = async () => {
    return await apiAdmin.get(`${END_POINT.ALL_CHARGE_PORTS}`);
};
export const getAllJackPlugs = async () => {
    return await apiAdmin.get(`${END_POINT.ALL_JACK_PLUGS}`);
};
