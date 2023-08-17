import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    addProductPurchaseOrder,
    getAllProductByWareHouse,
    getAllProductPurchaseOrders,
    getProductPurchaseOrderById,
} from '~/services/admin/productpurchaseorder.service';
export const useProductPurchaseOrderData = (onSuccess, onError) => {
    return useQuery('product-purchase-orders', getAllProductPurchaseOrders);
};
export const useGetAllProductByWareHouseData = (warehouseId) => {
    return useQuery({
        queryKey: ['products-by-ware-house', warehouseId],
        queryFn: () => getAllProductByWareHouse(warehouseId),
        enabled: warehouseId !== undefined,
    });
};
export const useAddProductPurchaseOrderData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addProductPurchaseOrder, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('product-purchase-orders');
            onSuccess(data);
        },
    });
};
export const useGetProductPurchaseOrderData = (supplierId) => {
    return useQuery({
        queryKey: ['product-purchase-order', supplierId],
        queryFn: () => getProductPurchaseOrderById(supplierId),
        enabled: supplierId !== undefined,
    });
};
