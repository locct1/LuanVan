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
    useShockDealsClientData,
} from '~/hooks/react-query/client/pageData';
import CartSlice from '~/redux/Slices/CartSlice';
import { infoCart, isAuthenticatedClientSelector } from '~/redux/selectors';
function Cart() {
    const dispatch = useDispatch();
    const cart = useSelector(infoCart);
    const navigate = useNavigate();
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
                    (x) =>
                        x.shockDealId === listShockDeals[0].shockDealId &&
                        x.mainProductId === productSample.productVersion.productId,
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
                totalCartValue += shockDealPrice * quantityCart;
            });
        }

        setTotal(totalCartValue);
    }, [cart]);
    const isAuthenticatedClient = useSelector(isAuthenticatedClientSelector);
    const handleChangeQuantityMinus = (productSample) => {
        let productMinustoCart = {
            ...productSample,
            quantityCart: 1,
        };
        dispatch(CartSlice.actions.minusProduct(productMinustoCart));
    };
    const handleChangeQuantityMinusShockDealProduct = (product) => {
        let productMinustoCart = {
            ...product,
            quantityCart: 1,
        };
        dispatch(CartSlice.actions.minusShockDealProduct(productMinustoCart));
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
    const handleChangeQuantityPlusShockDealProduct = (product) => {
        let productaddtoCart = {
            ...product,
            quantityCart: 1,
        };
        console.log({ productaddtoCart });
        dispatch(CartSlice.actions.plusShockDealProduct(productaddtoCart));
    };
    const handleClickCheckIsAuthenticatedClient = () => {
        if (!isAuthenticatedClient) {
            toast.warning('Vui lòng đăng nhập để đặt hàng');
            return;
        }
        window.scrollTo(0, 0);
        navigate('/confirm-order');
    };
    if (isLoadingPromotionProduct || isLoadingProductVersions || isLoadingShockDetails) {
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
                                                        {item.productName} ({item.colorProduct?.name})
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
                                            {cart.listShockDeals.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1 + cart.listProducts.length}</td>
                                                    <td>
                                                        <span className="mr-1 text-danger font-weight-bold">
                                                            [Deal sốc]
                                                        </span>
                                                        {item.productName}{' '}
                                                        {item.colorProduct?.name ?? <>{item.colorProduct?.name}</>}
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
                                                            src={LINK_PRODUCT_IMAGE + item.fileName}
                                                            alt=""
                                                        />
                                                    </td>
                                                    <td className="text-center td-actions">
                                                        <div className="product__details__quantity">
                                                            <div className="quantity">
                                                                <div className="pro-qty">
                                                                    <i
                                                                        onClick={() =>
                                                                            handleChangeQuantityMinusShockDealProduct(
                                                                                item,
                                                                            )
                                                                        }
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
                                                                        onClick={() =>
                                                                            handleChangeQuantityPlusShockDealProduct(
                                                                                item,
                                                                            )
                                                                        }
                                                                        className="fa fa-plus"
                                                                        style={{ cursor: 'pointer' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            {item.shockDealPrice !== null ? (
                                                                <>
                                                                    <div
                                                                        className="product__details__price mr-2"
                                                                        style={{ color: '#d70018', fontWeight: 600 }}
                                                                    >
                                                                        {String(item.shockDealPrice).replace(
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
                                                        {item.shockDealPrice !== null ? (
                                                            <>
                                                                <div
                                                                    className="product__details__price mr-2"
                                                                    style={{ color: '#d70018', fontWeight: 600 }}
                                                                >
                                                                    {String(
                                                                        item.shockDealPrice * item.quantityCart,
                                                                    ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
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
                                                                        item.quantityCart !== 0
                                                                            ? item.priceOut * item.quantityCart
                                                                            : item.priceOut,
                                                                    ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                                                    <sup>đ</sup>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="product__details__price">
                                                                    {String(item.priceOut * item.quantityCart).replace(
                                                                        /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                        '$1,',
                                                                    )}
                                                                    <sup>đ</sup>
                                                                </div>
                                                            </>
                                                        )}
                                                    </td>
                                                    <td className="text-center td-actions"></td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="bg bg-dark text-light text-center font-weight-bold"
                                                >
                                                    Tổng tiền:{' '}
                                                    {String(total).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
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
