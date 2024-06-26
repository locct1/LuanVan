import { useSuppliersData, useAddSupplierData, useDeleteSupplierData } from '~/hooks/react-query/supplierData';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import InputSearch from '~/components/InputSearch';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { stringToSlug } from '~/helpers/covertString';
import { DateSchema } from 'yup';
import LoadingAdmin from '~/components/LoadingAdmin';
function ListSuppliers() {
    const pageSize = 5;
    const [listSuppliers, setListSuppliers] = useState([]);
    const { isLoading, data, isError, error } = useSuppliersData();
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
        if ((current - 1) * pageSize + 1 === listSuppliers.length) {
            const newPage = current - 1 > 0 ? current - 1 : 1;
            setCurrent(newPage);
            setMinIndex((newPage - 1) * pageSize);
            setMaxIndex(newPage * pageSize);
        }
    };
    const { mutate: deleteSupplier } = useDeleteSupplierData(onSuccess);
    const handleChangePage = (page) => {
        setCurrent(page);
        setMinIndex((page - 1) * pageSize);
        setMaxIndex(page * pageSize);
    };
    useEffect(() => {
        if (data && data.data) {
            if (listSuppliers.length > 0) {
                setListSuppliers(data.data);
            } else {
                setListSuppliers(data.data);
                setTotalPage(data.data / pageSize);
                setMinIndex(0);
                setMaxIndex(pageSize);
            }
        }
    }, [data]);

    const handleChangeSearch = (inputSearch) => {
        setSearchText(inputSearch);
        if (inputSearch === '') return setListSuppliers(data.data);
        else {
            let newArray = data.data.filter((supplier) => {
                return stringToSlug(supplier.name).includes(stringToSlug(inputSearch));
            });

            setListSuppliers(newArray);
            handleChangePage(1);
        }
    };
    const handleDelete = async (id) => {
        deleteSupplier(id);
    };
    if (isLoading) {
        return <LoadingAdmin />;
    }

    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Quản lý nhà cung cấp</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Link to="/admin-add-supplier" className="btn btn-success mb-3">
                            <i className="fas fa-plus"></i>
                        </Link>
                        <InputSearch
                            onSearch={handleChangeSearch}
                            onSetSearchText={setSearchText}
                            searchText={searchText}
                        />

                        <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Id</th>
                                    <th scope="col">Tên nhà cung cấp</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">Số điện thoại</th>
                                    <th scope="col">Email</th>
                                    <th  scope="col" className="text-center" width="10%">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listSuppliers && listSuppliers.length > 0 ? (
                                    listSuppliers.map(
                                        (item, index) =>
                                            index >= minIndex &&
                                            index < maxIndex && (
                                                <tr key={item.id}>
                                                    <td scope="row">{++index}</td>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.address}</td>
                                                    <td>{item.phoneNumber}</td>
                                                    <td>{item.email}</td>
                                                    <td className="text-center td-actions">
                                                        <Link
                                                            to={`/admin-suppliers/${item.id}`}
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
                                        <td className="text-center" colSpan="7">
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
                        total={listSuppliers.length}
                        onChange={handleChangePage}
                    />
                </div>
            </div>
        </>
    );
}

export default ListSuppliers;
