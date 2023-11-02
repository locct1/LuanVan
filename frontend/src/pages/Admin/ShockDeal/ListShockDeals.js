import {
    useShockDealsData,
    useAddShockDealData,
    useDeleteShockDealData,
    useChangeStatusShockDealData,
} from '~/hooks/react-query/shockdealData';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import InputSearch from '~/components/InputSearch';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { stringToSlug } from '~/helpers/covertString';
import { DateSchema } from 'yup';
import LoadingAdmin from '~/components/LoadingAdmin';
import moment from 'moment';
import 'moment/locale/vi';
function ListShockDeals() {
    const pageSize = 5;
    const [listShockDeals, setListShockDeals] = useState([]);
    const { isLoading, data, isError, error } = useShockDealsData();
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
        if ((current - 1) * pageSize + 1 === listShockDeals.length) {
            const newPage = current - 1 > 0 ? current - 1 : 1;
            setCurrent(newPage);
            setMinIndex((newPage - 1) * pageSize);
            setMaxIndex(newPage * pageSize);
        }
    };
    const { mutate: deleteShockDeal } = useDeleteShockDealData(onSuccess);
    const handleChangePage = (page) => {
        setCurrent(page);
        setMinIndex((page - 1) * pageSize);
        setMaxIndex(page * pageSize);
    };
    useEffect(() => {
        if (data && data.data) {
            if (listShockDeals.length > 0) {
                setListShockDeals(data.data);
            } else {
                setListShockDeals(data.data);
                setTotalPage(data.data / pageSize);
                setMinIndex(0);
                setMaxIndex(pageSize);
            }
        }
    }, [data]);
    const onSuccessChangeStatus = () => {
        toast.success('Đổi trạng thái thành công');
    };
    const { mutate: changeStatusShockDeal } = useChangeStatusShockDealData(onSuccessChangeStatus);

    const handleChangeSearch = (inputSearch) => {
        setSearchText(inputSearch);
        if (inputSearch === '') return setListShockDeals(data.data);
        else {
            let newArray = data.data.filter((promotionProduct) => {
                return stringToSlug(promotionProduct.name).includes(stringToSlug(inputSearch));
            });

            setListShockDeals(newArray);
            handleChangePage(1);
        }
    };
    const handleDelete = async (id) => {
        deleteShockDeal(id);
    };
    const handleChangeStatus = async (id) => {
        changeStatusShockDeal(id);
    };
    if (isLoading) {
        return <LoadingAdmin />;
    }

    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Quản lý Deal sốc</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Link to="/admin-add-shock-deal" className="btn btn-success mb-3">
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
                                    <th scope="col">Tên Deal sốc</th>
                                    <th scope="col">Ngày bắt đầu</th>
                                    <th scope="col">Ngày kết thúc</th>
                                    <th scope="col" className="text-center" width="20%">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listShockDeals && listShockDeals.length > 0 ? (
                                    listShockDeals.map(
                                        (item, index) =>
                                            index >= minIndex &&
                                            index < maxIndex && (
                                                <tr key={item.id}>
                                                    <td scope="row">{++index}</td>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{moment(item.startDate).format('DD/MM/YYYY HH:mm:ss')}</td>
                                                    <td>{moment(item.endDate).format('DD/MM/YYYY HH:mm:ss')}</td>

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
                                                            to={`/admin-shock-deals/${item.id}`}
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
                        total={listShockDeals.length}
                        onChange={handleChangePage}
                    />
                </div>
            </div>
        </>
    );
}

export default ListShockDeals;
