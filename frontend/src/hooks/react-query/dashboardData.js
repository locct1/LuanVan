import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAllDashBoards } from '~/services/admin/admindashboard.service';
import {
    getAllColorProducts,
    addColorProduct,
    deleteColorProduct,
    updateColorProduct,
    getColorProductById,
} from '~/services/admin/colorproduct.service';
export const useDashBoardsData = (onSuccess, onError) => {
    return useQuery('admin-dashboards', getAllDashBoards);
};
