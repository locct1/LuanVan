import apiAdmin from './apiAdmin.service';
const END_POINT = {
    ADMIN_DASHBOARDS: 'admin-dashboards',
};

export const getAllDashBoards = async () => {
    return await apiAdmin.get(`${END_POINT.ADMIN_DASHBOARDS}`);
};
