import apiAdmin from './apiAdmin.service';
const END_POINT = {
    PRODUCT_SAMPLES: 'product-samples',
};

export const getAllProductSamples = async () => {
    return await apiAdmin.get(`${END_POINT.PRODUCT_SAMPLES}`);
};
export const uploadProductSampleDefaultImage = async (data) => {
    return await apiAdmin.post(`${END_POINT.PRODUCT_SAMPLES}/upload-default-image`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const deleteProductSampleDefaultImage = async (id) => {
    return await apiAdmin.delete(`${END_POINT.PRODUCT_SAMPLES}/delete-default-image/${id}`);
};

export const uploadSlideProductSampleImage = async (data) => {
    return await apiAdmin.post(`${END_POINT.PRODUCT_SAMPLES}/upload-slide-image`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const deleteSlideProductSampleImage = async (id) => {
    return await apiAdmin.delete(`${END_POINT.PRODUCT_SAMPLES}/delete-slide-image/${id}`);
};
