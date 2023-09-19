import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '~/components/Client/ProductCard';
import { LINK_PRODUCT_IMAGE, LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE } from '~/helpers/constants';
import { stringToSlug } from '~/helpers/covertString';
import {
    usePaymentMethodsClientData,
    useProductByIdClientData,
    useProductsClientData,
} from '~/hooks/react-query/client/pageData';
import CartSlice from '~/redux/Slices/CartSlice';
import { infoCart, infoClientSelector } from '~/redux/selectors';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ClientLoadUser } from '~/redux/Slices/ClientAuthSlice';
import { callAPIGetDistrict, callAPIGetProvince, callAPIGetWard } from '~/services/client/getaddress.service';
import { UpdateInfoClientService } from '~/services/client/clientAuth.service';
import { usePaymentMethodsData } from '~/hooks/react-query/paymentmethodData';
import { createOrderClient } from '~/services/client/page.service';
import { checkOutByVnPay } from '~/services/client/vnpayClient.service';
function ConfirmOrder() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errorsForm, setErrorsForm] = useState([]);
    const [checkedMethodPayment, setCheckedMethodPayment] = useState(1);
    const { isLoading, data, isError, error } = usePaymentMethodsClientData();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const infoClient = useSelector(infoClientSelector);
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
            email: data.email,
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            address: showChangeAddress ? fullAddress : data.address,
        };
        let dataCreateCart = {
            infoRecipient: UpdateInfoClient,
            order: cart,
            paymentMethodId: checkedMethodPayment,
        };
        console.log(dataCreateCart);
        if (checkedMethodPayment === 1) {
            let response = await createOrderClient(dataCreateCart);
            if (response.success) {
                dispatch(CartSlice.actions.resetCart());
                navigate('/checkout-success');
            }
        } else if (checkedMethodPayment === 2 || checkedMethodPayment === 3) {
            dispatch(
                CartSlice.actions.updateInfoRecipient({
                    note: 'dsđs',
                    recipient: UpdateInfoClient,
                }),
            );
            let response = await checkOutByVnPay({
                orderType: 'Mobile Phone',
                amount: cart.total,
                orderDescription: 'Thanh toán đặt hàng tại LKShop.Tổng tiền: ',
                Name: UpdateInfoClient.fullName,
            });
            window.location.replace(response);
        }
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
    //Cart
    const cart = useSelector(infoCart);

    if (isLoading) {
        return <></>;
    }
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
                                    <span>Xác nhận đơn đặt hàng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="product-details spad" style={{ paddingTop: '35px' }}>
                <div className="container-flud ml-5 mr-5">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title">
                                <h2>Xác nhận đơn đặt hàng </h2>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-lg-5 shadow-lg p-3 mb-4 bg-white rounded border">
                                {errorsForm && errorsForm.length > 0 && (
                                    <>
                                        {errorsForm.map((error, index) => (
                                            <p className="text-danger" key={index}>
                                                {error}
                                            </p>
                                        ))}
                                    </>
                                )}
                                <div className="row mb-3">
                                    <div className="col-12 mt-3">
                                        <span className="bg bg-info text-light p-2 rounded">Thông tin khách hàng</span>
                                    </div>
                                </div>
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
                                {showChangeAddress === true ? (
                                    <></>
                                ) : (
                                    <>
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
                                    </>
                                )}

                                <span className="btn btn-primary mb-3" onClick={handleShowChangeAddress}>
                                    Đổi địa chỉ
                                </span>
                                {showChangeAddress === true ? (
                                    <>
                                        <div className="form-group">
                                            <label className="text-dark font-weight-bold" for="inputState">
                                                Tỉnh/Thành phố:
                                            </label>
                                            <select
                                                id="inputState"
                                                className="form-control"
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
                                        <div className="form-group">
                                            <label className="text-dark font-weight-bold" for="inputState">
                                                Quận/Huyện:
                                            </label>
                                            <select
                                                id="inputState"
                                                className="form-control"
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
                                        <div className="form-group">
                                            <label className="text-dark font-weight-bold" for="inputState">
                                                Phường/Xã:
                                            </label>
                                            <select
                                                id="inputState"
                                                className="form-control"
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
                                                className="form-control"
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
                            </div>
                            <div className="col-1" style={{ maxWidth: '3.5%' }}></div>
                            <div
                                className="col-lg-6 shadow-lg p-3 mb-4 bg-white rounded border"
                                style={{ maxWidth: '54%', flex: '0 0 54%' }}
                            >
                                {cart && cart.listProducts.length > 0 ? (
                                    <>
                                        <div className="row mb-3 mt-3">
                                            <div className="col-12">
                                                <span className="bg bg-info text-light p-2 rounded">
                                                    Chi tiết đơn đặt hàng
                                                </span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <table
                                                    id="tblGioHang"
                                                    className="table table-bordered"
                                                    style={{ border: '1px solid #343a40' }}
                                                >
                                                    <thead className="thead-dark">
                                                        <tr>
                                                            <th scope="col" width="1%">
                                                                #
                                                            </th>
                                                            <th scope="col">Tên sản phẩm</th>
                                                            <th scope="col" width="10%">
                                                                Hình ảnh
                                                            </th>
                                                            <th scope="col" width="15%">
                                                                Số lượng{' '}
                                                            </th>
                                                            <th scope="col" width="20%">
                                                                Giá{' '}
                                                            </th>
                                                            <th scope="col" width="20%">
                                                                Thành tiền
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cart.listProducts.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{++index}</td>
                                                                <td>
                                                                    {item.productName} ({item.colorProduct.name})
                                                                </td>
                                                                <td>
                                                                    <img
                                                                        style={{ maxWidth: '83%' }}
                                                                        className="product__details__pic__item--large"
                                                                        src={
                                                                            LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE +
                                                                            item.fileName
                                                                        }
                                                                        alt=""
                                                                    />
                                                                </td>
                                                                <td className="text-center td-actions">
                                                                    {item.quantityCart}
                                                                </td>
                                                                <td>
                                                                    <div>
                                                                        {item.discountedPrice &&
                                                                        item.discountedPrice !== null ? (
                                                                            <>
                                                                                <div
                                                                                    className="product__details__price mr-2"
                                                                                    style={{
                                                                                        color: '#d70018',
                                                                                        fontWeight: 600,
                                                                                    }}
                                                                                >
                                                                                    {String(
                                                                                        item.discountedPrice,
                                                                                    ).replace(
                                                                                        /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                        '$1,',
                                                                                    )}
                                                                                    <sup>đ</sup>
                                                                                </div>
                                                                                <div
                                                                                    className="product__details__price"
                                                                                    style={{
                                                                                        textDecoration: 'line-through', // Gạch ngang chữ
                                                                                        color: '#6c757d', // Màu chữ xám
                                                                                        fontWeight: 300,
                                                                                    }}
                                                                                >
                                                                                    {String(item?.priceOut).replace(
                                                                                        /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                        '$1,',
                                                                                    )}
                                                                                    <sup>đ</sup>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div className="product__details__price">
                                                                                    {String(item?.priceOut).replace(
                                                                                        /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                        '$1,',
                                                                                    )}
                                                                                    <sup>đ</sup>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {item.discountedPrice &&
                                                                    item.discountedPrice !== null ? (
                                                                        <>
                                                                            <div
                                                                                className="product__details__price mr-2"
                                                                                style={{
                                                                                    color: '#d70018',
                                                                                    fontWeight: 600,
                                                                                }}
                                                                            >
                                                                                {String(
                                                                                    item.discountedPrice *
                                                                                        item.quantityCart,
                                                                                ).replace(
                                                                                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                    '$1,',
                                                                                )}{' '}
                                                                                <sup>đ</sup>
                                                                            </div>
                                                                            <div
                                                                                className="product__details__price"
                                                                                style={{
                                                                                    textDecoration: 'line-through', // Gạch ngang chữ
                                                                                    color: '#6c757d', // Màu chữ xám
                                                                                    fontWeight: 300,
                                                                                }}
                                                                            >
                                                                                {String(
                                                                                    item.priceOut * item.quantityCart,
                                                                                ).replace(
                                                                                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                    '$1,',
                                                                                )}{' '}
                                                                                <sup>đ</sup>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="product__details__price">
                                                                                {String(
                                                                                    item.priceOut * item.quantityCart,
                                                                                ).replace(
                                                                                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                    '$1,',
                                                                                )}{' '}
                                                                                <sup>đ</sup>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        <tr>
                                                            <td
                                                                colSpan={6}
                                                                className="bg bg-dark text-light text-center font-weight-bold"
                                                            >
                                                                Tổng tiền:{' '}
                                                                {String(cart.total).replace(
                                                                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                    '$1,',
                                                                )}{' '}
                                                                <sup>đ</sup>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <h3>Chưa có sản phẩm nào trong giỏ hàng.</h3>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-5 shadow-lg p-3 mb-4 bg-white rounded border">
                                {' '}
                                <div className="row mb-3">
                                    <div className="col-12 mt-3">
                                        <span className="bg bg-info text-light p-2 rounded">
                                            Phương thức thanh toán
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-5">
                                        {data.data.map((item) => {
                                            return (
                                                <div key={item.id} className="mb-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedMethodPayment === item.id}
                                                        onChange={() => setCheckedMethodPayment(item.id)}
                                                    />
                                                    <span className="ml-3">{item.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-5">
                                <button className="btn btn-success mb-3 w-100" type="submit">
                                    Xác nhận đặt hàng
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}

export default ConfirmOrder;
