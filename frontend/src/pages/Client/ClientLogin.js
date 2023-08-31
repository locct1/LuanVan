import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAddWareHouseData } from '~/hooks/react-query/warehouseData';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { callAPIGetDistrict, callAPIGetProvince, callAPIGetWard } from '~/services/client/getaddress.service';
import { Watermark } from 'antd';
import { LoginClient, RegisterClient } from '~/services/client/clientAuth.service';
import { LOCAL_STORAGE_TOKEN_CLIENT } from '~/helpers/constants';
import { useDispatch, useSelector } from 'react-redux';
import { ClientLoadUser } from '~/redux/Slices/ClientAuthSlice';
import { isAuthenticatedClientSelector } from '~/redux/selectors';
function ClientLogin() {
    const schema = yup
        .object()
        .shape({
            email: yup.string().email('Email không đúng định dạng').required('Vui lòng nhập email'),
            password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Tối thiểu 6 ký tự'),
        })
        .required();
    const {
        register,
        resetField,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });
    const navigate = useNavigate();
    const isAuthenticated = useSelector(isAuthenticatedClientSelector);
    useEffect(() => {
        if (isAuthenticated) {
            return navigate('/');
        }
    }, [isAuthenticated]);
    const [errorsForm, setErrorsForm] = useState([]);
    const dispatch = useDispatch();
    const onSubmit = async (data) => {
        setErrorsForm([]);
        let response = await LoginClient(data);
        console.log(response);
        if (response.success) {
            localStorage.setItem(LOCAL_STORAGE_TOKEN_CLIENT, response.accessToken);
            dispatch(ClientLoadUser());
            return navigate(-1);
        } else {
            setErrorsForm(response.errors);
        }
    };
    return (
        <>
            {' '}
            <section
                className="breadcrumb-section"
                style={{
                    backgroundImage: 'url(http://localhost:3000/img/client/breadcrumb.PNG)',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <div className="breadcrumb__option">
                                    <Link to="/">Trang chủ</Link>
                                    <span>Đăng nhập</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="product-details spad" style={{ paddingTop: '35px' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title">
                                <h2>Đăng nhập </h2>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-lg-6">
                            {errorsForm && errorsForm.length > 0 && (
                                <>
                                    {errorsForm.map((error, index) => (
                                        <p className="text-danger" key={index}>
                                            {error}
                                        </p>
                                    ))}
                                </>
                            )}
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                    <label className="text-dark font-weight-bold">Email:</label>
                                    <input
                                        type="text"
                                        placeholder="Nhập email"
                                        {...register('email')}
                                        className="form-control"
                                    />
                                    {errors.email?.message && (
                                        <p className="mt-2 text-danger">{errors.email?.message}</p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="text-dark font-weight-bold">Mật khẩu:</label>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu"
                                        {...register('password')}
                                        className="form-control"
                                    />
                                    {errors.password?.message && (
                                        <p className="mt-2 text-danger">{errors.password?.message}</p>
                                    )}
                                </div>

                                <button className="btn btn-success mb-3 w-100" type="submit">
                                    Đăng Nhập
                                </button>
                                <p>
                                    Nếu bạn chưa có tài khoản?{' '}
                                    <Link to="/client-register">Đăng ký tài khoản tại đây.</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ClientLogin;
