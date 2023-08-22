import {
    useProductsData,
    useAddProductData,
    useDeleteProductData,
    useChangeStatusProductData,
} from '~/hooks/react-query/productData';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import InputSearch from '~/components/InputSearch';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { stringToSlug } from '~/helpers/covertString';
import { DateSchema } from 'yup';
import LoadingAdmin from '~/components/LoadingAdmin';
import { LINK_PRODUCT_IMAGE } from '~/helpers/constants';
import moment from 'moment';
import 'moment/locale/vi';
function ListProducts() {
    const pageSize = 5;
    const [listProducts, setListProducts] = useState([]);
    const { isLoading, data, isError, error } = useProductsData();
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
        if ((current - 1) * pageSize + 1 === listProducts.length) {
            const newPage = current - 1 > 0 ? current - 1 : 1;
            setCurrent(newPage);
            setMinIndex((newPage - 1) * pageSize);
            setMaxIndex(newPage * pageSize);
        }
    };
    const onSuccessChangeStatus = () => {
        toast.success('Đổi trạng thái thành công');
    };
    const { mutate: deleteProduct } = useDeleteProductData(onSuccess);
    const { mutate: changeStatusProduct } = useChangeStatusProductData(onSuccessChangeStatus);
    const handleChangePage = (page) => {
        setCurrent(page);
        setMinIndex((page - 1) * pageSize);
        setMaxIndex(page * pageSize);
    };
    useEffect(() => {
        if (data && data.data) {
            if (listProducts.length > 0) {
                setListProducts(data.data);
            } else {
                setListProducts(data.data);
                setTotalPage(data.data / pageSize);
                setMinIndex(0);
                setMaxIndex(pageSize);
            }
        }
    }, [data]);

    const handleChangeSearch = (inputSearch) => {
        setSearchText(inputSearch);
        if (inputSearch === '') return setListProducts(data.data);
        else {
            let newArray = data.data.filter((product) => {
                return stringToSlug(product.name).includes(stringToSlug(inputSearch));
            });

            setListProducts(newArray);
            handleChangePage(1);
        }
    };
    const handleDelete = async (id) => {
        deleteProduct(id);
    };
    const handleChangeStatus = async (id) => {
        changeStatusProduct(id);
    };
    if (isLoading) {
        return <LoadingAdmin />;
    }

    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Quản lý sản phẩm</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Link to="/admin-add-product" className="btn btn-success mb-3">
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
                                    <th scope="col">Id</th>
                                    <th scope="col">Tên sản phẩm</th>
                                    <th scope="col">Thư viện ảnh</th>
                                    <th width="40%" scope="col">
                                        Hình ảnh
                                    </th>
                                    <th scope="col">Nhà kho</th>
                                    <th scope="col">Thương hiệu</th>
                                    <th scope="col">Giá nhập</th>
                                    <th scope="col">Giá bán</th>
                                    <th scope="col">Ngày tạo</th>
                                    <th scope="col">Ngày cập nhật</th>
                                    <th scope="col" className="text-center" width="30%">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listProducts && listProducts.length > 0 ? (
                                    listProducts.map(
                                        (item, index) =>
                                            index >= minIndex &&
                                            index < maxIndex && (
                                                <tr key={item.id}>
                                                    <td scope="row">{++index}</td>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        <Link to={`/admin-photo-product-samples/${item.id}`}>
                                                            <i className="fas fa-photo-video"></i>
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <img
                                                            src={LINK_PRODUCT_IMAGE + item.image}
                                                            className="card-img"
                                                            style={{ width: '40%', height: '50%' }}
                                                            alt="..."
                                                        />
                                                    </td>

                                                    <td>{item.wareHouse?.name}</td>
                                                    <td>{item.brand?.name}</td>
                                                    <td>
                                                        {String(item.priceIn).replace(
                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                            '$1,',
                                                        )}
                                                        <sup>đ</sup>
                                                    </td>
                                                    <td>
                                                        {String(item.priceOut).replace(
                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                            '$1,',
                                                        )}
                                                        <sup>đ</sup>
                                                    </td>
                                                    <td>{moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                                                    <td>{moment(item.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</td>

                                                    <td className="text-center td-actions">
                                                        {item.disabled === true ? (
                                                            <button
                                                                className="btn btn-danger ml-2 mr-2"
                                                                onClick={() => handleChangeStatus(item.id)}
                                                            >
                                                                <i className="fas fa-toggle-off"></i>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-success ml-2 mr-2"
                                                                onClick={() => handleChangeStatus(item.id)}
                                                            >
                                                                <i className="fas fa-toggle-on"></i>
                                                            </button>
                                                        )}
                                                        <Link
                                                            to={`/admin-products/${item.id}`}
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
                                        <td className="text-center" colSpan="11">
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
                        total={listProducts.length}
                        onChange={handleChangePage}
                    />
                </div>
            </div>
        </>
    );
}

export default ListProducts;
