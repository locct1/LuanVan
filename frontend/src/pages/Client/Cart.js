import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '~/components/Client/ProductCard';
import { LINK_PRODUCT_IMAGE, LINK_PRODUCT_SAMPLE_DEFAULT_IMAGE } from '~/helpers/constants';
import { stringToSlug } from '~/helpers/covertString';
import { useProductByIdClientData, useProductsClientData } from '~/hooks/react-query/client/pageData';
import CartSlice from '~/redux/Slices/CartSlice';
import { infoCart } from '~/redux/selectors';
function Cart() {
    const dispatch = useDispatch();
    const cart = useSelector(infoCart);
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
                    <div className="row">
                        <div className="col-12">
                            {cart && cart.listProducts.length > 0 ? (
                                <>
                                    {' '}
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
                                                        <img
                                                            style={{ maxWidth: '83%' }}
                                                            className="product__details__pic__item--large"
                                                            src={LINK_PRODUCT_SAMPLE_DEFAULT_IMAGE + item.fileName}
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
                                                        {String(item.priceOut).replace(
                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                            '$1,',
                                                        )}{' '}
                                                        <sup>đ</sup>
                                                    </td>
                                                    <td>
                                                        {String(item.priceOut * item.quantityCart).replace(
                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                            '$1,',
                                                        )}{' '}
                                                        <sup>đ</sup>
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
                                                    colSpan={7}
                                                    className="bg bg-dark text-light text-center font-weight-bold"
                                                >
                                                    Tổng tiền:{' '}
                                                    {String(cart.total).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}{' '}
                                                    <sup>đ</sup>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <h3>Chưa có sản phẩm nào trong giỏ hàng.</h3>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Cart;