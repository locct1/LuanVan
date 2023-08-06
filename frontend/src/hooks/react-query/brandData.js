import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllBrands,
    addBrand,
    deleteBrand,
    updateBrand,
    getBrandById,
    changeStatusBrand,
} from '~/services/admin/brand.service';
export const useBrandsData = (onSuccess, onError) => {
    return useQuery('brands', getAllBrands);
};
export const useAddBrandData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addBrand, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('brands');
            onSuccess(data);
        },
    });
};
export const useDeleteBrandData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deleteBrand, {
        onSuccess: () => {
            queryClient.invalidateQueries('brands');
            onSuccess();
        },
    });
};
export const useChangeStatusBrandData = (onSuccessChangeStatus, id) => {
    const queryClient = useQueryClient();

    return useMutation(changeStatusBrand, {
        onSuccess: () => {
            queryClient.invalidateQueries('brands');
            onSuccessChangeStatus();
        },
    });
};
export const useUpdateBrandData = (onSuccess, BrandId) => {
    const queryClient = useQueryClient();
    return useMutation(updateBrand, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('brand');
            onSuccess(data);
        },
    });
};
export const useGetBrandData = (brandId) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['brand', brandId],
        queryFn: () => getBrandById(brandId),
        enabled: brandId !== undefined,
    });
};
