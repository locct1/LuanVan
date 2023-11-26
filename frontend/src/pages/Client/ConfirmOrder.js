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
    useProductVersionsClientData,
    useProductsClientData,
    usePromotionProductsClientData,
    useShockDealsClientData,
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
    const [loading, setLoading] = useState(false);
    const [checkedMethodPayment, setCheckedMethodPayment] = useState(1);
    const [loadingShippingFee, setLoadingShippingFee] = useState(false);
    const cart = useSelector(infoCart);
    const { isLoading, data, isError, error } = usePaymentMethodsClientData();
    const { isLoading: isLoadingPromotionProduct, data: dataPromotionProducts } = usePromotionProductsClientData();
    const { isLoading: isLoadingProductVersions, data: dataProductVersions } = useProductVersionsClientData();
    const { isLoading: isLoadingShockDetails, data: dataShockDetails } = useShockDealsClientData();

    useEffect(() => {
        // Lặp qua dataPromotionProducts để trích xuất các productVersionId đang được khuyến mãi
        if (dataPromotionProducts && dataProductVersions && dataShockDetails) {
            let list = [];
            dataPromotionProducts.data.forEach((promotion) => {
                promotion.promotionProductDetails.forEach((detail) => {
                    list.push(detail);
                });
            });
            cart.listProducts.forEach((productSample) => {
                console.log({ productSample });
                const productVersionIdToCheck = productSample.productVersionId;
                console.log(productVersionIdToCheck);
                let promotionDetail = list.find((x) => x.productVersionId === productVersionIdToCheck);
                if (promotionDetail) {
                    // productVersionId tồn tại trong danh sách dataPromotionProducts.data
                    console.log('Có giá trị trong danh sách dataPromotionProducts.data', promotionDetail);
                    let productVersion = dataProductVersions.data.find(
                        (promotion) => promotion.id === productVersionIdToCheck,
                    );
                    if (productVersion) {
                        let data = {
                            productSample: productSample,
                            productVersion: productVersion,
                            promotionDetail: promotionDetail,
                        };
                        dispatch(CartSlice.actions.updateProductInPromotionProduct(data));
                    } else {
                        dispatch(CartSlice.actions.removeProduct({ id: productSample.id }));
                    }
                } else {
                    let productVersion = dataProductVersions.data.find(
                        (promotion) => promotion.id === productVersionIdToCheck,
                    );
                    if (productVersion) {
                        let data = {
                            productSample: productSample,
                            productVersion: productVersion,
                        };
                        dispatch(CartSlice.actions.updateProductInPromotionProduct(data));
                    } else {
                        dispatch(CartSlice.actions.removeProduct({ id: productSample.id }));
                    }
                }
                //shockdeals
                let listShockDeals = [];
                dataShockDetails.data.forEach((shockDeal) => {
                    shockDeal.shockDealDetails.forEach((detail) => {
                        listShockDeals.push(detail);
                    });
                });
                const listFilterShockDeal = listShockDeals.filter(
                    (x) => x.mainProductId === productSample.productVersion.productId,
                );
                let newList = cart.listShockDeals.filter((item) => item.productMainId === productSample.id);
                newList = newList.map((productShockDeal) => {
                    const foundInFilter = listFilterShockDeal.find(
                        (item) => item.shockDealProductId === productShockDeal.productId,
                    );

                    if (foundInFilter) {
                        let updateProductShockDeal = {
                            ...productShockDeal,
                            shockDealPrice: foundInFilter.shockDealPrice,
                        };
                        dispatch(CartSlice.actions.updateProductShockDeal(updateProductShockDeal));
                    } else {
                        dispatch(CartSlice.actions.deleteShockDeal(productShockDeal));
                    }
                    return null;
                });
                // Loại bỏ các phần tử null (các phần tử không nằm trong listFilterShockDeal)
            });
        }
    }, [dataPromotionProducts, dataProductVersions, dataShockDetails]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        let totalCartValue = 0;
        if (cart) {
            if (cart.listProducts && cart.listProducts.length > 0) {
                cart.listProducts.forEach((product) => {
                    const { priceOut, discountedPrice, quantityCart } = product;
                    if (discountedPrice === null) {
                        totalCartValue += priceOut * quantityCart;
                    } else {
                        totalCartValue += discountedPrice * quantityCart;
                    }
                });
            }
        }

        if (cart.listShockDeals && cart.listShockDeals.length > 0) {
            cart.listShockDeals.forEach((product) => {
                const { shockDealPrice, quantityCart } = product;
                if (quantityCart === 0) {
                    dispatch(CartSlice.actions.deleteShockDeal(product));
                } else {
                    totalCartValue += shockDealPrice * quantityCart;
                }
            });
        }

        setTotal(totalCartValue);
    }, [cart]);
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
                        insurance_value: total * 0.05,
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
            total: total,
            paymentMethodId: checkedMethodPayment,
            note: data.note,
            height:
                cart.listProducts.reduce((total, product) => total + product.height * product.quantityCart, 0) +
                cart.listShockDeals.reduce((total, product) => total + product.height * product.quantityCart, 0),
            length:
                cart.listProducts.reduce((total, product) => total + product.length * product.quantityCart, 0) +
                cart.listShockDeals.reduce((total, product) => total + product.length * product.quantityCart, 0),
            weight:
                cart.listProducts.reduce((total, product) => total + product.weight * product.quantityCart, 0) +
                cart.listShockDeals.reduce((total, product) => total + product.weight * product.quantityCart, 0),
            width:
                cart.listProducts.reduce((total, product) => total + product.width * product.quantityCart, 0) +
                cart.listShockDeals.reduce((total, product) => total + product.width * product.quantityCart, 0),
        };
        let response;
        if (checkedMethodPayment === 1) {
            setLoading(true); // Set loading to true during the action
            response = await createOrderClient(dataCreateCart);
            console.log(response);
            if (response.success) {
                dispatch(CartSlice.actions.resetCart());
                setLoading(false);
                navigate('/checkout-success');
            } else {
                toast.error(response.message);
            }
        } else if (checkedMethodPayment === 2 || checkedMethodPayment === 3) {
            setLoading(true); // Set loading to true during the action
            response = await createOrderClient(dataCreateCart);
            console.log(response);
            if (response.success) {
                dispatch(CartSlice.actions.resetCart());
                setLoading(false);
                dispatch(
                    CartSlice.actions.updateInfoRecipient({
                        note: data.note,
                        orderId: response.data.id,
                        recipient: UpdateInfoClient,
                        height:
                            cart.listProducts.reduce(
                                (total, product) => total + product.height * product.quantityCart,
                                0,
                            ) +
                            cart.listShockDeals.reduce(
                                (total, product) => total + product.height * product.quantityCart,
                                0,
                            ),
                        length:
                            cart.listProducts.reduce(
                                (total, product) => total + product.length * product.quantityCart,
                                0,
                            ) +
                            cart.listShockDeals.reduce(
                                (total, product) => total + product.length * product.quantityCart,
                                0,
                            ),
                        weight:
                            cart.listProducts.reduce(
                                (total, product) => total + product.weight * product.quantityCart,
                                0,
                            ) +
                            cart.listShockDeals.reduce(
                                (total, product) => total + product.weight * product.quantityCart,
                                0,
                            ),
                        width:
                            cart.listProducts.reduce(
                                (total, product) => total + product.width * product.quantityCart,
                                0,
                            ) +
                            cart.listShockDeals.reduce(
                                (total, product) => total + product.width * product.quantityCart,
                                0,
                            ),
                    }),
                );
                let responseVNPAY = await checkOutByVnPay({
                    orderType: 'Mobile Phone',
                    amount: total,
                    orderDescription: 'Thanh toán đặt hàng tại LKShop.Tổng tiền: ',
                    Name: UpdateInfoClient.fullName,
                });
                window.location.replace(responseVNPAY);
            } else {
                toast.error(response.message);
            }
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

    if (isLoading || isLoadingPromotionProduct || isLoadingProductVersions || isLoadingShockDetails) {
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
            {loading ? ( // Render the loading spinner when `loading` is true
                <div
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                    }}
                >
                    <CircularProgress /> <h4 className="ml-2 text-white">Đang tải</h4>
                </div>
            ) : null}
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
                                                            <th scope="col">Phiên bản</th>
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
                                                                    {item.productVersion?.ram?.name &&
                                                                    item.productVersion?.rom?.name ? (
                                                                        <span className="ram-rom-separator">
                                                                            {item.productVersion.ram.name}GB
                                                                            <span>-</span>
                                                                            {item.productVersion.rom.name}GB
                                                                        </span>
                                                                    ) : (
                                                                        // Render something when either `ram.name` or `rom.name` is not defined
                                                                        <span className="no-ram-rom-info">Không</span>
                                                                    )}
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
                                                        {cart.listShockDeals.map((item, index) => {
                                                            if (item.quantityCart > 0) {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{index + 1 + cart.listProducts.length}</td>
                                                                        <td>
                                                                            <span className="mr-1 text-danger font-weight-bold">
                                                                                [Deal sốc]
                                                                            </span>
                                                                            {item.productName}{' '}
                                                                            {item.colorProduct?.name ?? 'No color'}
                                                                        </td>
                                                                        <td>
                                                                            {item.productVersion?.ram?.name &&
                                                                            item.productVersion?.rom?.name ? (
                                                                                <span className="ram-rom-separator">
                                                                                    {item.productVersion.ram.name}GB
                                                                                    <span>-</span>
                                                                                    {item.productVersion.rom.name}GB
                                                                                </span>
                                                                            ) : (
                                                                                <span className="no-ram-rom-info">
                                                                                    Không
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            <img
                                                                                style={{ maxWidth: '83%' }}
                                                                                className="product__details__pic__item--large"
                                                                                src={LINK_PRODUCT_IMAGE + item.fileName}
                                                                                alt=""
                                                                            />
                                                                        </td>
                                                                        <td className="text-center td-actions">
                                                                            {item.quantityCart}
                                                                        </td>
                                                                        <td>
                                                                            <div>
                                                                                {item.shockDealPrice !== null ? (
                                                                                    <>
                                                                                        <div
                                                                                            className="product__details__price mr-2"
                                                                                            style={{
                                                                                                color: '#d70018',
                                                                                                fontWeight: 600,
                                                                                            }}
                                                                                        >
                                                                                            {String(
                                                                                                item.shockDealPrice,
                                                                                            ).replace(
                                                                                                /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                                '$1,',
                                                                                            )}
                                                                                            <sup>đ</sup>
                                                                                        </div>
                                                                                        <div
                                                                                            className="product__details__price"
                                                                                            style={{
                                                                                                textDecoration:
                                                                                                    'line-through',
                                                                                                color: '#6c757d',
                                                                                                fontWeight: 300,
                                                                                            }}
                                                                                        >
                                                                                            {String(
                                                                                                item?.priceOut,
                                                                                            ).replace(
                                                                                                /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                                '$1,',
                                                                                            )}
                                                                                            <sup>đ</sup>
                                                                                        </div>
                                                                                    </>
                                                                                ) : (
                                                                                    <div className="product__details__price">
                                                                                        {String(item?.priceOut).replace(
                                                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                            '$1,',
                                                                                        )}
                                                                                        <sup>đ</sup>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            {item.shockDealPrice !== null ? (
                                                                                <>
                                                                                    <div
                                                                                        className="product__details__price mr-2"
                                                                                        style={{
                                                                                            color: '#d70018',
                                                                                            fontWeight: 600,
                                                                                        }}
                                                                                    >
                                                                                        {String(
                                                                                            item.shockDealPrice *
                                                                                                item.quantityCart,
                                                                                        ).replace(
                                                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                            '$1,',
                                                                                        )}
                                                                                        <sup>đ</sup>
                                                                                    </div>
                                                                                    <div
                                                                                        className="product__details__price"
                                                                                        style={{
                                                                                            textDecoration:
                                                                                                'line-through',
                                                                                            color: '#6c757d',
                                                                                            fontWeight: 300,
                                                                                        }}
                                                                                    >
                                                                                        {String(
                                                                                            item.priceOut *
                                                                                                item.quantityCart,
                                                                                        ).replace(
                                                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                            '$1,',
                                                                                        )}
                                                                                        <sup>đ</sup>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <div className="product__details__price">
                                                                                    {String(
                                                                                        item.priceOut *
                                                                                            item.quantityCart,
                                                                                    ).replace(
                                                                                        /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                        '$1,',
                                                                                    )}
                                                                                    <sup>đ</sup>
                                                                                </div>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                            return null; // Skip rendering if quantityCart is not greater than 0
                                                        })}
                                                        <tr>
                                                            <td
                                                                colSpan={7}
                                                                className="bg bg-dark text-light text-center font-weight-bold"
                                                            >
                                                                Tổng tiền:{' '}
                                                                {String(total).replace(
                                                                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                    '$1,',
                                                                )}
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
