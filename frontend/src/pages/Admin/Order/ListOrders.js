import {
    useOrdersData,
    useAddOrderData,
    useDeleteOrderData,
    useOrderStatusesData,
    useUpdateOrderStatusData,
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

import 'moment/locale/vi';
function ListOrders() {
    const pageSize = 5;
    const [listOrders, setListOrders] = useState([]);
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
    const { mutate: deleteOrder } = useDeleteOrderData(onSuccess);
    const { mutate: updateOrderStatus } = useUpdateOrderStatusData(onSuccessUpdateOrderStatus);
    
    const handleChangePage = (page) => {
        setCurrent(page);
        setMinIndex((page - 1) * pageSize);
        setMaxIndex(page * pageSize);
    };
    useEffect(() => {
        if (data && data.data) {
            if (listOrders.length > 0) {
                setListOrders(data.data);
            } else {
                setListOrders(data.data);
                setTotalPage(data.data / pageSize);
                setMinIndex(0);
                setMaxIndex(pageSize);
            }
        }
    }, [data]);

    const handleChangeSearch = (inputSearch) => {
        setSearchText(inputSearch);
        if (inputSearch === '') return setListOrders(data.data);
        else {
            let newArray = data.data.filter((colorproduct) => {
                return stringToSlug(colorproduct.name).includes(stringToSlug(inputSearch));
            });

            setListOrders(newArray);
            handleChangePage(1);
        }
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
                    <div className="table-responsive">
                        <InputSearch
                            onSearch={handleChangeSearch}
                            onSetSearchText={setSearchText}
                            searchText={searchText}
                        />

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
                                                    <td>
                                                        <Form.Control
                                                            as="select"
                                                            value={item.orderStatus.id}
                                                            onChange={(e) => onChangeStatus(e, item.id)}
                                                        >
                                                            {dataOrderStatuses.data.slice(0, 4).map((status, index) => (
                                                                <option
                                                                    value={status.id}
                                                                    key={status.id}
                                                                    className="text-dark bg bg-light"
                                                                >
                                                                    {status.name}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
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
                                        <td className="text-center" colSpan="5">
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
