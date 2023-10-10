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
import { RegisterClient } from '~/services/client/clientAuth.service';
import { useSelector } from 'react-redux';
import { isAuthenticatedClientSelector } from '~/redux/selectors';
function ClientRegister() {
    const navigate = useNavigate();
    const isAuthenticated = useSelector(isAuthenticatedClientSelector);
    useEffect(() => {
        if (isAuthenticated) {
            return navigate('/');
        }
    }, [isAuthenticated]);
    const schema = yup
        .object()
        .shape({
            fullName: yup.string().required('Vui lòng nhập họ và tên'),
            address: yup.string().required('Vui lòng nhập số nhà'),
            email: yup.string().email('Email không đúng định dạng').required('Vui lòng nhập email'),
            phoneNumber: yup.string().matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Số điện thoại không hợp lệ.'),
            password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Tối thiểu 6 ký tự'),
            confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu không khớp'),
            province: yup.string().required('Vui lòng chọn thành phố'),
            district: yup.string().required('Vui lòng chọn quận'),
            ward: yup.string().required('Vui lòng chọn phường'),
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
    const [listProvinces, setListProvinces] = useState([]);
    const [listDistricts, setListDistricts] = useState([]);
    const [listWards, setListWards] = useState([]);
    const [province, setProvice] = useState();
    const [ward, setWard] = useState();
    const [district, setDistrict] = useState();
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        let response = await callAPIGetProvince();
        console.log(response);
        if (response) {
            setListProvinces(response);
        }
    };

    const handleProvinceChange = async (e) => {
        clearErrors('province');
        if (e.target.value === '') {
            return;
        }
        let ProvinceID = parseInt(e.target.value);
        let province = listProvinces.find((x) => x.ProvinceID === ProvinceID);
        setValue('province', e.target.value);
        let response = await callAPIGetDistrict(province.ProvinceID);
        console.log('check', response);
        setListDistricts(response);
        setListWards([]);
        setProvice(province);
        setValue('ward', '');
        setValue('district', '');
    };
    const handleDistrictChange = async (e) => {
        clearErrors('district');
        let DistrictID = parseInt(e.target.value);
        let district = listDistricts.find((x) => x.DistrictID === DistrictID);
        setValue('district', e.target.value);
        setDistrict(district);
        let response = await callAPIGetWard(DistrictID);
        setListWards(response);
        setValue('ward', '');
    };
    const handleWardChange = async (e) => {
        clearErrors('ward');
        let WardCode = e.target.value;
        let ward = listWards.find((x) => x.WardCode === WardCode);
        console.log(listWards);
        setValue('ward', e.target.value);
        setWard(ward);
    };
    const onSubmit = async (data) => {
        setErrorsForm([]);
        const fullAddress =
            data.address + ', ' + ward.WardName + ', ' + district.DistrictName + ', ' + province.NameExtension[1];
        console.log(fullAddress);
        let createAccount = {
            ...data,
            fullAddress: fullAddress,
            provinceID: province.ProvinceID,
            wardCode: ward.WardCode,
            districtID: district.DistrictID,
            houseNumberAndStreet: data.address,
        };
        let response = await RegisterClient(createAccount);
        console.log(response);
        if (!response.success) {
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
                                    <span>Đăng ký tài khoản</span>
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
                                <h2>Đăng ký tài khoản </h2>
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
                                    <label className="text-dark font-weight-bold">Họ và tên:</label>
                                    <input
                                        type="text"
                                        placeholder="Nhập họ tên"
                                        {...register('fullName')}
                                        className="form-control"
                                    />
                                    {errors.fullName?.message && (
                                        <p className="mt-2 text-danger">{errors.fullName?.message}</p>
                                    )}
                                </div>
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
                                    <label className="text-dark font-weight-bold">Số điện thoại:</label>
                                    <input
                                        type="text"
                                        placeholder="Nhập số điện thoại"
                                        {...register('phoneNumber')}
                                        className="form-control"
                                    />
                                    {errors.phoneNumber?.message && (
                                        <p className="mt-2 text-danger">{errors.phoneNumber?.message}</p>
                                    )}
                                </div>
                                <div class="form-group">
                                    <label className="text-dark font-weight-bold" for="inputState">
                                        Tỉnh/Thành phố:
                                    </label>
                                    <select
                                        id="inputState"
                                        class="form-control"
                                        value={province?.ProvinceID || ''}
                                        onChange={handleProvinceChange}
                                    >
                                        <option selected value="">
                                            Chọn tỉnh/thành phố
                                        </option>
                                        {listProvinces?.map((province, index) => (
                                            <option value={province.ProvinceID} key={index}>
                                                {province.NameExtension[1]}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.province?.message && (
                                        <p className="mt-2 text-danger">{errors.province?.message}</p>
                                    )}
                                </div>
                                <div class="form-group">
                                    <label className="text-dark font-weight-bold" for="inputState">
                                        Quận/Huyện:
                                    </label>
                                    <select
                                        id="inputState"
                                        class="form-control"
                                        value={district?.DistrictID || ''}
                                        onChange={handleDistrictChange}
                                    >
                                        <option selected value="">
                                            Chọn quận/huyện
                                        </option>
                                        {listDistricts?.map((district, index) => (
                                            <option value={district.DistrictID} key={index}>
                                                {district.DistrictName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.district?.message && (
                                        <p className="mt-2 text-danger">{errors.district?.message}</p>
                                    )}
                                </div>
                                <div class="form-group">
                                    <label className="text-dark font-weight-bold" for="inputState">
                                        Phường/Xã:
                                    </label>
                                    <select
                                        id="inputState"
                                        class="form-control"
                                        value={ward?.WardCode || ''}
                                        onChange={handleWardChange}
                                    >
                                        <option selected value="">
                                            Chọn phường/xã
                                        </option>
                                        {listWards?.map((ward, index) => (
                                            <option value={ward.WardCode} key={index}>
                                                {ward.WardName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.ward?.message && <p className="mt-2 text-danger">{errors.ward?.message}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="text-dark font-weight-bold">Số nhà/đường:</label>
                                    <textarea
                                        class="form-control"
                                        id="exampleFormControlTextarea1"
                                        rows="3"
                                        placeholder="Nhập số nhà"
                                        {...register('address')}
                                    ></textarea>
                                    {errors.address?.message && (
                                        <p className="mt-2 text-danger">{errors.address?.message}</p>
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
                                    Đăng Ký
                                </button>
                                <p>
                                    Nếu bạn đã có tài khoản? <Link to="/client-login">Đăng nhập tại đây.</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ClientRegister;
