import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    deleteProductSampleDefaultImage,
    deleteSlideProductSampleImage,
    getAllProductSamples,
    uploadProductSampleDefaultImage,
    uploadSlideProductSampleImage,
} from '~/services/admin/productsample.service';
export const useProductSamplesData = (onSuccess, onError) => {
    return useQuery('product-samples', getAllProductSamples);
};
export const useUploadProductSampleDefaultImageData = (onSuccess, onError) => {
    const queryClient = useQueryClient();

    return useMutation(uploadProductSampleDefaultImage, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('product');
            onSuccess(data);
        },
    });
};
export const useDeleteProductSampleDefaultImageData = (onSuccessDelete, onError) => {
    const queryClient = useQueryClient();
    return useMutation(deleteProductSampleDefaultImage, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('product');
            onSuccessDelete(data);
        },
    });
};
export const useUploadSlideProductSampleImageData = (onSuccess, onError) => {
    const queryClient = useQueryClient();

    return useMutation(uploadSlideProductSampleImage, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('product');
            onSuccess(data);
        },
    });
};
export const useDeleteSlideProductSampleImageData = (onSuccessDelete, onError) => {
    const queryClient = useQueryClient();
    return useMutation(deleteSlideProductSampleImage, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('product');
            onSuccessDelete(data);
        },
    });
};
