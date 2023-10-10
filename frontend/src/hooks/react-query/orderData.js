import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllOrders,
    addOrder,
    deleteOrder,
    updateOrder,
    getOrderById,
    getAllOrderStatuses,
    updateOrderStatus,
} from '~/services/admin/order.service';
export const useOrdersData = (onSuccess, onError) => {
    return useQuery('orders', getAllOrders);
};
export const useOrderStatusesData = (onSuccess, onError) => {
    return useQuery('order-statuses', getAllOrderStatuses);
};
export const useAddOrderData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addOrder, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('orders');
            onSuccess(data);
        },
    });
};
export const useDeleteOrderData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deleteOrder, {
        onSuccess: () => {
            queryClient.invalidateQueries('orders');
            onSuccess();
        },
    });
};
export const useUpdateOrderData = (onSuccess, OrderId) => {
    const queryClient = useQueryClient();
    return useMutation(updateOrder, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('order');
            onSuccess(data);
        },
    });
};
export const useUpdateOrderStatusData = (onSuccessUpdateOrderStatus, ColorProductId) => {
    const queryClient = useQueryClient();
    return useMutation(updateOrderStatus, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('orders');
            queryClient.invalidateQueries('order');
            onSuccessUpdateOrderStatus(data);
        },
    });
};
export const useGetOrderData = (orderId) => {
    return useQuery({
        queryKey: ['order', orderId],
        queryFn: () => getOrderById(orderId),
        enabled: orderId !== undefined,
    });
};
