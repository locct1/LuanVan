import apiAdmin from './apiAdmin.service';
const END_POINT = {
    ROLES: 'roles',
};

export const getAllRoles = async () => {
    return await apiAdmin.get(`${END_POINT.ROLES}`);
};
export const addRole = async (data) => {
    return await apiAdmin.post(`${END_POINT.ROLES}`, data);
};
export const deleteRole = async (id) => {
    return await apiAdmin.delete(`${END_POINT.ROLES}/${id}`);
};
export const updateRole = async (data) => {
    console.log(data);
    return await apiAdmin.put(`${END_POINT.ROLES}/${data.id}`, data);
};
export const getRoleById = async (id) => {
    return await apiAdmin.get(`${END_POINT.ROLES}/${id}`);
};
