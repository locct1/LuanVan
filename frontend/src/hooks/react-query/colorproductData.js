import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllColorProducts,
    addColorProduct,
    deleteColorProduct,
    updateColorProduct,
    getColorProductById,
} from '~/services/admin/colorproduct.service';
export const useColorProductsData = (onSuccess, onError) => {
    return useQuery('colorproducts', getAllColorProducts);
};
export const useAddColorProductData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addColorProduct, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('colorproducts');
            onSuccess(data);
        },
    });
};
export const useDeleteColorProductData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deleteColorProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('colorproducts');
            onSuccess();
        },
    });
};
export const useUpdateColorProductData = (onSuccess, ColorProductId) => {
    const queryClient = useQueryClient();
    return useMutation(updateColorProduct, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('colorproduct');
            onSuccess(data);
        },
    });
};
export const useGetColorProductData = (colorProductId) => {
    return useQuery({
        queryKey: ['colorproduct', colorProductId],
        queryFn: () => getColorProductById(colorProductId),
        enabled: colorProductId !== undefined,
    });
};
