import apiAdmin from './apiAdmin.service';
const END_POINT = {
    PRODUCT_PURCHASE_ORDERS: 'product-purchase-orders',
};

export const getAllProductPurchaseOrders = async () => {
    return await apiAdmin.get(`${END_POINT.PRODUCT_PURCHASE_ORDERS}`);
};
export const getAllProductByWareHouse = async (id) => {
    return await apiAdmin.get(`${END_POINT.PRODUCT_PURCHASE_ORDERS}/get-all-products-by-warehouse/${id}`);
};
export const addProductPurchaseOrder = async (data) => {
    return await apiAdmin.post(`${END_POINT.PRODUCT_PURCHASE_ORDERS}`, data);
};
export const deleteSupplier = async (id) => {
    return await apiAdmin.delete(`${END_POINT.PRODUCT_PURCHASE_ORDERS}/${id}`);
};
export const updateSupplier = async (data) => {
    return await apiAdmin.put(`${END_POINT.PRODUCT_PURCHASE_ORDERS}/${data.id}`, data);
};
export const getProductPurchaseOrderById = async (id) => {
    return await apiAdmin.get(`${END_POINT.PRODUCT_PURCHASE_ORDERS}/${id}`);
};
