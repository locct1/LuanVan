import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllProductCategories,
    addProductCategory,
    deleteProductCategory,
    updateProductCategory,
    getProductCategoryById,
} from '~/services/admin/productcategory.service';
export const useProductCategoriesData = (onSuccess, onError) => {
    return useQuery('productcategories', getAllProductCategories);
};
export const useAddProductCategoryData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addProductCategory, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('productcategories');
            onSuccess(data);
        },
    });
};
export const useDeleteProductCategoryData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deleteProductCategory, {
        onSuccess: () => {
            queryClient.invalidateQueries('productcategories');
            onSuccess();
        },
    });
};
export const useUpdateProductCategoryData = (onSuccess, ProductCategoryId) => {
    const queryClient = useQueryClient();
    return useMutation(updateProductCategory, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('productcategory');
            onSuccess(data);
        },
    });
};
export const useGetProductCategoryData = (productCategoryId) => {
    return useQuery({
        queryKey: ['productcategory', productCategoryId],
        queryFn: () => getProductCategoryById(productCategoryId),
        enabled: productCategoryId !== undefined,
    });
};
