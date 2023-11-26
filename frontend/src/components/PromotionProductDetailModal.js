import { Button, Modal } from 'react-bootstrap';
import { LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE } from '~/helpers/constants';
import moment from 'moment';

import 'moment/locale/vi';
import { useEffect, useState } from 'react';
import { callAPIGetOrderDetail, callAPIGetOrderTrackingDetail } from '~/services/client/getaddress.service';
import { capitalizeFirstLetter } from '~/helpers/covertString';
import {
    useRequestCancelOrderClientData,
    useRequestConfirmReceivedOrderClientData,
} from '~/hooks/react-query/client/pageData';
import { toast } from 'react-toastify';
import PromotionProductDetailChart from './PromotionProductDetailChart';
function PromotionProductDetailModal({ show, onClose, promotionProduct }) {
    const totalValue = promotionProduct.promotionProductDetails.reduce((acc, detail) => {
        return acc + detail.discountedPrice * detail.quantity;
    }, 0);
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="modal-70w" style={{ minWidth: '87%' }}>
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title className="font-weight-bold text-light">
                        Thống kê đợt khuyến mãi: {promotionProduct.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className="font-weight-bold mt-2 mb-2">
                        Tổng doanh thu: {String(totalValue).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                        <sup>đ</sup>
                    </h5>
                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                        <thead>
                            <tr className="bg bg-dark text-light">
                                <th scope="col">#</th>
                                <th scope="col">Tên sản phẩm</th>
                                <th scope="col">Màu sắc</th>
                                <th scope="col">Giá khuyến mãi</th>
                                <th scope="col">Đã bán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotionProduct.promotionProductDetails &&
                            promotionProduct.promotionProductDetails.length > 0 ? (
                                promotionProduct.promotionProductDetails.map((item, index) => (
                                    <tr key={item.id}>
                                        <td scope="row">{++index}</td>
                                        <td>
                                            {item.productVersion?.product.name}
                                            {item.productVersion?.ram?.name && item.productVersion?.rom?.name && (
                                                <>
                                                    {' '}
                                                    ({item.productVersion?.ram.name}GB-
                                                    {item.productVersion?.rom.name}GB)
                                                </>
                                            )}
                                        </td>
                                        <td> {item.colorProduct?.name}</td>
                                        <td>
                                            {String(item.discountedPrice).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                            <sup>đ</sup>
                                        </td>
                                        <td>{item.quantity}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="text-center" colSpan="5">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <h5 className="font-weight-bold">Biểu đồ thống kê số lượng:</h5>
                    <PromotionProductDetailChart promotionProductDetails={promotionProduct.promotionProductDetails} />
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" variant="secondary" onClick={onClose}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PromotionProductDetailModal;
