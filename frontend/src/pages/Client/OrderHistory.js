import { Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '~/components/Client/ProductCard';
import { LINK_PRODUCT_IMAGE, LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE } from '~/helpers/constants';
import { stringToSlug } from '~/helpers/covertString';
import {
    useGetOrderClientData,
    useOrdersClientData,
    usePaymentMethodsClientData,
    useProductByIdClientData,
    useProductsClientData,
} from '~/hooks/react-query/client/pageData';
import CartSlice from '~/redux/Slices/CartSlice';
import { infoCart, infoClientSelector } from '~/redux/selectors';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ClientLoadUser } from '~/redux/Slices/ClientAuthSlice';
import { callAPIGetDistrict, callAPIGetProvince, callAPIGetWard } from '~/services/client/getaddress.service';
import { UpdateInfoClientService } from '~/services/client/clientAuth.service';
import { usePaymentMethodsData } from '~/hooks/react-query/paymentmethodData';
import { createOrderClient } from '~/services/client/page.service';
import moment from 'moment';
import 'moment/locale/vi';
import LoadingAdmin from '~/components/LoadingAdmin';
import { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import InputSearch from '~/components/InputSearch';
import { useOrdersData } from '~/hooks/react-query/orderData';
import OrderDetailClientModal from '~/components/Client/OrderDetailClientModal';
function OrderHistory() {
    const classNameStatus = [
        '',
        'badge  badge-warning text-dark',
        'badge  badge-info text-light',
        'badge  badge-secondary text-light',
        'badge  badge-success text-light',
    ];
    const pageSize = 5;
    const [listOrders, setListOrders] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [totalPage, setTotalPage] = useState(0);
    const [current, setCurrent] = useState(1);
    const [minIndex, setMinIndex] = useState(0);
    const [maxIndex, setMaxIndex] = useState(0);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [orderId, setOrderId] = useState();
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
    const { isLoading, data, isError, error } = useOrdersClientData();
    const { isLoading: isLoadingOrder, data: dataOrder, refetch: refreshOrder } = useGetOrderClientData(orderId);
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
    const handleChangePage = (page) => {
        setCurrent(page);
        setMinIndex((page - 1) * pageSize);
        setMaxIndex(page * pageSize);
    };
    const handleChangeSearch = (inputSearch) => {
        setSearchText(inputSearch);
        if (inputSearch === '') return setListOrders(data.data);
        else {
            let newArray = data.data.filter((order) => {
                return stringToSlug(order.id.toString()).includes(stringToSlug(inputSearch));
            });

            setListOrders(newArray);
            handleChangePage(1);
        }
    };
    const handleGetOrderById = async (id) => {
        setOrderId(id);
        handleShow();
    };
    if (isLoading) {
        return <LoadingAdmin />;
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
                                    <span>Lịch sử đơn hàng</span>
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
                                <h2>Lịch sử đơn hàng </h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
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
                                            <th scope="col">Mã đơn hàng</th>
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
                                            <OrderDetailClientModal
                                                show={show}
                                                onClose={handleClose}
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
                                                            <td>
                                                                {String(item.total).replace(
                                                                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                    '$1,',
                                                                )}
                                                                <sup>đ</sup>
                                                            </td>
                                                            <td>
                                                                {' '}
                                                                {
                                                                    <span
                                                                        className={classNameStatus[item.orderStatusId]}
                                                                    >
                                                                        {item.orderStatus.name}
                                                                    </span>
                                                                }
                                                            </td>
                                                            <td>
                                                                {moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                                            </td>
                                                            <td>
                                                                {moment(item.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                                                            </td>
                                                            <td className="text-center td-actions">
                                                                <button
                                                                    className="btn btn-primary ml-2"
                                                                    onClick={() => handleGetOrderById(item.id)}
                                                                >
                                                                    <i className="fas fa-eye"></i>
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
            </section>
        </>
    );
}

export default OrderHistory;
