import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    useAddPromotionProductData,
    useAllProductsInPromotionProductData,
} from '~/hooks/react-query/promotionproductData';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useWareHousesData } from '~/hooks/react-query/warehouseData';
import LoadingAdmin from '~/components/LoadingAdmin';
import viLocale from 'date-fns/locale/vi';
registerLocale('vi', viLocale);
function AddPromotionProduct() {
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
    );
    const [endDate, setEndDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59),
    );
    const [selectedWarehouseId, setSelectedWarehouseId] = useState();
    const [listProducts, setListProducts] = useState([]);
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Vui lòng nhập tên khuyến mãi'),
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
    const handleSetStartDate = (date) => {
        console.log(date);
        // if (date.getDate() === endDate.getDate() || date > endDate) {
        //     setEndDate(new Date(new Date(date).setDate(new Date(date).getDate() + 1)));
        // }
        setStartDate(date);
    };
    const handleSetEndDate = (date) => {
        console.log(date);
        if (date.getDate() === startDate.getDate() || date < startDate) {
            setStartDate(new Date(new Date(date).setDate(new Date(date).getDate() - 1)));
        }

        setEndDate(date);
    };

    const onSuccess = (data) => {
        if (data.success) {
            resetField('name');
            setListProductPurchaseOrders([
                {
                    productId: '',
                    productVersionId: '',
                    colorProductId: '',
                    priceIn: null,
                    priceOut: null,
                    discountedPrice: null,
                    formatDiscountedPrice: '',
                },
            ]);
            toast.success('Tạo thành công');
        } else {
            setErrorsForm(data.errors);
        }
    };
    const { mutate: addPromotionProduct } = useAddPromotionProductData(onSuccess);
    const { isLoading: isLoadingWareHouses, data: dataWareHouses } = useWareHousesData();
    const {
        isLoading: isLoadingProductsInPromotionProduct,
        data: dataProductsInPromotionProduct,
        refetch: refetchProductsInPromotionProduct,
    } = useAllProductsInPromotionProductData(selectedWarehouseId);
    const handleChangeWarehouse = (e) => {
        clearErrors('warehouseId');
        setSelectedWarehouseId(e.target.value);
        setValue('warehouseId', e.target.value);
        if (listProductPurchaseOrders && listProductPurchaseOrders[0].productId !== '') {
            setListProductPurchaseOrders([
                {
                    productId: '',
                    productVersionId: '',
                    priceIn: null,
                    priceOut: null,
                    discountedPrice: null,
                    formatDiscountedPrice: '',
                },
            ]);
        }
    };
    useEffect(() => {
        if (dataProductsInPromotionProduct) {
            setListProducts(dataProductsInPromotionProduct.data);
        }
    }, [dataProductsInPromotionProduct]);
    const [listProductPurchaseOrders, setListProductPurchaseOrders] = useState([
        {
            productId: '',
            productVersionId: '',
            priceIn: null,
            priceOut: null,
            discountedPrice: null,
            formatDiscountedPrice: '',
            showInputDiscountedPrice: false,
            quantity: 1,
            productVersions: [],
        },
    ]);
    const formatPrice = (value) => {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    // const handleShowInputDiscountedPrice = (index) => {
    //     const list = [...listProductPurchaseOrders];
    //     console.log(index);
    //     list[index]['showInputDiscountedPrice'] = true;
    //     setListProductPurchaseOrders(list);
    // };
    const handleStepChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...listProductPurchaseOrders];
        if (name === 'productVersionId') {
            const foundOrder = listProductPurchaseOrders.find((order) => order.productVersionId === value.toString());
            if (foundOrder) {
                toast.warning('Đã có trong danh sách nhập');
                return;
            }
            const findProduct = listProductPurchaseOrders[index];
            const findProductVersion = findProduct.productVersions.find(
                (productVersion) => productVersion.id === parseInt(value),
            );
            list[index]['priceIn'] = findProductVersion.priceIn;
            list[index]['priceOut'] = findProductVersion.priceOut;
        }
        if (name === 'productId') {
            let product = listProducts.find((x) => x.id === parseInt(value, 10));
            if (product) {
                list[index]['productVersions'] = product.productVersions;
                // list[index]['productColorProducts'] = product.productColorProducts;
                list[index]['productVersionId'] = '';
                list[index]['quantity'] = 1;
            }
        }
        if (name === 'discountedPrice') {
            const rawValue = e.target.value.replace(/,/g, '');
            if (rawValue === '') {
                list[index]['formatDiscountedPrice'] = null;
                list[index]['discountedPrice'] = null;
            } else {
                const formattedValue = formatPrice(rawValue);
                list[index]['formatDiscountedPrice'] = formattedValue;
                list[index]['discountedPrice'] = rawValue;
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
                productVersionId: '',
                colorProductId: '',
                priceIn: null,
                priceOut: null,
                discountedPrice: null,
                formatDiscountedPrice: '',
                quantity: 1,
            },
        ]);
    };
    const onSubmit = async (data) => {
        let hasInvalidProduct = false;
        listProductPurchaseOrders.forEach((item) => {
            if (item.discountedPrice === null || item.productId === '' || item.productVersionId === '') {
                alert(21);
                hasInvalidProduct = true;
            } else {
                // Chuyển đổi discountedPrice và productVersionId thành số nguyên
                item.discountedPrice = parseInt(item.discountedPrice, 10); // 10 là cơ số (base)
                item.productVersionId = parseInt(item.productVersionId, 10);
            }
        });
        if (hasInvalidProduct) {
            toast.warning('Có sản phẩm không hợp lệ.');
            return;
        }
        let createPromotionProduct = {
            name: data.name,
            listPromotionProducts: listProductPurchaseOrders,
            startDate: startDate,
            endDate: endDate,
        };
        console.log(createPromotionProduct);
        addPromotionProduct(createPromotionProduct);
    };
    if (isLoadingWareHouses || isLoadingProductsInPromotionProduct) {
        return <LoadingAdmin />;
    }
    console.log(listProductPurchaseOrders);
    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Thêm khuyến mãi</h6>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                {errorsForm && errorsForm.length > 0 && (
                                    <>
                                        {errorsForm.map((error, index) => (
                                            <p className="text-danger" key={index}>
                                                {error}
                                            </p>
                                        ))}
                                    </>
                                )}
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                                    Tên khuyến mãi:
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    placeholder="Nhập tên khuyến mãi"
                                                    {...register('name')}
                                                />
                                                {errors.name?.message && (
                                                    <p className="mt-2 text-danger">{errors.name?.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-6">
                                            <div className="row">
                                                {' '}
                                                <div className="mt-3 col-4">
                                                    <span className="font-weight-bold">Ngày bắt đầu:</span>
                                                </div>
                                                <div className="col-8">
                                                    <DatePicker
                                                        dayClassName={() => 'example-datepicker-day-class'}
                                                        popperClassName="example-datepicker-class"
                                                        todayButton="TODAY"
                                                        locale="vi"
                                                        className="mt-2 form-control"
                                                        selected={startDate}
                                                        onChange={(date) => handleSetStartDate(date)}
                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                        timeIntervals={30}
                                                        showTimeSelect
                                                        minDate={new Date()}
                                                    />
                                                    <span
                                                        style={{
                                                            position: 'absolute',
                                                            top: '33%',
                                                            right: '228px',
                                                        }}
                                                    >
                                                        <i className="fas fa-calendar-alt"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-6">
                                            <div className="row">
                                                {' '}
                                                <div className="mt-3 col-4">
                                                    <span className="font-weight-bold">Ngày kết thúc:</span>
                                                </div>
                                                <div className="col-8">
                                                    <DatePicker
                                                        dayClassName={() => 'example-datepicker-day-class'}
                                                        popperClassName="example-datepicker-class"
                                                        todayButton="TODAY"
                                                        locale="vi"
                                                        className="mt-2 form-control"
                                                        selected={endDate}
                                                        showTimeSelect
                                                        timeIntervals={30}
                                                        onChange={(date) => handleSetEndDate(date)}
                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                        minDate={new Date()}
                                                    />
                                                    <span
                                                        style={{
                                                            position: 'absolute',
                                                            top: '33%',
                                                            right: '228px',
                                                        }}
                                                    >
                                                        <i className="fas fa-calendar-alt"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-5 mb-3">
                                        <div className="col-12">
                                            <h5 className="font-weight-bold">Danh sách sản phẩm khuyến mãi</h5>
                                            <table
                                                className="table table-bordered"
                                                id="dataTable"
                                                width="100%"
                                                cellSpacing={0}
                                            >
                                                <thead>
                                                    <tr className="bg bg-dark text-light">
                                                        <th scope="col">#</th>
                                                        <th scope="col">Sản phẩm</th>
                                                        <th scope="col">Phiên bản</th>
                                                        <th scope="col">Giá nhập</th>
                                                        <th scope="col">Giá bán</th>
                                                        <th scope="col">Giá khuyến mãi</th>
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
                                                                            name="productVersionId"
                                                                            value={step.productVersionId}
                                                                            onChange={(e) => handleStepChange(e, index)}
                                                                        >
                                                                            <option disabled selected value="">
                                                                                Chọn phiên bản
                                                                            </option>
                                                                            {step.productVersions?.map(
                                                                                (item, index) => (
                                                                                    <option
                                                                                        value={item.id}
                                                                                        key={item.id}
                                                                                    >
                                                                                        {item.ram?.name}GB-
                                                                                        {item.rom?.name}GB
                                                                                    </option>
                                                                                ),
                                                                            )}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {' '}
                                                                {step.priceIn !== null || step.priceIn !== undefined ? (
                                                                    <>
                                                                        {step.priceIn === null
                                                                            ? '0'
                                                                            : String(step.priceIn).replace(
                                                                                  /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                  '$1,',
                                                                              )}
                                                                        <sup>đ</sup>
                                                                    </>
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </td>
                                                            <td>
                                                                {' '}
                                                                {step.priceOut !== null ||
                                                                step.priceOut !== undefined ? (
                                                                    <>
                                                                        {step.priceOut === null
                                                                            ? '0'
                                                                            : String(step.priceOut).replace(
                                                                                  /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                                  '$1,',
                                                                              )}
                                                                        <sup>đ</sup>
                                                                    </>
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </td>
                                                            <td className="text-center">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="discountedPrice"
                                                                    value={step.formatDiscountedPrice}
                                                                    onChange={(e) => handleStepChange(e, index)}
                                                                />
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
                                    <Link to="/admin-list-promotion-products" className="btn btn-dark ml-3">
                                        Quay lại
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </>
    );
}

export default AddPromotionProduct;
