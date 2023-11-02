import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllAccounts,
    addAccount,
    deleteAccount,
    updateAccount,
    getAccountById,
} from '~/services/admin/manageaccount.service';
export const useAccountsData = (onSuccess, onError) => {
    return useQuery('manageaccounts', getAllAccounts);
};
export const useAddAccountData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addAccount, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('manageaccounts');
            onSuccess(data);
        },
    });
};
export const useDeleteAccountData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deleteAccount, {
        onSuccess: () => {
            queryClient.invalidateQueries('manageaccounts');
            onSuccess();
        },
    });
};
export const useUpdateAccountData = (onSuccess, AccountId) => {
    const queryClient = useQueryClient();
    return useMutation(updateAccount, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('manageaccount');
            onSuccess(data);
        },
    });
};
export const useGetAccountData = (userId) => {
    return useQuery({
        queryKey: ['manageaccount', userId],
        queryFn: () => getAccountById(userId),
        enabled: userId !== undefined,
    });
};
