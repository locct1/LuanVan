import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllBrandsClient,
    getAllOperatingSystemTypesClient,
    getAllOperatingSystemsClient,
    getAllOrdersClient,
    getAllPaymentMethodsClient,
    getAllProductSamplesClient,
    getAllProductVersionsClient,
    getAllProductsByBrandIdClient,
    getAllProductsClient,
    getAllPromotionProductsClient,
    getAllRamsClient,
    getAllRomsClient,
    getOrderClient,
    getProductByIdClient,
} from '~/services/client/page.service';

export const useBrandsClientData = (onSuccess, onError) => {
    return useQuery('client-brands', getAllBrandsClient);
};
export const usePaymentMethodsClientData = (onSuccess, onError) => {
    return useQuery('client-paymentmethods', getAllPaymentMethodsClient);
};
export const useProductsClientData = (onSuccess, onError) => {
    return useQuery('client-products', getAllProductsClient);
};
export const usePromotionProductsClientData = (onSuccess, onError) => {
    return useQuery('client-promotion-products', getAllPromotionProductsClient);
};
export const useProductsByBrandIdClientData = (brandId) => {
    return useQuery({
        queryKey: ['client-products-by-brand-id', brandId],
        queryFn: () => getAllProductsByBrandIdClient(brandId),
        enabled: brandId !== undefined,
    });
};
export const useProductByIdClientData = (productId) => {
    return useQuery({
        queryKey: ['client-products-by-id', productId],
        queryFn: () => getProductByIdClient(productId),
        enabled: productId !== undefined,
    });
};
export const useOrdersClientData = (onSuccess, onError) => {
    return useQuery('orders-client', getAllOrdersClient);
};
export const useGetOrderClientData = (orderId) => {
    return useQuery({
        queryKey: ['order-client', orderId],
        queryFn: () => getOrderClient(orderId),
        enabled: orderId !== undefined,
    });
};
export const useProductSamplesClientData = (onSuccess, onError) => {
    return useQuery('client-productsamples', getAllProductSamplesClient);
};

export const useRamsClientData = (onSuccess, onError) => {
    return useQuery('client-rams', getAllRamsClient);
};
export const useRomsClientData = (onSuccess, onError) => {
    return useQuery('client-roms', getAllRomsClient);
};
export const useOperatingSystemTypesClientData = (onSuccess, onError) => {
    return useQuery('client-operating-system-types', getAllOperatingSystemTypesClient);
};
export const useProductVersionsClientData = (onSuccess, onError) => {
    return useQuery('client-product-versions', getAllProductVersionsClient);
};
