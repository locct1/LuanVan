import { Button, Modal } from 'react-bootstrap';
import { LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE } from '~/helpers/constants';
import moment from 'moment';

import 'moment/locale/vi';
import { useEffect, useState } from 'react';
import { callAPIGetOrderDetail, callAPIGetOrderTrackingDetail } from '~/services/client/getaddress.service';
import { capitalizeFirstLetter } from '~/helpers/covertString';
import { useRequestCancelOrderClientData } from '~/hooks/react-query/client/pageData';
import { toast } from 'react-toastify';
function OrderDetailClientModal({ show, onClose, dataOrder }) {
    const classNameStatus = [
        '',
        'badge  badge-warning text-dark',
        'badge  badge-info text-light',
        'badge  badge-secondary text-light',
        'badge  badge-success text-light',
        'badge  badge-dark text-light',
        'badge  badge-danger text-light',
    ];
    const listRequireNote = [
        {
            require_note: 'CHOXEMHANGKHONGTHU',
            description: 'Cho xem hàng không cho thử',
        },
        {
            require_note: 'CHOTHUHANG',
            description: 'Cho thử hàng',
        },
        {
            require_note: 'KHONGCHOXEMHANG',
            description: 'Không cho xem hàng',
        },
    ];
    const [orderDetail, setOrderDetail] = useState();
    const [orderTrackingDetail, setOrderTrackingDetail] = useState();
    useEffect(() => {
        fetchDataGetOrderDetail();
    }, [dataOrder]);
    const fetchDataGetOrderDetail = async () => {
        if (dataOrder.order.orderCode) {
            let response = await callAPIGetOrderDetail({
                order_code: dataOrder.order.orderCode,
            });
            let responseTracking = await callAPIGetOrderTrackingDetail({
                order_code: dataOrder.order.orderCode,
            });
            // console.log('respone', response.data);
            // console.log('responeTracking', responseTracking.data);
            if (response.code === 200 && responseTracking.code === 200) {
                setOrderDetail(response.data);
                setOrderTrackingDetail(responseTracking.data);
            }
        }
    };
    const onSuccessRequestCancelOrderClientData = (data) => {
        if (data.success) {
            toast.success(data?.message);
        }
    };
    const { mutate: requestCancelOrderClient } = useRequestCancelOrderClientData(onSuccessRequestCancelOrderClientData);

    const handleCancelOrder = async () => {
        let data = {
            orderStatusId: 5,
            orderId: dataOrder.order.id,
        };
        requestCancelOrderClient(data);
    };
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="modal-70w">
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title className="font-weight-bold text-light">
                        Chi tiết đơn đặt hàng: {dataOrder.order.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row mb-4 mt-3 ml-3 mr-3">
                        <div className="col-12">
                            <span className="bg bg-info text-light p-2 rounded">Thông tin người nhận hàng</span>
                        </div>
                    </div>
                    <div className="row ml-3 mr-3">
                        <div className="col-12">
                            <p className="card-text">
                                <span className="font-weight-bold">Họ và tên:</span>{' '}
                                {dataOrder.order.recipient.fullName}
                            </p>
                            <p className="card-text ">
                                <span className="font-weight-bold">Email:</span> {dataOrder.order.recipient.email}
                            </p>
                            <p className="card-text ">
                                <span className="font-weight-bold">Địa chỉ:</span>
                                {dataOrder.order.recipient.address}
                            </p>
                            <p className="card-text ">
                                <span className="font-weight-bold">Điện thoại:</span>{' '}
                                {dataOrder.order.recipient.phoneNumber}
                            </p>
                        </div>
                    </div>
                    <div className="row mb-4 mt-3 ml-3 mr-3">
                        <div className="col-12">
                            <span className="bg bg-info text-light p-2 rounded">Thông tin đơn hàng</span>
                        </div>
                    </div>
                    <div className="row ml-3 mr-3">
                        <div className="col-12">
                            <p className="card-text">
                                <span className="font-weight-bold">Ngày đặt:</span>{' '}
                                {moment(dataOrder.order.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                            </p>
                            <p className="card-text ">
                                <span className="font-weight-bold">Ngày cập nhât:</span>{' '}
                                {moment(dataOrder.order.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                            </p>
                            <p className="card-text ">
                                <span className="font-weight-bold">Phương thức thanh toán:</span>
                                {dataOrder.order.paymentMethod.name}
                            </p>
                            <p className="card-text ">
                                <span className="font-weight-bold">Trạng thái đơn hàng:</span>
                                <span className={classNameStatus[dataOrder.order.orderStatusId]}>
                                    {dataOrder.order.orderStatus.name}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="row mb-4 mt-4 ml-3 mr-3">
                        <div className="col-12">
                            <span className="bg bg-info text-light p-2 rounded">Danh sách sản phẩm đặt hàng</span>
                        </div>
                    </div>
                    {dataOrder.order && dataOrder.orderDetails.length > 0 ? (
                        <>
                            <div className="row ml-3 mr-3">
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
                                            {dataOrder.orderDetails.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{++index}</td>
                                                    <td>
                                                        {item.items.length > 0 &&
                                                            item.items[0].isShockDeal === true && (
                                                                <>
                                                                    <span className="mr-1 text-danger font-weight-bold">
                                                                        [Deal sốc]
                                                                    </span>
                                                                </>
                                                            )}
                                                        {item.items.length > 0 ? item.items[0].name : ''}
                                                    </td>
                                                    <td>
                                                        <img
                                                            style={{ maxWidth: '83%' }}
                                                            className="product__details__pic__item--large"
                                                            src={
                                                                LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE +
                                                                (item.items.length > 0 ? item.items[0].fileName : '')
                                                            }
                                                            alt=""
                                                        />
                                                    </td>
                                                    <td className="">{item.items.length}</td>
                                                    <td>
                                                        {String(
                                                            item.items.length > 0 ? item.items[0].priceOut : 0,
                                                        ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                                        <sup>đ</sup>
                                                    </td>
                                                    <td>
                                                        {String(
                                                            (item.items.length > 0 ? item.items[0].priceOut : 0) *
                                                                (item.items.length > 0 ? item.items.length : 0),
                                                        ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
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
                                                    {String(dataOrder.order.total).replace(
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
                            <div className="row mb-4 mt-3 ml-3 mr-3">
                                <div className="col-12">
                                    <span className="bg bg-info text-light p-2 rounded">Thông tin vận chuyển</span>
                                </div>
                            </div>
                            {dataOrder.order.orderCode ? (
                                <>
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="row ml-4 bg-light-tag-order-delivery text-dark p-1 rounded">
                                                <div className="col-12 font-weight-bold">THÔNG TIN ĐƠN HÀNG</div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Mã đơn hàng:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                {' '}
                                                                <span className="font-weight-bold">
                                                                    {dataOrder.order.orderCode}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Ngày lấy dự kiến:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                {' '}
                                                                <span className="font-weight-bold">
                                                                    {capitalizeFirstLetter(
                                                                        moment(
                                                                            orderTrackingDetail?.order_info.picktime,
                                                                        ).format('dddd, DD/MM/YYYY'),
                                                                    )}{' '}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Ngày giao dự kiến:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                <span className="font-weight-bold">
                                                                    {capitalizeFirstLetter(
                                                                        moment(
                                                                            orderTrackingDetail?.order_info.leadtime,
                                                                        ).format('dddd, DD/MM/YYYY'),
                                                                    )}{' '}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Trạng thái đơn hàng:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                {' '}
                                                                <span className="font-weight-bold p-2 bg-dark text-white rounded">
                                                                    {orderTrackingDetail?.order_info.status_name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="row ml-4 bg-light-tag-order-delivery text-dark p-1 rounded">
                                                <div className="col-12 font-weight-bold">THÔNG TIN CHI TIẾT</div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Sản phẩm:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                {' '}
                                                                <span className="font-weight-bold">
                                                                    {orderDetail?.content}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Cân nặng:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                {' '}
                                                                <span className="font-weight-bold">
                                                                    {orderDetail?.weight}g
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Lưu ý giao hàng:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                {' '}
                                                                <span className="font-weight-bold">
                                                                    {listRequireNote.find(
                                                                        (item) =>
                                                                            item.require_note ===
                                                                            orderDetail?.required_note,
                                                                    )?.description || ''}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-6">
                                            <div className="row ml-4 bg-light-tag-order-delivery text-dark p-1 rounded">
                                                <div className="col-12 font-weight-bold">THÔNG TIN KHÁCH HÀNG</div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Họ và tên:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                {' '}
                                                                <span className="font-weight-bold">
                                                                    {orderDetail?.to_name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Điện thoại:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                {' '}
                                                                <span className="font-weight-bold">
                                                                    {orderDetail?.to_phone}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Địa chỉ:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                {' '}
                                                                <span className="font-weight-bold">
                                                                    {orderDetail?.to_address}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="row ml-4 bg-light-tag-order-delivery text-dark p-1 rounded">
                                                <div className="col-12 font-weight-bold">CHI PHÍ</div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Người trả:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                {' '}
                                                                <span className="font-weight-bold">
                                                                    {orderDetail?.payment_type_id === 1 ? (
                                                                        <>Người gửi trả phí</>
                                                                    ) : (
                                                                        <>Người nhận trả phí</>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Sản phẩm:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                {' '}
                                                                <span className="font-weight-bold">
                                                                    {' '}
                                                                    {String(orderDetail?.cod_amount).replace(
                                                                        /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                        '$1,',
                                                                    )}
                                                                    <sup>đ</sup>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Vận chuyển:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                {' '}
                                                                <span className="font-weight-bold">
                                                                    {' '}
                                                                    {String(
                                                                        orderTrackingDetail?.order_info.total_fee,
                                                                    ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                                                    <sup>đ</sup>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <h6 className="card-text">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                {' '}
                                                                <span className="">Tổng chi phí:</span>{' '}
                                                            </div>
                                                            <div className="col-6">
                                                                {' '}
                                                                <span className="font-weight-bold">
                                                                    {' '}
                                                                    {String(
                                                                        orderDetail?.cod_amount +
                                                                            orderTrackingDetail?.order_info.total_fee,
                                                                    ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                                                    <sup>đ</sup>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-3 ml-1 mr-1 text-center">
                                        <div className="col-12">
                                            <div className="row ml-4 bg-light-tag-order-delivery text-dark p-1 rounded">
                                                <div className="col-12 font-weight-bold">LỊCH SỬ ĐƠN HÀNG</div>
                                            </div>
                                            <div className="row ml-4 mt-3">
                                                <div className="col-12">
                                                    <table class="table">
                                                        <thead className="bg bg-dark text-light">
                                                            <tr>
                                                                <th scope="col">Thời gian</th>
                                                                <th scope="col">Vị trí</th>
                                                                <th scope="col">Trạng thái</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {orderTrackingDetail &&
                                                            orderTrackingDetail.tracking_logs.length > 0 ? (
                                                                orderTrackingDetail.tracking_logs.map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td>
                                                                            {capitalizeFirstLetter(
                                                                                moment(item.action_at).format(
                                                                                    'dddd, DD/MM/YYYY',
                                                                                ),
                                                                            )}{' '}
                                                                            -{' '}
                                                                            {capitalizeFirstLetter(
                                                                                moment(item.action_at).format('HH:mm'),
                                                                            )}
                                                                        </td>
                                                                        <td>{item.location.address}</td>
                                                                        <td>
                                                                            <span
                                                                                className={`font-weight-bold p-2 ${
                                                                                    item.status === 'cancel'
                                                                                        ? 'bg-danger'
                                                                                        : 'bg-primary'
                                                                                } text-white rounded`}
                                                                            >
                                                                                {item.status_name}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                        </>
                    ) : (
                        <h3>Chưa có sản phẩm nào trong giỏ hàng.</h3>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {dataOrder.order.orderStatusId === 5 ? (
                        <>
                            {' '}
                            <Button type="button" variant="danger" disabled>
                                Đã yêu cầu hủy
                            </Button>
                        </>
                    ) : (
                        <></>
                    )}
                    {dataOrder.order.orderStatusId === 6 ? (
                        <>
                            {' '}
                            <Button type="button" variant="danger" disabled>
                                Đã hủy
                            </Button>
                        </>
                    ) : (
                        <></>
                    )}
                    {dataOrder.order.orderStatusId === 5 ||
                    dataOrder.order.orderStatusId === 6 ||
                    dataOrder.order.orderStatusId === 4 ? (
                        <></>
                    ) : (
                        <>
                            {' '}
                            <Button type="submit" variant="danger" onClick={() => handleCancelOrder()}>
                                Yêu cầu hủy đơn hàng
                            </Button>
                        </>
                    )}

                    <Button type="submit" variant="secondary" onClick={onClose}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default OrderDetailClientModal;
