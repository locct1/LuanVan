import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllPromotionProducts,
    addPromotionProduct,
    deletePromotionProduct,
    updatePromotionProduct,
    getPromotionProductById,
    getAllProductsInPromotionProduct,
    changeStatusPromotionProduct,
} from '~/services/admin/promotionproduct.service';
export const usePromotionProductsData = (onSuccess, onError) => {
    return useQuery('promotion-products', getAllPromotionProducts);
};
export const useAddPromotionProductData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addPromotionProduct, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('promotion-products');
            onSuccess(data);
        },
    });
};
export const useDeletePromotionProductData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deletePromotionProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('promotion-products');
            onSuccess();
        },
    });
};
export const useUpdatePromotionProductData = (onSuccess, PromotionProductId) => {
    const queryClient = useQueryClient();
    return useMutation(updatePromotionProduct, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('promotion-product');
            onSuccess(data);
        },
    });
};
export const useGetPromotionProductData = (promotionProductId) => {
    return useQuery({
        queryKey: ['promotion-product', promotionProductId],
        queryFn: () => getPromotionProductById(promotionProductId),
        enabled: promotionProductId !== undefined,
    });
};
export const useAllProductsInPromotionProductData = (onSuccess, onError) => {
    return useQuery('products-in-promotion-product', getAllProductsInPromotionProduct);
};
export const useChangeStatusPromotionProductData = (onSuccessChangeStatus, id) => {
    const queryClient = useQueryClient();

    return useMutation(changeStatusPromotionProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('promotion-products');
            onSuccessChangeStatus();
        },
    });
};
