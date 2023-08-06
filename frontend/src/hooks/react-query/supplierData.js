import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAllSuppliers, addSupplier, deleteSupplier, updateSupplier, getSupplierById } from '~/services/admin/supplier.service';
export const useSuppliersData = (onSuccess, onError) => {
    return useQuery('suppliers', getAllSuppliers);
};
export const useAddSupplierData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addSupplier, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('suppliers');
            onSuccess(data);
        },
    });
};
export const useDeleteSupplierData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deleteSupplier, {
        onSuccess: () => {
            queryClient.invalidateQueries('suppliers');
            onSuccess();
        },
    });
};
export const useUpdateSupplierData = (onSuccess, SupplierId) => {
    const queryClient = useQueryClient();
    return useMutation(updateSupplier, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('supplier');
            onSuccess(data);
        },
    });
};
export const useGetSupplierData = (supplierId) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['supplier', supplierId],
        queryFn: () => getSupplierById(supplierId),
        enabled: supplierId !== undefined,
    });
};
