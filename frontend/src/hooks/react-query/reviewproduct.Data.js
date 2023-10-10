import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllReviewProducts,
    deleteReviewProduct,
    updateReviewProduct,
    getReviewProductById,
    addFeedBackReviewProduct,
    deleteFeedBackReviewProduct,
} from '~/services/admin/reviewproduct.service';
export const useReviewProductsData = () => {
    return useQuery('reviewproducts', getAllReviewProducts);
};
export const useAddFeedBackReviewProductData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addFeedBackReviewProduct, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('reviewproducts');
            onSuccess(data);
        },
    });
};
export const useDeleteReviewProductData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deleteReviewProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('reviewproducts');
            onSuccess();
        },
    });
};
export const useDeleteFeedBackReviewProductData = () => {
    const queryClient = useQueryClient();

    return useMutation(deleteFeedBackReviewProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('reviewproducts');
        },
    });
};
export const useUpdateReviewProductData = (onSuccess, ReviewProductId) => {
    const queryClient = useQueryClient();
    return useMutation(updateReviewProduct, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('reviewproduct');
            onSuccess(data);
        },
    });
};
export const useGetReviewProductData = (reviewProductId) => {
    return useQuery({
        queryKey: ['reviewproduct', reviewProductId],
        queryFn: () => getReviewProductById(reviewProductId),
        enabled: reviewProductId !== undefined,
    });
};
