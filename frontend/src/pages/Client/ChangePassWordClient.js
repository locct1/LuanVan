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
import { ChangePassWordClientService, RegisterClient } from '~/services/client/clientAuth.service';
import { useSelector } from 'react-redux';
import { isAuthenticatedClientSelector } from '~/redux/selectors';
function ChangePassWordClient() {
    const schema = yup
        .object()
        .shape({
            oldPassWord: yup.string().required('Vui lòng nhập mật khẩu cũ').min(6, 'Tối thiểu 6 ký tự'),
            newPassWord: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Tối thiểu 6 ký tự'),
            confirmPassword: yup.string().oneOf([yup.ref('newPassWord'), null], 'Mật khẩu không khớp'),
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

    const [errorsForm, setErrorsForm] = useState([]);

    const onSubmit = async (data) => {
        setErrorsForm([]);
        let response = await ChangePassWordClientService(data);
        console.log(response);
        if (!response.success) {
            setErrorsForm(response.errors);
            return;
        }
        setValue('oldPassWord', '');
        setValue('newPassWord', '');
        setValue('confirmPassword', '');
        toast.success('Thay đổi mật khẩu thành công');
    };
    return (
        <>
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
                                    <Link to="/update-info-client">Cập nhật thông tin</Link>
                                    <span>Thay đổi mật khẩu</span>
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
                                <h2>Thay đổi mật khẩu</h2>
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
                                    <label className="text-dark font-weight-bold">Mật khẩu cũ:</label>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu cũ"
                                        {...register('oldPassWord')}
                                        className="form-control"
                                    />
                                    {errors.oldPassWord?.message && (
                                        <p className="mt-2 text-danger">{errors.oldPassWord?.message}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="text-dark font-weight-bold">Mật khẩu mới:</label>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu"
                                        {...register('newPassWord')}
                                        className="form-control"
                                    />
                                    {errors.newPassWord?.message && (
                                        <p className="mt-2 text-danger">{errors.newPassWord?.message}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="text-dark font-weight-bold">Nhập lại mật khẩu:</label>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu"
                                        {...register('confirmPassword')}
                                        className="form-control"
                                    />
                                    {errors.confirmPassword?.message && (
                                        <p className="mt-2 text-danger">{errors.confirmPassword?.message}</p>
                                    )}
                                </div>

                                <button className="btn btn-success mb-3 w-100" type="submit">
                                    Xác nhận
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ChangePassWordClient;
