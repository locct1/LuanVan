import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllProducts,
    addProduct,
    deleteProduct,
    updateProduct,
    getProductById,
    changeStatusProduct,
} from '~/services/admin/product.service';
export const useProductsData = (onSuccess, onError) => {
    return useQuery('products', getAllProducts);
};
export const useAddProductData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addProduct, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('products');
            onSuccess(data);
        },
    });
};
export const useDeleteProductData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deleteProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('products');
            onSuccess();
        },
    });
};
export const useChangeStatusProductData = (onSuccessChangeStatus, id) => {
    const queryClient = useQueryClient();

    return useMutation(changeStatusProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('products');
            onSuccessChangeStatus();
        },
    });
};
export const useUpdateProductData = (onSuccess, ProductId) => {
    const queryClient = useQueryClient();
    return useMutation(updateProduct, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('product');
            onSuccess(data);
        },
    });
};
export const useGetProductData = (productId) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['product', productId],
        queryFn: () => getProductById(productId),
        enabled: productId !== undefined,
    });
};
