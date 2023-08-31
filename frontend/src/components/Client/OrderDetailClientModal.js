import { Button, Modal } from 'react-bootstrap';
import { LINK_PRODUCT_SAMPLE_DEFAULT_IMAGE } from '~/helpers/constants';
import moment from 'moment';

import 'moment/locale/vi';
function OrderDetailClientModal({ show, onClose, dataOrder }) {
    const classNameStatus = [
        '',
        'badge  badge-warning text-dark',
        'badge  badge-info text-light',
        'badge  badge-secondary text-light',
        'badge  badge-success text-light',
    ];
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
                                                    <td>{item.items.length > 0 ? item.items[0].name : ''}</td>
                                                    <td>
                                                        <img
                                                            style={{ maxWidth: '83%' }}
                                                            className="product__details__pic__item--large"
                                                            src={
                                                                LINK_PRODUCT_SAMPLE_DEFAULT_IMAGE +
                                                                (item.items.length > 0 ? item.items[0].fileName : '')
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
                                                            (item.items.length > 0 ? item.items[0].priceOut : 0) *
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
                                                    {String(dataOrder.order.total).replace(
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default OrderDetailClientModal;
