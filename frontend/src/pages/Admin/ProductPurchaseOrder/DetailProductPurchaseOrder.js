import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useGetSupplierData, useUpdateSupplierData } from '~/hooks/react-query/supplierData';
import { ToastContainer, toast } from 'react-toastify';
import { useMatch, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateSupplier } from '~/services/admin/supplier.service';
import LoadingAdmin from '~/components/LoadingAdmin';
import { useGetProductPurchaseOrderData } from '~/hooks/react-query/productpurchaseorderData';
import moment from 'moment';
import 'moment/locale/vi';
function DetailProductPurchaseOrder() {
    const [errorsForm, setErrorsForm] = useState([]);
    const { id } = useParams();
    const { isLoading, data, isError, error } = useGetProductPurchaseOrderData(id);
    const productSampleIdCounts = {}; // Đối tượng để lưu trữ số lượng mỗi productSampleId

    // Hiển thị kết quả

    if (isLoading) {
        return <LoadingAdmin />;
    }
    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Phiếu nhập kho: {data.data.id}</h6>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                                    <thead>
                                        <tr className="bg bg-dark text-light">
                                            <th scope="col"> Người lập</th>
                                            <th scope="col">Nhà kho </th>
                                            <th scope="col">Địa chỉ kho </th>
                                            <th scope="col">Nhà cung cấp</th>
                                            <th scope="col">Địa chỉ nhà cung cấp</th>
                                            <th scope="col">Ngày lập</th>
                                            <th scope="col">Tổng tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{data.data.productPurchaseOrder.user.fullName}</td>
                                            <td>{data.data.productPurchaseOrder.wareHouse.name}</td>
                                            <td>{data.data.productPurchaseOrder.wareHouse.address}</td>
                                            <td>{data.data.productPurchaseOrder.supplier.name}</td>
                                            <td>{data.data.productPurchaseOrder.supplier.address}</td>
                                            <td>
                                                {moment(data.data.productPurchaseOrder.purchaseDate).format(
                                                    'DD/MM/YYYY HH:mm:ss',
                                                )}
                                            </td>
                                            <td>
                                                {' '}
                                                {String(data.data.productPurchaseOrder.total).replace(
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
                        <div className="row">
                            <div className="col-12">
                                <h5 className="m-0 font-weight-bold text-primary mb-3">Danh sách sản phẩm nhập</h5>

                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                                    <thead>
                                        <tr className="bg bg-dark text-light">
                                            <th scope="col">#</th>
                                            <th scope="col">Mã sản phẩm</th>
                                            <th scope="col">Tên mẫu sản phẩm </th>
                                            <th scope="col">Số lượng </th>
                                            <th scope="col">Giá nhập</th>
                                            <th scope="col">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.data.productPurchaseOrderDetails &&
                                        data.data.productPurchaseOrderDetails.length > 0 ? (
                                            data.data.productPurchaseOrderDetails.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td scope="row">{++index}</td>
                                                    <td>
                                                        {data.data.productPurchaseOrder.productPurchaseOrderDetails &&
                                                        data.data.productPurchaseOrder.productPurchaseOrderDetails
                                                            .length > 0 ? (
                                                            data.data.productPurchaseOrder.productPurchaseOrderDetails.map(
                                                                (itemm, indexx) => (
                                                                    // JSX code to render content for each item
                                                                    <div key={indexx}>
                                                                        {itemm.productSampleId === item.productSampleId
                                                                            ? itemm.id
                                                                            : ''}
                                                                    </div>
                                                                ),
                                                            )
                                                        ) : (
                                                            <div>
                                                                {/* Render content when productPurchaseOrderDetails is empty */}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td scope="row">{item.name}</td>
                                                    <td scope="row">{item.quantity}</td>
                                                    <td scope="row">
                                                        {' '}
                                                        {String(item.priceIn).replace(
                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                            '$1,',
                                                        )}
                                                        <sup>đ</sup>
                                                    </td>
                                                    <td>
                                                        {' '}
                                                        {String(item.priceIn * item.quantity).replace(
                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                            '$1,',
                                                        )}
                                                        <sup>đ</sup>
                                                    </td>
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
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </>
    );
}

export default DetailProductPurchaseOrder;
