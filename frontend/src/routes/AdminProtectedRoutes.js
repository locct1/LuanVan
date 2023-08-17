import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthenticatedAdminSelector } from '~/redux/selectors';
const useAuthHost = () => {
    const isAuthenticated = useSelector(isAuthenticatedAdminSelector);

    if (isAuthenticated) {
        return true;
    }
    return false;
};

const AdminProtectedRoutes = () => {
    const location = useLocation();
    const isAuth = useAuthHost();
    return isAuth ? <Outlet /> : <Navigate to="/admin-login" state={{ from: location }} replace />;
};

export default AdminProtectedRoutes;
