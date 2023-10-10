import {
    useReviewProductsData,
    useAddReviewProductData,
    useDeleteReviewProductData,
} from '~/hooks/react-query/reviewproduct.Data';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import InputSearch from '~/components/InputSearch';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { stringToSlug } from '~/helpers/covertString';
import { DateSchema } from 'yup';
import LoadingAdmin from '~/components/LoadingAdmin';
import { FaStar } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/vi';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FeedBackReviewProductModal from '~/components/FeedBackReviewProductModal';
function ListReviewProducts() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const pageSize = 5;
    const [listReviewProducts, setListReviewProducts] = useState([]);
    const { isLoading, data, isError, error } = useReviewProductsData();
    const [searchText, setSearchText] = useState('');
    const [totalPage, setTotalPage] = useState(0);
    const [current, setCurrent] = useState(1);
    const [minIndex, setMinIndex] = useState(0);
    const [maxIndex, setMaxIndex] = useState(0);
    const [reviewProduct, setReviewProduct] = useState();
    const onSuccess = () => {
        toast.success('Xóa thành công');
        if (searchText !== '') {
            setSearchText('');
        }
        if ((current - 1) * pageSize + 1 === listReviewProducts.length) {
            const newPage = current - 1 > 0 ? current - 1 : 1;
            setCurrent(newPage);
            setMinIndex((newPage - 1) * pageSize);
            setMaxIndex(newPage * pageSize);
        }
    };
    const { mutate: deleteReviewProduct } = useDeleteReviewProductData(onSuccess);
    const handleChangePage = (page) => {
        setCurrent(page);
        setMinIndex((page - 1) * pageSize);
        setMaxIndex(page * pageSize);
    };
    const handleGetReviewProduct = (reviewProduct) => {
        setReviewProduct(reviewProduct);
        handleShow();
    };
    useEffect(() => {
        if (data && data.data) {
            if (listReviewProducts.length > 0) {
                setListReviewProducts(data.data);
            } else {
                setListReviewProducts(data.data);
                setTotalPage(data.data / pageSize);
                setMinIndex(0);
                setMaxIndex(pageSize);
            }
        }
    }, [data]);
    useEffect(() => {
        if (data && data.data && reviewProduct) {
            let findReviewProduct = data.data.find((x) => x.id === reviewProduct.id);
            setReviewProduct(findReviewProduct);
        }
    }, [data]);
    const handleChangeSearch = (inputSearch) => {
        setSearchText(inputSearch);
        if (inputSearch === '') return setListReviewProducts(data.data);
        else {
            let newArray = data.data.filter((colorproduct) => {
                return stringToSlug(colorproduct.name).includes(stringToSlug(inputSearch));
            });

            setListReviewProducts(newArray);
            handleChangePage(1);
        }
    };
    const handleDelete = async (id) => {
        deleteReviewProduct(id);
    };
    if (isLoading) {
        return <LoadingAdmin />;
    }

    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Quản lý bình luận</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Link to="/admin-add-colorproduct" className="btn btn-success mb-3">
                            <i className="fas fa-plus"></i>
                        </Link>
                        <InputSearch
                            onSearch={handleChangeSearch}
                            onSetSearchText={setSearchText}
                            searchText={searchText}
                        />

                        <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                            <thead>
                                <tr className="bg bg-dark text-light">
                                    <th scope="col">#</th>
                                    <th scope="col">Tên khách hàng</th>
                                    <th scope="col">Sản phẩm</th>
                                    <th scope="col">Sao</th>
                                    <th scope="col">Nội dung</th>
                                    <th scope="col">Phản hồi</th>
                                    <th scope="col">Ngày tạo</th>
                                    <th scope="col" className="text-center" width="10%">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviewProduct && (
                                    <FeedBackReviewProductModal
                                        show={show}
                                        onClose={handleClose}
                                        reviewProduct={reviewProduct}
                                    />
                                )}
                                {listReviewProducts && listReviewProducts.length > 0 ? (
                                    listReviewProducts.map(
                                        (item, index) =>
                                            index >= minIndex &&
                                            index < maxIndex && (
                                                <tr key={item.id}>
                                                    <td scope="row">{++index}</td>
                                                    <td>{item.user.fullName}</td>
                                                    <td>{item.product.name}</td>
                                                    <td>
                                                        {' '}
                                                        {[...Array(item.rating)].map((star, index) => (
                                                            <FaStar
                                                                className="mr-1"
                                                                key={index}
                                                                size={15}
                                                                color={'#ffc107'}
                                                            />
                                                        ))}
                                                    </td>
                                                    <td>
                                                        {item.commentContent} <br></br>{' '}
                                                        <span
                                                            className="text-primary"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleGetReviewProduct(item)}
                                                        >
                                                            Trả lời
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {item.feedbackReviewProducts ? (
                                                            item.feedbackReviewProducts.map((item, index) => (
                                                                <>{item.feedBackContent}</>
                                                            ))
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </td>
                                                    <td>{moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>

                                                    <td className="text-center td-actions">
                                                        <Link
                                                            to={`/admin-colorproducts/${item.id}`}
                                                            className="btn btn-primary"
                                                        >
                                                            <i className="fas fa-edit"></i>
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
                        total={listReviewProducts.length}
                        onChange={handleChangePage}
                    />
                </div>
            </div>
        </>
    );
}

export default ListReviewProducts;
