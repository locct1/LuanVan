import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    updatePaymentMethod,
    getPaymentMethodById,
} from '~/services/admin/paymentmethod.service';
export const usePaymentMethodsData = (onSuccess, onError) => {
    return useQuery('paymentmethods', getAllPaymentMethods);
};
export const useAddPaymentMethodData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addPaymentMethod, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('paymentmethods');
            onSuccess(data);
        },
    });
};
export const useDeletePaymentMethodData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deletePaymentMethod, {
        onSuccess: () => {
            queryClient.invalidateQueries('paymentmethod');
            onSuccess();
        },
    });
};
export const useUpdatePaymentMethodData = (onSuccess, PaymentMethodId) => {
    const queryClient = useQueryClient();
    return useMutation(updatePaymentMethod, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('paymentmethod');
            onSuccess(data);
        },
    });
};
export const useGetPaymentMethodData = (paymentMethodId) => {
    return useQuery({
        queryKey: ['paymentmethod', paymentMethodId],
        queryFn: () => getPaymentMethodById(paymentMethodId),
        enabled: paymentMethodId !== undefined,
    });
};
