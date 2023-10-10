import {
    useOrdersData,
    useAddOrderData,
    useDeleteOrderData,
    useOrderStatusesData,
    useUpdateOrderStatusData,
    useGetOrderData,
} from '~/hooks/react-query/orderData';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import InputSearch from '~/components/InputSearch';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { stringToSlug } from '~/helpers/covertString';
import { DateSchema } from 'yup';
import LoadingAdmin from '~/components/LoadingAdmin';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import 'moment/locale/vi';
import Fuse from 'fuse.js';
import OrderDetailModal from '~/components/OrderDetailModal';

function ListOrders() {
    const classNameStatus = [
        '',
        'badge  badge-warning text-dark',
        'badge  badge-info text-light',
        'badge  badge-secondary text-light',
        'badge  badge-success text-light',
    ];
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [orderId, setOrderId] = useState();
    const pageSize = 5;
    const [listOrders, setListOrders] = useState([]);
    const { isLoading: isLoadingOrder, data: dataOrder } = useGetOrderData(orderId);
    const { isLoading, data, isError, error } = useOrdersData();
    const {
        isLoading: isLoadingOrderStatuses,
        data: dataOrderStatuses,
        isError: isErrorOrderStatuses,
        error: errorOrderStatuses,
    } = useOrderStatusesData();
    const [searchText, setSearchText] = useState('');
    const [totalPage, setTotalPage] = useState(0);
    const [current, setCurrent] = useState(1);
    const [minIndex, setMinIndex] = useState(0);
    const [maxIndex, setMaxIndex] = useState(0);
    const [value, setValue] = useState(0);
    const onSuccess = () => {
        toast.success('Xóa thành công');
        if (searchText !== '') {
            setSearchText('');
        }
        if ((current - 1) * pageSize + 1 === listOrders.length) {
            const newPage = current - 1 > 0 ? current - 1 : 1;
            setCurrent(newPage);
            setMinIndex((newPage - 1) * pageSize);
            setMaxIndex(newPage * pageSize);
        }
    };
    const onSuccessUpdateOrderStatus = (data) => {
        if (data.success) {
            toast.success('Cập nhật thành công');
        }
    };
    const { mutate: updateOrderStatus } = useUpdateOrderStatusData(onSuccessUpdateOrderStatus);
    const { mutate: deleteOrder } = useDeleteOrderData(onSuccess);

    const handleChangePage = (page) => {
        setCurrent(page);
        setMinIndex((page - 1) * pageSize);
        setMaxIndex(page * pageSize);
    };
    useEffect(() => {
        if (data && data.data) {
            if (listOrders.length > 0) {
                let array = data.data.filter((x) => x.orderStatusId === value + 1);
                if (searchText !== '') {
                    array = array.filter((order) => {
                        return stringToSlug(order.id.toString()).includes(stringToSlug(searchText));
                    });
                }
                setListOrders(array);
            } else {
                let array = data.data.filter((x) => x.orderStatusId === value + 1);
                setListOrders(array);
                setTotalPage(array / pageSize);
                setMinIndex(0);
                setMaxIndex(pageSize);
            }
        }
    }, [data, value, searchText]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleChangeSearch = (inputSearch) => {
        setSearchText(inputSearch);
    };
    const handleDelete = async (id) => {
        deleteOrder(id);
    };
    const onChangeStatus = async (e, orderId) => {
        updateOrderStatus({
            orderStatusId: parseInt(e.target.value),
            orderId: orderId,
        });
    };
    const handleGetOrderById = async (id) => {
        setOrderId(id);
        handleShow();
    };
    const handleCreateOrderForDelivery = async () => {
        setValue(1);
        setShow(false);
    };
    if (isLoading || isLoadingOrderStatuses) {
        return <LoadingAdmin />;
    }

    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Quản lý đơn hàng</h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12">
                            <InputSearch
                                onSearch={handleChangeSearch}
                                onSetSearchText={setSearchText}
                                searchText={searchText}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12">
                            <Tabs value={value} onChange={handleChange} centered>
                                <Tab
                                    label={`Chờ xác nhận (${
                                        data?.data.filter((item) => item.orderStatusId === 1).length
                                    })`}
                                />
                                <Tab
                                    label={`Đã xác nhận (${
                                        data?.data.filter((item) => item.orderStatusId === 2).length
                                    })`}
                                />
                                <Tab
                                    label={`Đã giao cho vận chuyển (${
                                        data?.data.filter((item) => item.orderStatusId === 3).length
                                    })`}
                                />
                                <Tab
                                    label={`Hoàn tất (${data?.data.filter((item) => item.orderStatusId === 4).length})`}
                                />
                                <Tab
                                    label={`Yêu cầu hủy đơn hàng (${
                                        data?.data.filter((item) => item.orderStatusId === 5).length
                                    })`}
                                />
                                <Tab
                                    label={`Đã hủy (${data?.data.filter((item) => item.orderStatusId === 6).length})`}
                                />
                            </Tabs>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                            <thead>
                                <tr className="bg bg-dark text-light">
                                    <th scope="col">#</th>
                                    <th scope="col">Id</th>
                                    <th scope="col">Người nhận</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Số điện thoại</th>
                                    <th scope="col">Tổng tiền</th>
                                    <th scope="col" width="20%">
                                        Trạng thái
                                    </th>
                                    <th scope="col">Ngày tạo</th>
                                    <th scope="col">Ngày cập nhật</th>
                                    <th scope="col" className="text-center" width="10%">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataOrder && (
                                    <OrderDetailModal
                                        show={show}
                                        onClose={handleClose}
                                        onCreateOrderForDelivery={handleCreateOrderForDelivery}
                                        dataOrder={dataOrder.data}
                                    />
                                )}
                                {listOrders && listOrders.length > 0 ? (
                                    listOrders.map(
                                        (item, index) =>
                                            index >= minIndex &&
                                            index < maxIndex && (
                                                <tr key={item.id}>
                                                    <td scope="row">{++index}</td>
                                                    <td scope="row">{item.id}</td>
                                                    <td scope="row">{item.recipient.fullName}</td>
                                                    <td scope="row">{item.recipient.email}</td>
                                                    <td scope="row">{item.recipient.phoneNumber}</td>
                                                    <td>
                                                        {String(item.total).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                                        <sup>đ</sup>
                                                    </td>
                                                    <td className="text-center">
                                                        <Form.Control
                                                            as="select"
                                                            value={item.orderStatus.id}
                                                            onChange={(e) => onChangeStatus(e, item.id)}
                                                        >
                                                            {dataOrderStatuses.data.slice(0, 6).map((status, index) => (
                                                                <option
                                                                    value={status.id}
                                                                    key={status.id}
                                                                    className="text-dark bg bg-light"
                                                                >
                                                                    {status.name}
                                                                </option>
                                                            ))}
                                                        </Form.Control>

                                                        {value === 0 ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-primary mt-2"
                                                                    onClick={() => handleGetOrderById(item.id)}
                                                                >
                                                                    Tạo mã vận đơn
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <></>
                                                        )}

                                                        {value === 1 ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-success mt-2"
                                                                    onClick={() => handleGetOrderById(item.id)}
                                                                >
                                                                    {item.orderCode}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <></>
                                                        )}
                                                        {value === 4 && item.orderCode !== null ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-success mt-2"
                                                                    onClick={() => handleGetOrderById(item.id)}
                                                                >
                                                                    {item.orderCode}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <></>
                                                        )}
                                                        {value === 5 && item.orderCode !== null ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-success mt-2"
                                                                    onClick={() => handleGetOrderById(item.id)}
                                                                >
                                                                    {item.orderCode}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </td>
                                                    <td>{moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                                                    <td>{moment(item.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                                                    <td className="text-center td-actions">
                                                        <Link
                                                            to={`/detail-order/${item.id}`}
                                                            className="btn btn-primary"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </Link>
                                                        <button
                                                            className="btn btn-danger ml-2"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ),
                                    )
                                ) : (
                                    <tr>
                                        <td className="text-center" colSpan="10">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mb-5  d-flex justify-content-end mr-3">
                    <Pagination
                        pageSize={pageSize}
                        current={current}
                        total={listOrders.length}
                        onChange={handleChangePage}
                    />
                </div>
            </div>
        </>
    );
}

export default ListOrders;
