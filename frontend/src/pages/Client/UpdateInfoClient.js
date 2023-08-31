import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '~/components/Client/ProductCard';
import { LINK_PRODUCT_IMAGE, LINK_PRODUCT_SAMPLE_DEFAULT_IMAGE } from '~/helpers/constants';
import { stringToSlug } from '~/helpers/covertString';
import { useProductByIdClientData, useProductsClientData } from '~/hooks/react-query/client/pageData';
import CartSlice from '~/redux/Slices/CartSlice';
import { infoCart, infoClientSelector, isAuthenticatedClientSelector } from '~/redux/selectors';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ClientLoadUser } from '~/redux/Slices/ClientAuthSlice';
import { callAPIGetDistrict, callAPIGetProvince, callAPIGetWard } from '~/services/client/getaddress.service';
import { UpdateInfoClientService } from '~/services/client/clientAuth.service';
function UpdateInfoClient() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errorsForm, setErrorsForm] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const infoClient = useSelector(infoClientSelector);
    const isAuthenticatedClient = useSelector(isAuthenticatedClientSelector);
    const schema = yup
        .object()
        .shape({
            fullName: yup.string().required('Vui lòng nhập họ và tên'),
            email: yup.string().email('Email không đúng định dạng').required('Vui lòng nhập email'),
            phoneNumber: yup.string().matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Số điện thoại không hợp lệ.'),
            address: yup.string().required('Vui lòng nhập địa chỉ'),
        })
        .required();
    const schemaAddress = yup
        .object()
        .shape({
            fullName: yup.string().required('Vui lòng nhập họ và tên'),
            email: yup.string().email('Email không đúng định dạng').required('Vui lòng nhập email'),
            phoneNumber: yup.string().matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Số điện thoại không hợp lệ.'),
            newAddress: yup.string().required('Vui lòng nhập địa chỉ'),
            province: yup.string().required('Vui lòng chọn thành phố'),
            district: yup.string().required('Vui lòng chọn quận'),
            ward: yup.string().required('Vui lòng chọn phường'),
        })
        .required();
    const [showChangeAddress, setShowAddress] = useState(false);
    const {
        register,
        reset,
        handleSubmit,
        clearErrors,
        resetField,
        setValue,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(showChangeAddress ? schemaAddress : schema),
        defaultValues: infoClient,
    });
    const [listProvinces, setListProvinces] = useState([]);
    const [listDistricts, setListDistricts] = useState([]);
    const [listWards, setListWards] = useState([]);
    const [province, setProvice] = useState();
    const [ward, setWard] = useState();
    const [district, setDistrict] = useState();
    useEffect(() => {
        reset(infoClient);
    }, [infoClient]);
    const handleProvinceChange = async (e) => {
        clearErrors('province');
        if (e.target.value === '') {
            return;
        }
        let code = parseInt(e.target.value);
        let province = listProvinces.find((x) => x.code === code);
        setValue('province', e.target.value);
        let response = await callAPIGetDistrict(code);
        setListDistricts(response.districts);
        setListWards([]);
        setProvice(province);
        setValue('ward', '');
        setValue('district', '');
    };
    const handleDistrictChange = async (e) => {
        clearErrors('district');
        let code = parseInt(e.target.value);
        let district = listDistricts.find((x) => x.code === code);
        setValue('district', e.target.value);
        setDistrict(district);
        let response = await callAPIGetWard(code);
        setListWards(response.wards);
        setValue('ward', '');
    };
    const handleWardChange = async (e) => {
        clearErrors('ward');
        let code = parseInt(e.target.value);
        let ward = listWards.find((x) => x.code === code);
        setValue('ward', e.target.value);
        setWard(ward);
    };
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        let response = await callAPIGetProvince();
        if (response) {
            setListProvinces(response);
        }
    };
    const onSubmit = async (data) => {
        let fullAddress = '';
        setErrorsForm([]);
        if (showChangeAddress) {
            fullAddress = data.newAddress + ', ' + ward.name + ', ' + district.name + ', ' + province.name;
        }
        let UpdateInfoClient = {
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            address: showChangeAddress ? fullAddress : data.address,
        };
        let response = await UpdateInfoClientService(UpdateInfoClient);
        if (response.success) {
            toast.success(response.message);
            dispatch(ClientLoadUser());
            setShowAddress(false);
            setListDistricts([]);
            setListWards([]);
            setListProvinces([]);
            return;
        }
        setErrorsForm(response.errors);
    };
    const handleShowChangeAddress = async () => {
        setShowAddress(!showChangeAddress);
        setListDistricts([]);
        setProvice('');
        setListWards([]);
        let response = await callAPIGetProvince();
        if (response) {
            setListProvinces(response);
        }
        clearErrors('province');
        clearErrors('district');
        clearErrors('ward');
        setValue('province', '');
        setValue('district', '');
        setValue('ward', '');
        resetField('newAddress');
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
                                    <span>Cập nhật thông tin</span>
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
                                <h2>Cập nhật thông tin </h2>
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
                                        disabled={'disabled'}
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
                                <div className="form-group">
                                    <label className="text-dark font-weight-bold">Địa chỉ:</label>
                                    <input
                                        type="text"
                                        placeholder="Nhập địa chỉ"
                                        {...register('address')}
                                        disabled={'disabled'}
                                        className="form-control"
                                    />
                                    {errors.address?.message && (
                                        <p className="mt-2 text-danger">{errors.address?.message}</p>
                                    )}
                                </div>
                                <span className="btn btn-primary mb-3" onClick={handleShowChangeAddress}>
                                    Đổi địa chỉ
                                </span>
                                {showChangeAddress === true ? (
                                    <>
                                        <div class="form-group">
                                            <label className="text-dark font-weight-bold" for="inputState">
                                                Tỉnh/Thành phố:
                                            </label>
                                            <select
                                                id="inputState"
                                                class="form-control"
                                                value={province?.code || ''}
                                                onChange={handleProvinceChange}
                                            >
                                                <option selected value="">
                                                    Chọn tỉnh/thành phố
                                                </option>
                                                {listProvinces?.map((province, index) => (
                                                    <option value={province.code} key={index}>
                                                        {province.name}
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
                                                value={district?.code || ''}
                                                onChange={handleDistrictChange}
                                            >
                                                <option selected value="">
                                                    Chọn quận/huyện
                                                </option>
                                                {listDistricts?.map((district, index) => (
                                                    <option value={district.code} key={index}>
                                                        {district.name}
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
                                                value={ward?.code || ''}
                                                onChange={handleWardChange}
                                            >
                                                <option selected value="">
                                                    Chọn phường/xã
                                                </option>
                                                {listWards?.map((ward, index) => (
                                                    <option value={ward.code} key={index}>
                                                        {ward.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.ward?.message && (
                                                <p className="mt-2 text-danger">{errors.ward?.message}</p>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label className="text-dark font-weight-bold">Số nhà/đường:</label>
                                            <textarea
                                                class="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="3"
                                                placeholder="Nhập số nhà"
                                                {...register('newAddress')}
                                            ></textarea>
                                            {errors.newAddress?.message && (
                                                <p className="mt-2 text-danger">{errors.newAddress?.message}</p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
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

export default UpdateInfoClient;
