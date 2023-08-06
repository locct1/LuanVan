import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllWareHouses,
    addWareHouse,
    deleteWareHouse,
    updateWareHouse,
    getWareHouseById,
} from '~/services/admin/warehouse.service';
export const useWareHousesData = (onSuccess, onError) => {
    return useQuery('warehouses', getAllWareHouses);
};
export const useAddWareHouseData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addWareHouse, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('warehouses');
            onSuccess(data);
        },
    });
};
export const useDeleteWareHouseData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deleteWareHouse, {
        onSuccess: () => {
            queryClient.invalidateQueries('warehouses');
            onSuccess();
        },
    });
};
export const useUpdateWareHouseData = (onSuccess, WareHouseId) => {
    const queryClient = useQueryClient();
    return useMutation(updateWareHouse, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('warehouse');
            onSuccess(data);
        },
    });
};
export const useGetWareHouseData = (warehouseId) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['warehouse', warehouseId],
        queryFn: () => getWareHouseById(warehouseId),
        enabled: warehouseId !== undefined,
    });
};
