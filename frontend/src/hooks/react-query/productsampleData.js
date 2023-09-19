import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    deleteImageProduct360,
    deleteProductSampleDefaultImage,
    deleteSlideProductSampleImage,
    getAllPhotosByProductId,
    getAllProductSamples,
    uploadImageProduct360,
    uploadImageProducts360,
    uploadProductSampleDefaultImage,
    uploadSlideProductSampleImage,
} from '~/services/admin/productsample.service';
export const useProductSamplesData = (onSuccess, onError) => {
    return useQuery('product-samples', getAllProductSamples);
};
export const usePhotosByProductIdData = (productId) => {
    return useQuery({
        queryKey: ['photos-by-product-id', productId],
        queryFn: () => getAllPhotosByProductId(productId),
        enabled: productId !== undefined,
    });
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
export const useImageProducts360Data = (onSuccess, onError) => {
    const queryClient = useQueryClient();

    return useMutation(uploadImageProducts360, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('photos-by-product-id');
            onSuccess(data);
        },
    });
};
export const useDeleteImageProduct360Data = (onSuccessDelete, onError) => {
    const queryClient = useQueryClient();
    return useMutation(deleteImageProduct360, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('photos-by-product-id');
            onSuccessDelete(data);
        },
    });
};
