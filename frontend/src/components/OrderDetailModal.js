import { Button, Modal } from 'react-bootstrap';
import { LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE, SERVICE_ID } from '~/helpers/constants';
import moment from 'moment';

import 'moment/locale/vi';
import { useEffect, useRef, useState } from 'react';
import {
    callAPIA5GenToken,
    callAPICaculateShippingFee,
    callAPICancelOrder,
    callAPICreateOrder,
    callAPIGetAllShops,
    callAPIGetOrderDetail,
    callAPIGetOrderTrackingDetail,
    callAPIPickShift,
} from '~/services/client/getaddress.service';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { set, useForm } from 'react-hook-form';
import { callAPIPrintA5, updateOrderStatus } from '~/services/admin/order.service';
import { toast } from 'react-toastify';
import { useUpdateOrderStatusData } from '~/hooks/react-query/orderData';
import 'moment/locale/vi';
import { capitalizeFirstLetter } from '~/helpers/covertString';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';

function OrderDetailModal({ show, onClose, dataOrder, onRefetch, onCreateOrderForDelivery }) {
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
    const [addressShop, setAddressShop] = useState({});
    const [shippingFee, setShippingFee] = useState({});
    const [listPickShift, setListPickShift] = useState([]);
    const [orderDetail, setOrderDetail] = useState();
    const [orderTrackingDetail, setOrderTrackingDetail] = useState();
    const [printContentHTML, setPrintContentHTML] = useState('');

    const onSuccessUpdateOrderStatus = (data) => {
        if (data.success) {
            toast.success(data?.message);
        }
    };
    const { mutate: updateOrderStatus } = useUpdateOrderStatusData(onSuccessUpdateOrderStatus);
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        fetchDataGetOrderDetail();
    }, [dataOrder]);
    const schema = yup
        .object()
        .shape({
            payment_type_id: yup
                .number()
                .typeError('Vui lòng chọn người trả phí vận chuyển')
                .required('Vui lòng chọn người trả phí vận chuyển'),
            required_note: yup
                .string('Vui lòng chọn lưu ý đơn hàng vận chuyển')
                .required('Vui lòng chọn lưu ý đơn hàng vận chuyển'),
            pick_shift: yup
                .number('Vui lòng chọn thời gian lấy hàng')
                .typeError('Vui lòng chọn người trả phí vận chuyển')
                .required('Vui lòng chọn thời gian lấy hàng'),
        })
        .required();
    const {
        register,
        resetField,
        handleSubmit,
        clearErrors,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            payment_type_id: 2,
        },
    });
    const fetchData = async () => {
        let responseAllShops = await callAPIGetAllShops();
        let response = await callAPIPickShift();
        setAddressShop(responseAllShops.shops[0]);
        setListPickShift(response);
    };
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
    const printContent = async () => {
        let response = await callAPIA5GenToken({
            order_codes: [dataOrder.order.orderCode],
        });
        let responseContentHTML = await callAPIPrintA5(response.data.token);
        const newWindow = window.open('', '_blank');
        newWindow.document.open();
        newWindow.document.write(responseContentHTML);
        newWindow.document.close();
        newWindow.focus();
        newWindow.print();
        // Thêm sự kiện onbeforeprint để xử lý trước khi in
        newWindow.onbeforeprint = function () {
            console.log('Người dùng đang chuẩn bị in...');
        };

        // Thêm sự kiện onafterprint để xử lý sau khi in
        newWindow.onafterprint = function () {
            console.log('Người dùng đã in xong.');
            newWindow.close();
        };
    };
    const cancelOrder = async () => {
        let respone = await callAPICancelOrder({
            order_codes: [dataOrder.order.orderCode],
        });
        if (respone.code === 200) {
            let data = {
                orderCode: respone.data.order_code,
                orderStatusId: 6,
                orderId: dataOrder.order.id,
            };
            updateOrderStatus(data);
        }
    };
    useEffect(() => {
        async function getServiceDeliverys() {
            try {
                if (addressShop && dataOrder) {
                    const responseFee = await callAPICaculateShippingFee({
                        from_district_id: addressShop.district_id,
                        from_ward_code: addressShop.ward_code,
                        service_id: SERVICE_ID,
                        service_type_id: 2,
                        to_district_id: dataOrder.order.districtID,
                        to_ward_code: dataOrder.order.wardCode,
                        height: dataOrder.order.height,
                        length: dataOrder.order.length,
                        weight: dataOrder.order.weight,
                        width: dataOrder.order.width,
                        insurance_value: dataOrder.order.total * 0.05,
                        cod_failed_amount: 0,
                        coupon: null,
                    });
                    if (responseFee) {
                        setShippingFee(responseFee);
                    }
                }
            } catch (error) {}
        }
        getServiceDeliverys();
    }, [addressShop, dataOrder]);
    const onSubmit = async (data) => {
        let items = [];
        console.log(dataOrder.order.orderCode);
        if (dataOrder.order.orderCode === null) {
            dataOrder.orderDetails.forEach((element) => {
                let productSampleIdString = element.productSampleId.toString();
                let item = {
                    name:
                        element.items[0].isShockDeal === true
                            ? '[Deal sốc] ' + element.items[0].name
                            : element.items[0].name,
                    code: productSampleIdString,
                    quantity: element.items.length,
                    price: element.items[0].priceOut,

                    category: {
                        level1: 'Điện thoại',
                    },
                };
                items.push(item);
            });
            let toPhone = '';
            if (dataOrder.order.recipient && dataOrder.order.recipient.phoneNumber) {
                toPhone = dataOrder.order.recipient.phoneNumber.toString();
            }
            let createOrder = {
                payment_type_id: data.payment_type_id,
                note: dataOrder.order.note,
                required_note: data.required_note,
                return_phone: addressShop.phone,
                return_address: addressShop.address,
                return_district_id: addressShop.district_id,
                return_ward_code: addressShop.ward_code,
                client_order_code: '',
                to_name: dataOrder.order.recipient.fullName,
                to_phone: toPhone,
                to_address: dataOrder.order.recipient.address,
                to_ward_code: dataOrder.order.wardCode,
                to_district_id: dataOrder.order.districtID,
                cod_amount: dataOrder.order.paymentMethodId === 1 ? dataOrder.order.total : 0,
                content: 'Đặt hàng tại LKshop',
                weight: dataOrder.order.weight,
                length: dataOrder.order.length,
                width: dataOrder.order.width,
                height: dataOrder.order.height,
                pick_station_id: null,
                deliver_station_id: null,
                insurance_value: dataOrder.order.paymentMethodId === 1 ? dataOrder.order.total * 0.05 : 0,
                service_id: 53320,
                service_type_id: 2,
                coupon: null,
                pick_shift: [data.pick_shift],
                items: items,
            };
            let response = await callAPICreateOrder(createOrder);
            if (response.code === 200) {
                let data = {
                    orderCode: response.data.order_code,
                    orderStatusId: 2,
                    orderId: dataOrder.order.id,
                };
                updateOrderStatus(data);
                onCreateOrderForDelivery();
            }
            if (response.code === 400) {
                toast.error(response.message);
            }
        }
    };
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="modal-70w">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton className="bg-primary">
                        <Modal.Title className="font-weight-bold text-light">
                            Chi tiết đơn đặt hàng: {dataOrder.order.id}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row mb-4 mt-3 ml-3 mr-3">
                            <div className="col-6">
                                <span className="bg bg-info text-light p-2 rounded">Thông tin tài khoản đặt hàng</span>
                            </div>
                            <div className="col-6">
                                <span className="bg bg-info text-light p-2 rounded">Thông tin người nhận hàng</span>
                            </div>
                        </div>
                        <div className="row ml-3 mr-3">
                            <div className="col-6">
                                <p className="card-text">
                                    <span className="font-weight-bold">Họ và tên:</span> {dataOrder.order.user.fullName}
                                </p>
                                <p className="card-text ">
                                    <span className="font-weight-bold">Email:</span> {dataOrder.order.user.email}
                                </p>
                                <p className="card-text ">
                                    <span className="font-weight-bold">Địa chỉ:</span>
                                    {dataOrder.order.user.address}
                                </p>
                                <p className="card-text ">
                                    <span className="font-weight-bold">Điện thoại:</span>{' '}
                                    {dataOrder.order.user.phoneNumber}
                                </p>
                            </div>
                            <div className="col-6">
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
                                                                                orderTrackingDetail?.order_info
                                                                                    .picktime,
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
                                                                                orderTrackingDetail?.order_info
                                                                                    .leadtime,
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
                                                                                orderTrackingDetail?.order_info
                                                                                    .total_fee,
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
                                                                    orderTrackingDetail.tracking_logs.map(
                                                                        (item, index) => (
                                                                            <tr key={index}>
                                                                                <td>
                                                                                    {capitalizeFirstLetter(
                                                                                        moment(item.action_at).format(
                                                                                            'dddd, DD/MM/YYYY',
                                                                                        ),
                                                                                    )}{' '}
                                                                                    -{' '}
                                                                                    {capitalizeFirstLetter(
                                                                                        moment(item.action_at).format(
                                                                                            'HH:mm',
                                                                                        ),
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
                                                                        ),
                                                                    )
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
                                    <>
                                        <div className="row ml-3 mr-3">
                                            <div className="col-12">
                                                <p className="card-text">
                                                    <span className="font-weight-bold">Phí vận chuyển:</span>
                                                    <span style={{ color: '#d70018' }} className="font-weight-bold">
                                                        {!shippingFee ||
                                                        shippingFee.total === null ||
                                                        shippingFee.total === undefined ? (
                                                            <>
                                                                <div class="spinner-border" role="status">
                                                                    <span class="sr-only">Loading...</span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {' '}
                                                                {String(shippingFee.total).replace(
                                                                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                    '$1,',
                                                                )}
                                                                <sup>đ</sup>
                                                            </>
                                                        )}
                                                    </span>
                                                </p>
                                                <p className="card-text d-flex mb-0">
                                                    <span className="font-weight-bold">Người trả phí vận chuyển:</span>{' '}
                                                    <div className="form-group form-check ml-2">
                                                        <input
                                                            type="radio"
                                                            className="form-check-input"
                                                            id="exampleCheck1"
                                                            value={1}
                                                            {...register('payment_type_id')}
                                                        />
                                                        <label className="form-check-label" htmlFor="exampleCheck1">
                                                            Người bán trả phí
                                                        </label>
                                                    </div>
                                                    <div className="form-group form-check ml-2">
                                                        <input
                                                            type="radio"
                                                            className="form-check-input"
                                                            id="exampleCheck2"
                                                            value={2}
                                                            checked={true}
                                                            {...register('payment_type_id')}
                                                        />
                                                        <label className="form-check-label" htmlFor="exampleCheck1">
                                                            Người nhận trả phí
                                                        </label>
                                                    </div>
                                                    {errors.payment_type_id?.message && (
                                                        <p className="mt-2 text-danger">
                                                            {errors.payment_type_id?.message}
                                                        </p>
                                                    )}
                                                </p>
                                                <p className="card-text ">
                                                    <div class="form-group row">
                                                        <label
                                                            for="inputPassword"
                                                            class="col-sm-2 col-form-label font-weight-bold"
                                                        >
                                                            Lưu ý đơn hàng vận chuyển:
                                                        </label>
                                                        <div class="col-5">
                                                            <select
                                                                className="form-control"
                                                                name="required_note"
                                                                {...register('required_note')}
                                                            >
                                                                <option disabled selected value="">
                                                                    Chọn lưu ý
                                                                </option>
                                                                <option value="CHOTHUHANG">Cho thử hàng</option>
                                                                <option value="CHOXEMHANGKHONGTHU">
                                                                    Cho xem hàng không thử
                                                                </option>
                                                                <option value="KHONGCHOXEMHANG">
                                                                    Không cho xem hàng
                                                                </option>
                                                            </select>
                                                            {errors.required_note?.message && (
                                                                <p className="mt-2 text-danger">
                                                                    {errors.required_note?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </p>
                                                <p className="card-text ">
                                                    <div class="form-group row">
                                                        <label
                                                            for="inputPassword"
                                                            class="col-sm-2 col-form-label font-weight-bold"
                                                        >
                                                            Chọn thời gian lấy hàng:
                                                        </label>
                                                        <div class="col-5">
                                                            <select
                                                                className="form-control"
                                                                name="pick_shift"
                                                                {...register('pick_shift')}
                                                            >
                                                                <option disabled selected value="">
                                                                    Chọn thời gian lấy hàng
                                                                </option>
                                                                {listPickShift && listPickShift.length > 0 ? (
                                                                    listPickShift.map((item, index) => (
                                                                        <option value={item.id} key={item.id}>
                                                                            {item.title}
                                                                        </option>
                                                                    ))
                                                                ) : (
                                                                    <></>
                                                                )}
                                                            </select>
                                                            {errors.pick_shift?.message && (
                                                                <p className="mt-2 text-danger">
                                                                    {errors.pick_shift?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <h3>Chưa có sản phẩm nào trong giỏ hàng.</h3>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        {dataOrder.order.orderCode ? (
                            <>
                                <Button type="submit" variant="info" onClick={() => printContent()}>
                                    In vận đơn
                                </Button>
                                {dataOrder.order.orderStatusId === 6 ? (
                                    <>
                                        {' '}
                                        <Button type="button" variant="danger" disabled>
                                            Đã hủy
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {' '}
                                        <Button type="submit" variant="danger" onClick={() => cancelOrder()}>
                                            Hủy đơn hàng
                                        </Button>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {' '}
                                <Button type="submit" variant="primary">
                                    Tạo mã vận đơn
                                </Button>
                            </>
                        )}

                        <Button type="button" variant="secondary" onClick={onClose}>
                            Hủy
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}

export default OrderDetailModal;
