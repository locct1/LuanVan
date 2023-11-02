import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllShockDeals,
    addShockDeal,
    deleteShockDeal,
    updateShockDeal,
    getShockDealById,
    changeStatusShockDeal,
} from '~/services/admin/shockdeal.service';
export const useShockDealsData = (onSuccess, onError) => {
    return useQuery('shockdeals', getAllShockDeals);
};
export const useAddShockDealData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addShockDeal, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('shockdeals');
            onSuccess(data);
        },
    });
};
export const useDeleteShockDealData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deleteShockDeal, {
        onSuccess: () => {
            queryClient.invalidateQueries('shockdeals');
            onSuccess();
        },
    });
};
export const useUpdateShockDealData = (onSuccess, ShockDealId) => {
    const queryClient = useQueryClient();
    return useMutation(updateShockDeal, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('shockdeal');
            onSuccess(data);
        },
    });
};
export const useGetShockDealData = (colorProductId) => {
    return useQuery({
        queryKey: ['shockdeal', colorProductId],
        queryFn: () => getShockDealById(colorProductId),
        enabled: colorProductId !== undefined,
    });
};
export const useChangeStatusShockDealData = (onSuccessChangeStatus, id) => {
    const queryClient = useQueryClient();

    return useMutation(changeStatusShockDeal, {
        onSuccess: () => {
            queryClient.invalidateQueries('shockdeals');
            onSuccessChangeStatus();
        },
    });
};
