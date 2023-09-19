import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '~/components/Client/ProductCard';
import { LINK_PRODUCT_IMAGE, LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE } from '~/helpers/constants';
import { stringToSlug } from '~/helpers/covertString';
import {
    useProductByIdClientData,
    useProductVersionsClientData,
    useProductsClientData,
    usePromotionProductsClientData,
} from '~/hooks/react-query/client/pageData';
import CartSlice from '~/redux/Slices/CartSlice';
import { infoCart, isAuthenticatedClientSelector } from '~/redux/selectors';
function Cart() {
    const dispatch = useDispatch();
    const cart = useSelector(infoCart);
    const navigate = useNavigate();
    const { isLoading: isLoadingPromotionProduct, data: dataPromotionProducts } = usePromotionProductsClientData();
    const { isLoading: isLoadingProductVersions, data: dataProductVersions } = useProductVersionsClientData();
    useEffect(() => {
        // Lặp qua dataPromotionProducts để trích xuất các productVersionId đang được khuyến mãi
        if (dataPromotionProducts && dataProductVersions) {
            let list = [];
            dataPromotionProducts.data.forEach((promotion) => {
                promotion.promotionProductDetails.forEach((detail) => {
                    list.push(detail);
                });
            });
            cart.listProducts.forEach((productSample) => {
                console.log(productSample);
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
            });
        }
    }, [dataPromotionProducts, dataProductVersions]);
    const isAuthenticatedClient = useSelector(isAuthenticatedClientSelector);
    const handleChangeQuantityMinus = (productSample) => {
        let productMinustoCart = {
            ...productSample,
            quantityCart: 1,
        };
        dispatch(CartSlice.actions.minusProduct(productMinustoCart));
    };
    const handleClickRemoveProduct = (productSample) => {
        dispatch(CartSlice.actions.removeProduct({ id: productSample.id }));
    };
    const handleChangeQuantityPlus = (productSample) => {
        let productaddtoCart = {
            ...productSample,
            quantityCart: 1,
        };
        dispatch(CartSlice.actions.plusProduct(productaddtoCart));
    };
    const handleClickCheckIsAuthenticatedClient = () => {
        if (!isAuthenticatedClient) {
            toast.warning('Vui lòng đăng nhập để đặt hàng');
            return;
        }
        window.scrollTo(0, 0);
        navigate('/confirm-order');
    };
    if (isLoadingPromotionProduct || isLoadingProductVersions) {
        <></>;
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
                                    <span>Giỏ hàng</span>
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
                                <h2>Giỏ hàng </h2>
                            </div>
                        </div>
                    </div>
                    {cart && cart.listProducts.length > 0 ? (
                        <>
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
                                                <th scope="col">Số lượng </th>
                                                <th scope="col">Giá </th>
                                                <th scope="col">Thành tiền</th>
                                                <th scope="col">Hành động</th>
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
                                                        <span className="ram-rom-separator">
                                                            {item.productVersion.ram?.name}GB
                                                            <span>-</span>
                                                            {item.productVersion.rom?.name}GB
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <img
                                                            style={{ maxWidth: '83%' }}
                                                            className="product__details__pic__item--large"
                                                            src={
                                                                LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE + item.fileName
                                                            }
                                                            alt=""
                                                        />
                                                    </td>
                                                    <td className="text-center td-actions">
                                                        <div className="product__details__quantity">
                                                            <div className="quantity">
                                                                <div className="pro-qty">
                                                                    <i
                                                                        onClick={() => handleChangeQuantityMinus(item)}
                                                                        className="fa fa-minus"
                                                                        style={{ cursor: 'pointer' }}
                                                                    ></i>
                                                                    <input
                                                                        type="text"
                                                                        defaultValue={1}
                                                                        value={item.quantityCart}
                                                                        //onChange={(e) => handleChangeQuantity(e)}
                                                                    />
                                                                    <i
                                                                        onClick={() => handleChangeQuantityPlus(item)}
                                                                        className="fa fa-plus"
                                                                        style={{ cursor: 'pointer' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            {item.discountedPrice && item.discountedPrice !== null ? (
                                                                <>
                                                                    <div
                                                                        className="product__details__price mr-2"
                                                                        style={{ color: '#d70018', fontWeight: 600 }}
                                                                    >
                                                                        {String(item.discountedPrice).replace(
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
                                                        {item.discountedPrice && item.discountedPrice !== null ? (
                                                            <>
                                                                <div
                                                                    className="product__details__price mr-2"
                                                                    style={{ color: '#d70018', fontWeight: 600 }}
                                                                >
                                                                    {String(
                                                                        item.discountedPrice * item.quantityCart,
                                                                    ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}{' '}
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
                                                                    {String(item.priceOut * item.quantityCart).replace(
                                                                        /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                        '$1,',
                                                                    )}{' '}
                                                                    <sup>đ</sup>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="product__details__price">
                                                                    {String(item.priceOut * item.quantityCart).replace(
                                                                        /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                        '$1,',
                                                                    )}{' '}
                                                                    <sup>đ</sup>
                                                                </div>
                                                            </>
                                                        )}
                                                    </td>
                                                    <td className="text-center td-actions">
                                                        <button
                                                            class="btn btn-danger"
                                                            onClick={() => handleClickRemoveProduct(item)}
                                                        >
                                                            {' '}
                                                            <i class="fa fa-trash" aria-hidden="true"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="bg bg-dark text-light text-center font-weight-bold"
                                                >
                                                    Tổng tiền:{' '}
                                                    {String(cart.total).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}{' '}
                                                    <sup>đ</sup>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <Link to="/" className="btn btn-dark">
                                        Trang chủ
                                    </Link>

                                    <button
                                        className="btn btn-primary ml-2"
                                        onClick={() => handleClickCheckIsAuthenticatedClient()}
                                    >
                                        Xác nhận đặt hàng
                                    </button>
                                    <button className="btn btn-danger ml-2">Xóa tất cả</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <h3>Chưa có sản phẩm nào trong giỏ hàng.</h3>
                    )}
                </div>
            </section>
        </>
    );
}

export default Cart;
