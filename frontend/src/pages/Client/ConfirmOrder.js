import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '~/components/Client/ProductCard';
import { LINK_PRODUCT_IMAGE, LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE, SHOP_ID, SERVICE_ID } from '~/helpers/constants';
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
import { set, useForm } from 'react-hook-form';
import { ClientLoadUser } from '~/redux/Slices/ClientAuthSlice';
import {
    callAPICaculateShippingFee,
    callAPIGetAllShops,
    callAPIGetDistrict,
    callAPIGetProvince,
    callAPIGetServiceDeliverys,
    callAPIGetWard,
} from '~/services/client/getaddress.service';
import { UpdateInfoClientService } from '~/services/client/clientAuth.service';
import { usePaymentMethodsData } from '~/hooks/react-query/paymentmethodData';
import { createOrderClient } from '~/services/client/page.service';
import { checkOutByVnPay } from '~/services/client/vnpayClient.service';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
function ConfirmOrder() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errorsForm, setErrorsForm] = useState([]);
    const [addressShop, setAddressShop] = useState({});
    const [shippingFee, setShippingFee] = useState({});
    const [checkedMethodPayment, setCheckedMethodPayment] = useState(1);
    const [loadingShippingFee, setLoadingShippingFee] = useState(false);
    const cart = useSelector(infoCart);
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
            note: yup.string().notRequired(),
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
        setWard(null);
        setDistrict(null);
        clearErrors('province');
        if (e.target.value === '') {
            return;
        }
        let ProvinceID = parseInt(e.target.value);
        let province = listProvinces.find((x) => x.ProvinceID === ProvinceID);
        setValue('province', e.target.value);
        let response = await callAPIGetDistrict(ProvinceID);
        setListDistricts(response);
        setListWards([]);
        setProvice(province);
        setValue('ward', '');
        setValue('district', '');
    };
    const handleDistrictChange = async (e) => {
        clearErrors('district');
        setWard(null);
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
        setValue('ward', e.target.value);
        setWard(ward);
    };
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        let response = await callAPIGetProvince();
        let responseAllShops = await callAPIGetAllShops();
        setAddressShop(responseAllShops.shops[0]);
        if (response) {
            setListProvinces(response);
        }
    };
    useEffect(() => {
        async function getServiceDeliverys() {
            try {
                if (infoClient && addressShop && cart) {
                    setLoadingShippingFee(true);
                    let districtID = null;
                    let wardCode = null;
                    if (showChangeAddress === true) {
                        setLoadingShippingFee(true);
                        setShippingFee(null);
                    } else {
                        districtID = infoClient.districtID;
                        wardCode = infoClient.wardCode;
                        setShippingFee(null);
                    }
                    if (district && ward && showChangeAddress) {
                        districtID = district.DistrictID;
                        wardCode = ward.WardCode;
                        setLoadingShippingFee(false);
                    }
                    console.log(cart.listProducts.weight);
                    const responseFee = await callAPICaculateShippingFee({
                        from_district_id: addressShop.district_id,
                        from_ward_code: addressShop.ward_code,
                        service_id: SERVICE_ID,
                        service_type_id: null,
                        to_district_id: districtID,
                        to_ward_code: wardCode,
                        height: cart.listProducts.reduce(
                            (total, product) => total + product.height * product.quantityCart,
                            0,
                        ),
                        length: cart.listProducts.reduce(
                            (total, product) => total + product.length * product.quantityCart,
                            0,
                        ),
                        weight: cart.listProducts.reduce(
                            (total, product) => total + product.weight * product.quantityCart,
                            0,
                        ),
                        width: cart.listProducts.reduce(
                            (total, product) => total + product.width * product.quantityCart,
                            0,
                        ),
                        insurance_value: cart.total * 0.05,
                        cod_failed_amount: 0,
                        coupon: null,
                    });
                    if (responseFee) {
                        setLoadingShippingFee(false);
                        setShippingFee(responseFee);
                    }
                }
            } catch (error) {}
        }
        getServiceDeliverys();
    }, [addressShop, infoClient, cart, district, ward, showChangeAddress]);
    const onSubmit = async (data) => {
        let fullAddress = '';
        setErrorsForm([]);
        if (showChangeAddress) {
            fullAddress =
                data.newAddress +
                ', ' +
                ward.WardName +
                ', ' +
                district.DistrictName +
                ', ' +
                province.NameExtension[1];
        }
        let UpdateInfoClient = {
            email: data.email,
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            address: showChangeAddress ? fullAddress : data.address,
            provinceID: showChangeAddress ? province.ProvinceID : infoClient.provinceID,
            wardCode: showChangeAddress ? ward.WardCode : infoClient.wardCode,
            districtID: showChangeAddress ? district.DistrictID : infoClient.districtID,
            houseNumberAndStreet: showChangeAddress ? data.newAddress : infoClient.houseNumberAndStreet,
        };
        let dataCreateCart = {
            infoRecipient: UpdateInfoClient,
            order: cart,
            paymentMethodId: checkedMethodPayment,
            note: data.note,
            height: cart.listProducts.reduce((total, product) => total + product.height * product.quantityCart, 0),
            length: cart.listProducts.reduce((total, product) => total + product.length * product.quantityCart, 0),
            weight: cart.listProducts.reduce((total, product) => total + product.weight * product.quantityCart, 0),
            width: cart.listProducts.reduce((total, product) => total + product.width * product.quantityCart, 0),
        };
        if (checkedMethodPayment === 1) {
            let response = await createOrderClient(dataCreateCart);
            if (response.success) {
                dispatch(CartSlice.actions.resetCart());
                navigate('/checkout-success');
            }
        } else if (checkedMethodPayment === 2 || checkedMethodPayment === 3) {
            dispatch(
                CartSlice.actions.updateInfoRecipient({
                    note: data.note,
                    recipient: UpdateInfoClient,
                    height: cart.listProducts.reduce(
                        (total, product) => total + product.height * product.quantityCart,
                        0,
                    ),
                    length: cart.listProducts.reduce(
                        (total, product) => total + product.length * product.quantityCart,
                        0,
                    ),
                    weight: cart.listProducts.reduce(
                        (total, product) => total + product.weight * product.quantityCart,
                        0,
                    ),
                    width: cart.listProducts.reduce(
                        (total, product) => total + product.width * product.quantityCart,
                        0,
                    ),
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
        setWard(null);
        setDistrict(null);
        setProvice(null);
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
                                <div className="form-group">
                                    <label className="font-weight-bold">Ghi chú:</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        name="note"
                                        placeholder="Ghi chú (nếu có)"
                                        {...register('note')}
                                        rows={5}
                                    />
                                    {errors.note?.message && <p className="mt-2 text-danger">{errors.note?.message}</p>}
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
                                        <div className="form-group">
                                            <label className="text-dark font-weight-bold" for="inputState">
                                                Quận/Huyện:
                                            </label>
                                            <select
                                                id="inputState"
                                                className="form-control"
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
                                        <div className="form-group">
                                            <label className="text-dark font-weight-bold" for="inputState">
                                                Phường/Xã:
                                            </label>
                                            <select
                                                id="inputState"
                                                className="form-control"
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
                                        <span className="bg bg-info text-light p-2 rounded">Vận chuyển</span>
                                        <h6 className="mt-3 font-weight-bold">Giao hàng nhanh</h6>
                                        <h6 className="mt-3 font-weight-bold">
                                            Phí vận chuyển:{' '}
                                            <span style={{ color: '#d70018' }}>
                                                {loadingShippingFee ||
                                                !shippingFee ||
                                                shippingFee.total === null ||
                                                shippingFee.total === undefined ? (
                                                    <>
                                                        <div class="spinner-border" role="status">
                                                            <span class="sr-only">Loading...</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {String(shippingFee.total).replace(
                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                            '$1,',
                                                        )}
                                                        <sup>đ</sup>
                                                    </>
                                                )}
                                            </span>
                                        </h6>
                                    </div>
                                </div>
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
