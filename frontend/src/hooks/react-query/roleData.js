import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAllRoles, addRole, deleteRole, updateRole, getRoleById } from '~/services/admin/role.service';
export const useRolesData = (onSuccess, onError) => {
    return useQuery('roles', getAllRoles);
};
export const useAddRoleData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addRole, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('roles');
            onSuccess(data);
        },
    });
};
export const useDeleteRoleData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deleteRole, {
        onSuccess: () => {
            queryClient.invalidateQueries('roles');
            onSuccess();
        },
    });
};
export const useUpdateRoleData = (onSuccess, RoleId) => {
    const queryClient = useQueryClient();
    return useMutation(updateRole, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('role');
            onSuccess(data);
        },
    });
};
export const useGetRoleData = (roleId) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['role', roleId],
        queryFn: () => getRoleById(roleId),
        enabled: roleId !== undefined,
    });
};
