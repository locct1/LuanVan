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
import { useProductPurchaseOrderData } from '~/hooks/react-query/productpurchaseorderData';
import { useProductSamplesData } from '~/hooks/react-query/productsampleData';
import { useWareHousesData } from '~/hooks/react-query/warehouseData';
function ListProductInventories() {
    const pageSize = 10;
    const [listProducts, setListProducts] = useState([]);
    const { isLoading, data, isError, error } = useProductSamplesData();
    const { isLoading: isLoadingWareHouses, data: dataWareHouses } = useWareHousesData();
    const [searchText, setSearchText] = useState('');
    const [totalPage, setTotalPage] = useState(0);
    const [current, setCurrent] = useState(1);
    const [minIndex, setMinIndex] = useState(0);
    const [maxIndex, setMaxIndex] = useState(0);
    const [inputQuantity, setInputQuantity] = useState('');
    const [selectStatus, setSelectStatus] = useState('');
    const [selectWareHouse, setSelectWareHouse] = useState('');
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
                return stringToSlug(product.product.name + ' (' + product.colorProduct?.name + ')').includes(
                    stringToSlug(inputSearch),
                );
            });

            setListProducts(newArray);
            handleChangePage(1);
        }
    };
    const handleDelete = async (id) => {
        deleteProduct(id);
    };

    const handleChangeQuantityProduct = async (e) => {
        let { name, value } = e.target;
        let list = data.data;
        console.log(name);
        console.log(value);
        if (name === 'statusQuantityProduct') {
            setSelectStatus(value);
            if (inputQuantity !== '') {
                list = data.data.filter((product) => product.quantity <= parseInt(inputQuantity));
            }
            if (selectWareHouse !== '') {
                list = list.filter((product) => product.product.wareHouse.id === parseInt(selectWareHouse));
            }
            if (value === '1') {
                list = list.filter((product) => product.quantity > 10);
                setListProducts(list);
            }
            if (value === '2') {
                list = list.filter((product) => product.quantity <= 10 && product.quantity !== 0);
                setListProducts(list);
            }
            if (value === '3') {
                list = list.filter((product) => product.quantity === 0);
            }
        }
        if (name === 'number') {
            setInputQuantity(value);
            if (value !== '') {
                list = list.filter((product) => product.quantity <= parseInt(value));
            }
            if (selectWareHouse !== '') {
                list = list.filter((product) => product.product.wareHouse.id === parseInt(selectWareHouse));
            }
            if (selectStatus === '1') {
                list = list.filter((product) => product.quantity > 10);
                setListProducts(list);
            }
            if (selectStatus === '2') {
                list = list.filter((product) => product.quantity <= 10 && product.quantity !== 0);
                setListProducts(list);
            }
            if (selectStatus === '3') {
                list = list.filter((product) => product.quantity === 0);
            }
        }
        if (name === 'wareHouseId') {
            setSelectWareHouse(value);
            if (value !== '') {
                list = list.filter((product) => product.product.wareHouse.id === parseInt(value));
            }
            console.log(list);
            if (inputQuantity !== '') {
                list = list.filter((product) => product.quantity <= parseInt(inputQuantity));
            }
            if (selectStatus === '1') {
                list = list.filter((product) => product.quantity > 10);
                setListProducts(list);
            }
            if (selectStatus === '2') {
                list = list.filter((product) => product.quantity <= 10 && product.quantity !== 0);
                setListProducts(list);
            }
            if (selectStatus === '3') {
                list = list.filter((product) => product.quantity === 0);
            }
        }
        setListProducts(list);
    };
    if (isLoading || isLoadingWareHouses) {
        return <LoadingAdmin />;
    }
    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Danh sách tồn kho</h6>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-6">
                            <form>
                                <div className="form-group row">
                                    <label htmlFor="inputPassword" className="col-sm-4 col-form-label font-weight-bold">
                                        Tình trạng
                                    </label>
                                    <div className="col-sm-8">
                                        <select
                                            class="form-control"
                                            name="statusQuantityProduct"
                                            onChange={(e) => handleChangeQuantityProduct(e)}
                                        >
                                            <option selected value="">
                                                Chọn tình trạng mẫu sản phẩm
                                            </option>
                                            <option value="1">Còn hàng (&gt;10)</option>
                                            <option value="2">Sắp hết hàng (&lt;=10)</option>
                                            <option value="3">Hết hàng (0)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="inputPassword" className="col-sm-4 col-form-label font-weight-bold">
                                        Mức ngưỡng sản phẩm tồn kho
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="number"
                                            name="number"
                                            className="form-control"
                                            placeholder="Nhập sô lượng sản phẩm"
                                            value={inputQuantity}
                                            min={0}
                                            onChange={(e) => handleChangeQuantityProduct(e)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="inputPassword" className="col-sm-4 col-form-label font-weight-bold">
                                        Nhà kho:
                                    </label>
                                    <div className="col-sm-8">
                                        <select
                                            class="form-control"
                                            name="wareHouseId"
                                            value={selectWareHouse}
                                            onChange={(e) => handleChangeQuantityProduct(e)}
                                        >
                                            <option selected value="">
                                                Chọn nhà kho
                                            </option>
                                            {dataWareHouses.data.reverse()?.map((warehouse, index) => (
                                                <option value={warehouse.id} key={warehouse.id}>
                                                    {warehouse.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
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
                                    <th scope="col"> Tên mẫu sản phẩm</th>
                                    <th scope="col">Nhà kho</th>
                                    <th scope="col">Số lượng</th>
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
                                                    <td>
                                                        {item.product?.name} ({item.colorProduct?.name})
                                                    </td>
                                                    <td>{item.product?.wareHouse?.name}</td>
                                                    <td>{item.quantity}</td>
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

export default ListProductInventories;
