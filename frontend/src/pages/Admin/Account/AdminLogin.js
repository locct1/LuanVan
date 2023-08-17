import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthenticatedAdminSelector } from '~/redux/selectors';
import { Login } from '~/services/admin/adminauth.service';
import { LOCAL_STORAGE_TOKEN_ADMIN } from '~/helpers/constants';
import { AdminLoadUser } from '~/redux/Slices/AdminAuthSlice';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import '~/assets/admin/vendor/fontawesome-free/css/all.min.css';
import '~/assets/admin/css/sb-admin-2.css';
import './Login.scss';
import Card from 'react-bootstrap/Card';
function AdminLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/admin-dashboard';
    const isAuthenticated = useSelector(isAuthenticatedAdminSelector);
    useEffect(() => {
        if (isAuthenticated) {
            return navigate(from, { replace: true });
        }
    }, [isAuthenticated]);
    useEffect(() => {
        document.body.style.backgroundColor = `#34568b`;
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);
    const [user, setUser] = useState({
        email: '',
        password: '',
    });
    const { email, password } = user;
    const dispatch = useDispatch();
    const onChangeUser = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };
    const validateEasy = (user) => {
        const { email, password } = user;
        if (email === '' || password === '') {
            toast.error('Các trường không được để trống');
            return false;
        }
        return true;
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        let check = validateEasy(user);
        if (!check) {
            return;
        }
        try {
            let response = await Login(user);
            if (!response.success) {
                toast.error(response.message);
                return;
            }
            localStorage.setItem(LOCAL_STORAGE_TOKEN_ADMIN, response.accessToken);
            dispatch(AdminLoadUser());
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className="admin-auth">
                <div className="container col-5">
                    <Card>
                        <Card.Header className="text-center font-weight-bold">Đăng nhập vào trang quản trị</Card.Header>
                        <Card.Body>
                            <div className="row justify-content-center">
                                <div className="col-lg-10">
                                    <Form onSubmit={onSubmit}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label className="font-weight-bold">Email:</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Nhập email"
                                                name="email"
                                                value={email}
                                                onChange={(e) => onChangeUser(e)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label className="font-weight-bold">Mật khẩu: </Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Nhập mật khẩu"
                                                name="password"
                                                value={password}
                                                onChange={(e) => onChangeUser(e)}
                                            />
                                        </Form.Group>
                                        <Button variant="primary" className="mb-3 w-100" type="submit">
                                            Đăng nhập
                                        </Button>
                                    </Form>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default AdminLogin;
