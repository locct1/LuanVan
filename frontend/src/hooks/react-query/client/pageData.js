import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllBrandsClient,
    getAllOrdersClient,
    getAllPaymentMethodsClient,
    getAllProductsByBrandIdClient,
    getAllProductsClient,
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
