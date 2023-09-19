import {
    useColorProductsData,
    useAddColorProductData,
    useDeleteColorProductData,
} from '~/hooks/react-query/colorproductData';
import { Navigate, Outlet, useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import InputSearch from '~/components/InputSearch';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { stringToSlug } from '~/helpers/covertString';
import { DateSchema } from 'yup';
import LoadingAdmin from '~/components/LoadingAdmin';
import { useGetOrderData } from '~/hooks/react-query/orderData';
import { LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE } from '~/helpers/constants';
function DetailOrder() {
    const { id } = useParams();
    console.log(id);
    const { isLoading, data, isError, error } = useGetOrderData(id);
    console.log(data);
    if (isLoading) {
        return <LoadingAdmin />;
    }
    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Mã đơn hàng: {data.data.order.id}</h6>
                </div>
                <div className="card-body">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Thông tin tài khoản đặt hàng</h6>
                        </div>
                        <div className="card-body">
                            <p className="card-text">
                                <span className="font-weight-bold">Họ và tên:</span> {data.data.order.user.fullName}
                            </p>
                            <p className="card-text">
                                <span className="font-weight-bold">Email:</span> {data.data.order.user.email}
                            </p>
                            <p className="card-text">
                                <span className="font-weight-bold">Địa chỉ:</span>
                                {data.data.order.user.address}
                            </p>
                            <p className="card-text">
                                <span className="font-weight-bold">Điện thoại:</span> {data.data.order.user.phoneNumber}
                            </p>
                        </div>
                    </div>
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Thông tin người nhận hàng</h6>
                        </div>
                        <div className="card-body">
                            <p className="card-text">
                                <span className="font-weight-bold">Họ và tên:</span>{' '}
                                {data.data.order.recipient.fullName}
                            </p>
                            <p className="card-text">
                                <span className="font-weight-bold">Email:</span> {data.data.order.recipient.email}
                            </p>
                            <p className="card-text">
                                <span className="font-weight-bold">Địa chỉ:</span>
                                {data.data.order.recipient.address}
                            </p>
                            <p className="card-text">
                                <span className="font-weight-bold">Điện thoại:</span>{' '}
                                {data.data.order.recipient.phoneNumber}
                            </p>
                        </div>
                    </div>

                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Thông tin chi tiết đặt hàng</h6>
                        </div>
                        <div className="card-body">
                            {data && data.data.orderDetails.length > 0 ? (
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
                                                        <th scope="col" width="10%">
                                                            Hình ảnh
                                                        </th>
                                                        <th scope="col">Số lượng </th>
                                                        <th scope="col">Giá </th>
                                                        <th scope="col">Thành tiền</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.data.orderDetails.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{++index}</td>
                                                            <td>{item.items.length > 0 ? item.items[0].name : ''}</td>
                                                            <td>
                                                                <img
                                                                    style={{ maxWidth: '83%' }}
                                                                    className="product__details__pic__item--large"
                                                                    src={
                                                                        LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE +
                                                                        (item.items.length > 0
                                                                            ? item.items[0].fileName
                                                                            : '')
                                                                    }
                                                                    alt=""
                                                                />
                                                            </td>
                                                            <td className="">{item.items.length}</td>
                                                            <td>
                                                                {String(
                                                                    item.items.length > 0 ? item.items[0].priceOut : 0,
                                                                ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}{' '}
                                                                <sup>đ</sup>
                                                            </td>
                                                            <td>
                                                                {String(
                                                                    (item.items.length > 0
                                                                        ? item.items[0].priceOut
                                                                        : 0) *
                                                                        (item.items.length > 0 ? item.items.length : 0),
                                                                ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}{' '}
                                                                <sup>đ</sup>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td
                                                            colSpan={7}
                                                            className="bg bg-dark text-light text-center font-weight-bold"
                                                        >
                                                            Tổng tiền:{' '}
                                                            {String(data.data.order.total).replace(
                                                                /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                '$1,',
                                                            )}{' '}
                                                            <sup>đ</sup>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <Link to="/admin-list-orders" type="submit" className="btn btn-dark ml-3">
                                            Quay lại
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <h3>Chưa có sản phẩm nào trong giỏ hàng.</h3>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DetailOrder;
