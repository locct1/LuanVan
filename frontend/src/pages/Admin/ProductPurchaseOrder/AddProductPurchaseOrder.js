import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAddRoleData } from '~/hooks/react-query/roleData';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { infoAdminSelector } from '~/redux/selectors';
import { useWareHousesData } from '~/hooks/react-query/warehouseData';
import { useSuppliersData } from '~/hooks/react-query/supplierData';
import LoadingAdmin from '~/components/LoadingAdmin';
import {
    useAddProductPurchaseOrderData,
    useGetAllProductByWareHouseData,
} from '~/hooks/react-query/productpurchaseorderData';
import { forEach } from '~/assets/admin/vendor/fontawesome-free/js/v4-shims';
function AddProductPurchaseOrder() {
    const dispatch = useDispatch();
    const [listProducts, setListProducts] = useState([]);
    const [listProductSamples, setListProductSamples] = useState([]);
    const [listProductPurchaseOrders, setListProductPurchaseOrders] = useState([
        {
            productId: '',
            productSampleId: '',
            priceIn: null,
            otherPriceIn: null,
            formatOtherPriceIn: null,
            showInputOtherPriceIn: false,
            quantity: 1,
            productSamples: [],
        },
    ]);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState();
    const infoAdmin = useSelector(infoAdminSelector);
    const schema = yup
        .object()
        .shape({
            warehouseId: yup.number().typeError('Vui lòng chọn nhà kho').required('Vui lòng chọn nhà kho'),
            supplierId: yup.number().typeError('Vui lòng chọn nhà cung cấp').required('Vui lòng chọn nhà cung cấp'),
        })
        .required();
    const {
        register,
        resetField,
        handleSubmit,
        clearErrors,
        setValue,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });
    const [errorsForm, setErrorsForm] = useState([]);
    const onSuccess = (data) => {
        if (data.success) {
            resetField('warehouseId');
            resetField('supplierId');
            setSelectedWarehouseId('');
            setListProductPurchaseOrders([
                {
                    productId: '',
                    productSampleId: '',
                    priceIn: null,
                    otherPriceIn: null,
                    formatOtherPriceIn: null,
                    quantity: 1,
                },
            ]);
            toast.success('Tạo thành công');
        } else {
            setErrorsForm(data.errors);
        }
    };

    const { mutate: addProductPurchaseOrder } = useAddProductPurchaseOrderData(onSuccess);
    const { isLoading: isLoadingWareHouses, data: dataWareHouses } = useWareHousesData();
    const { isLoading: isLoadingSuppliers, data: dataSuppliers } = useSuppliersData();
    const {
        isLoading: isLoadingProductByWareHouse,
        data: dataProductByWareHouse,
        refetch: refetchProductByWareHouse,
    } = useGetAllProductByWareHouseData(selectedWarehouseId);
    const handleChangeWarehouse = (e) => {
        clearErrors('warehouseId');
        setSelectedWarehouseId(e.target.value);
        setValue('warehouseId', e.target.value);
        if (listProductPurchaseOrders && listProductPurchaseOrders[0].productId !== '') {
            setListProductPurchaseOrders([
                {
                    productId: '',
                    productSampleId: '',
                    priceIn: null,
                    otherPriceIn: null,
                    formatOtherPriceIn: null,
                    quantity: 1,
                },
            ]);
        }
    };
    useEffect(() => {
        if (dataProductByWareHouse) {
            setListProducts(dataProductByWareHouse.data);
        }
    }, [dataProductByWareHouse]);
    const onSubmit = async (data) => {
        let check = true;
        listProductPurchaseOrders.forEach((order, index) => {
            if (order.productId === '' || order.productSampleId === '') {
                check = false;
            }
        });
        if (check === false) {
            toast.warning('Danh sách nhập không hợp lệ.');
            return;
        }
        const updatedListProductPurchaseOrders = listProductPurchaseOrders.map((order) => {
            const { productSamples, ...orderWithoutSamples } = order;
            const updatedOrder = {
                ...orderWithoutSamples,
                productId: parseInt(order.productId),
                productSampleId: parseInt(order.productSampleId),
                quantity: parseInt(order.quantity),
                otherPriceIn: parseInt(order.otherPriceIn) || 0,
                priceIn: (parseInt(order.otherPriceIn) || 0) !== 0 ? parseInt(order.otherPriceIn) : order.priceIn,
            };

            return updatedOrder;
        });
        let totalPrice = 0;
        updatedListProductPurchaseOrders.forEach((order) => {
            totalPrice +=
                order.otherPriceIn === 0 ? order.priceIn * order.quantity : order.otherPriceIn * order.quantity;
        });
        console.log(totalPrice);
        let createProductPurchaseOrder = {
            warehouseId: data.warehouseId,
            supplierId: data.supplierId,
            listProductPurchaseOrders: updatedListProductPurchaseOrders,
            total: totalPrice,
        };
        console.log(createProductPurchaseOrder);
        addProductPurchaseOrder(createProductPurchaseOrder);
    };
    const formatPrice = (value) => {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    const handleShowInputOtherPriceIn = (index) => {
        const list = [...listProductPurchaseOrders];
        console.log(index);
        list[index]['showInputOtherPriceIn'] = true;
        setListProductPurchaseOrders(list);
    };
    const handleStepChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...listProductPurchaseOrders];
        if (name === 'productSampleId') {
            const foundOrder = listProductPurchaseOrders.find((order) => order.productSampleId === value.toString());
            if (foundOrder) {
                toast.warning('Đã có trong danh sách nhập');
                return;
            }
        }
        if (name === 'productId') {
            let product = listProducts.find((x) => x.id === parseInt(value, 10));
            if (product) {
                list[index]['productSamples'] = product.productSamples;
                list[index]['priceIn'] = product.priceIn;
                list[index]['productSampleId'] = '';
                list[index]['quantity'] = 1;
            }
        }

        if (name === 'otherPriceIn') {
            const rawValue = e.target.value.replace(/,/g, '');
            if (rawValue === '') {
                list[index]['formatOtherPriceIn'] = null;
                list[index]['otherPriceIn'] = null;
            } else {
                const formattedValue = formatPrice(rawValue);
                list[index]['formatOtherPriceIn'] = formattedValue;
                list[index]['otherPriceIn'] = rawValue;
            }
        } else {
            list[index][name] = value;
        }
        setListProductPurchaseOrders(list);
    };
    const handleStepRemove = (index) => {
        const list = [...listProductPurchaseOrders];
        list.splice(index, 1);
        setListProductPurchaseOrders(list);
    };

    const handleStepAdd = () => {
        setListProductPurchaseOrders([
            ...listProductPurchaseOrders,
            {
                productId: '',
                productSampleId: '',
                priceIn: null,
                otherPriceIn: null,
                formatOtherPriceIn: null,
                quantity: 1,
            },
        ]);
    };
    if (isLoadingSuppliers || isLoadingWareHouses || isLoadingProductByWareHouse) {
        return <LoadingAdmin />;
    }
    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Thêm phiếu nhập kho</h6>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <div className="col-6">
                                    {errorsForm && errorsForm.length > 0 && (
                                        <>
                                            {errorsForm.map((error, index) => (
                                                <p className="text-danger" key={index}>
                                                    {error}
                                                </p>
                                            ))}
                                        </>
                                    )}
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Tên người lập:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="Nhập tên vai trò"
                                            value={infoAdmin?.fullName}
                                            disabled={true}
                                        />
                                        {errors.name?.message && (
                                            <p className="mt-2 text-danger">{errors.name?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Nhà kho:
                                        </label>
                                        <select
                                            class="form-control"
                                            name="warehouseId"
                                            value={selectedWarehouseId}
                                            onChange={handleChangeWarehouse}
                                        >
                                            <option disabled selected value="">
                                                Chọn nhà kho
                                            </option>
                                            {dataWareHouses.data?.map((warehouse, index) => (
                                                <option value={warehouse.id} key={warehouse.id}>
                                                    {warehouse.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.warehouseId?.message && (
                                            <p className="mt-2 text-danger">{errors.warehouseId?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Nhà cung cấp:
                                        </label>
                                        <select class="form-control" name="supplierId" {...register('supplierId')}>
                                            <option disabled selected value="">
                                                Chọn nhà cung cấp
                                            </option>
                                            {dataSuppliers.data?.map((supplier, index) => (
                                                <option value={supplier.id} key={supplier.id}>
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.supplierId?.message && (
                                            <p className="mt-2 text-danger">{errors.supplierId?.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2 mb-3">
                                <div className="col-12">
                                    <h5 className="font-weight-bold">Danh sách sản phẩm nhập</h5>
                                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                                        <thead>
                                            <tr className="bg bg-dark text-light">
                                                <th scope="col">#</th>
                                                <th scope="col">Sản phẩm</th>
                                                <th scope="col">Mẫu sản phẩm</th>
                                                <th scope="col">Số lượng</th>
                                                <th scope="col">Giá nhập</th>
                                                <th scope="col">Giá nhập khác</th>
                                                <th scope="col">Thành tiền</th>
                                                <th scope="col">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listProductPurchaseOrders?.map((step, index) => (
                                                <tr>
                                                    <td className="text-center">{index + 1}</td>
                                                    <td>
                                                        <div key={index} className="services">
                                                            <div className="first-division">
                                                                <select
                                                                    id="roleId"
                                                                    className="form-control"
                                                                    name="productId"
                                                                    value={step.productId}
                                                                    onChange={(e) => handleStepChange(e, index)}
                                                                >
                                                                    <option disabled selected value="">
                                                                        Chọn sản phẩm
                                                                    </option>
                                                                    {listProducts?.map((item, index) => (
                                                                        <option value={item.id} key={item.id}>
                                                                            {item.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div key={index} className="services">
                                                            <div className="first-division">
                                                                <select
                                                                    className="form-control"
                                                                    name="productSampleId"
                                                                    value={step.productSampleId}
                                                                    onChange={(e) => handleStepChange(e, index)}
                                                                >
                                                                    <option disabled selected value="">
                                                                        Chọn mẫu sản phẩm
                                                                    </option>
                                                                    {step.productSamples?.map((item, index) => (
                                                                        <option value={item.id} key={item.id}>
                                                                            {item.colorProduct.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            name="quantity"
                                                            min={1}
                                                            value={step.quantity}
                                                            onChange={(e) => handleStepChange(e, index)}
                                                        />
                                                    </td>
                                                    <td>
                                                        {' '}
                                                        {step.priceIn !== null ? (
                                                            <>
                                                                {String(step.priceIn).replace(
                                                                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                    '$1,',
                                                                )}
                                                                <sup>đ</sup>
                                                            </>
                                                        ) : (
                                                            '' // Replace with your desired "not available" message
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        {step.showInputOtherPriceIn === true ? (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="otherPriceIn"
                                                                    value={step.formatOtherPriceIn}
                                                                    onChange={(e) => handleStepChange(e, index)}
                                                                />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span
                                                                    className="btn btn-success"
                                                                    onClick={(e) => handleShowInputOtherPriceIn(index)}
                                                                >
                                                                    <i className="fas fa-plus"></i>{' '}
                                                                </span>
                                                            </>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {step.priceIn !== null ? (
                                                            <>
                                                                {String(
                                                                    step.otherPriceIn !== null
                                                                        ? parseInt(step.otherPriceIn) * step.quantity
                                                                        : step.priceIn * step.quantity,
                                                                ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                                                <sup>đ</sup>
                                                            </>
                                                        ) : (
                                                            '' // Replace with your desired "not available" message
                                                        )}
                                                    </td>
                                                    <td>
                                                        {listProductPurchaseOrders?.length !== 1 && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleStepRemove(index)}
                                                                    className="btn btn-danger ml-2"
                                                                >
                                                                    <i className="fas fa-trash-alt"></i>
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="text-center">
                                                <td colSpan={8}>
                                                    {
                                                        <button
                                                            type="button"
                                                            onClick={handleStepAdd}
                                                            className="btn btn-success m-auto"
                                                        >
                                                            <i className="fas fa-plus"></i>
                                                        </button>
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Lưu
                            </button>
                            <Link to="/admin-list-product-purchase-orders" className="btn btn-dark ml-3">
                                Quay lại
                            </Link>
                        </form>
                    </div>
                </div>
            </>
        </>
    );
}

export default AddProductPurchaseOrder;