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
import MainProductModal from '~/components/MainProductModal';
import { LINK_PRODUCT_IMAGE } from '~/helpers/constants';
import ProductShockDealModal from '~/components/ShockDealProductModal';
import { useAddShockDealData } from '~/hooks/react-query/shockdealData';
registerLocale('vi', viLocale);
function AddShockDeal() {
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
    const [showMainProduct, setShowMainProduct] = useState(false);
    const [showShockDeal, setShowShockDeal] = useState(false);

    const [listMainProducts, setListMainProducts] = useState([]);
    const [listShockDeals, setListShockDeals] = useState([]);
    const handleCloseMainProduct = () => setShowMainProduct(false);
    const handleCloseShockDeal = () => setShowShockDeal(false);
    const handleShowMainProduct = () => {
        setShowMainProduct(true);
    };
    const handleShowShockDeal = () => {
        setShowShockDeal(true);
    };
    const handleChangePriceShockDeal = (e, index) => {
        const rawValue = e.target.value.replace(/,/g, '');
        const formattedValue = formatPrice(rawValue);
        setListShockDeals((prevListShockDeals) => {
            const updatedListShockDeals = [...prevListShockDeals]; // Sao chép mảng
            const productToUpdate = updatedListShockDeals[index];
            if (productToUpdate) {
                // Tạo bản sao của sản phẩm và chỉ cập nhật thuộc tính shockDealPrice
                const updatedProduct = {
                    ...productToUpdate,
                    shockDealPrice: rawValue,
                    formatPrice: formattedValue,
                };

                // Thay thế phần tử cũ trong mảng bằng phần tử được cập nhật
                updatedListShockDeals[index] = updatedProduct;
            }

            return updatedListShockDeals; // Trả về mảng đã cập nhật
        });
    };
    console.log(listShockDeals);
    const handleSetMainProduct = (data) => {
        setShowMainProduct(false);
        setListMainProducts(data);
    };
    const handleSetShockDeal = (data) => {
        setShowShockDeal(false);
        setListShockDeals(data);
    };
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
            setListMainProducts([]);
            setListShockDeals([]);
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
    const { mutate: addShockDeal } = useAddShockDealData(onSuccess);
    const { isLoading: isLoadingWareHouses, data: dataWareHouses } = useWareHousesData();
    const {
        isLoading: isLoadingProductsInPromotionProduct,
        data: dataProductsInPromotionProduct,
        refetch: refetchProductsInPromotionProduct,
    } = useAllProductsInPromotionProductData(selectedWarehouseId);

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

    const onSubmit = async (data) => {
        const updatedListShockDeals = listShockDeals.map((deal) => {
            // Chuyển thuộc tính shockDealPrice thành kiểu dữ liệu integer
            const shockDealPriceInt = parseInt(deal.shockDealPrice, 10); // 10 là cơ số (base) của số nguyên
            return { ...deal, shockDealPrice: shockDealPriceInt };
        });
        let createShockDeal = {
            name: data.name,
            listMainProducts: listMainProducts,
            listShockDealProducts: updatedListShockDeals,
            startDate: startDate,
            endDate: endDate,
        };
        addShockDeal(createShockDeal);
        return;
    };
    if (isLoadingWareHouses || isLoadingProductsInPromotionProduct) {
        return <LoadingAdmin />;
    }
    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Thêm Deal sốc</h6>
                        {showMainProduct === true && (
                            <MainProductModal
                                show={showMainProduct}
                                onClose={handleCloseMainProduct}
                                setMainProduct={handleSetMainProduct}
                                listMainProducts={listMainProducts}
                            />
                        )}
                        {showShockDeal === true && (
                            <ProductShockDealModal
                                show={showShockDeal}
                                onClose={handleCloseShockDeal}
                                setShockDeal={handleSetShockDeal}
                                listShockDeals={listShockDeals}
                            />
                        )}
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
                                                    Tên Deal sốc:
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
                                                            right: '300px',
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
                                                            right: '300px',
                                                        }}
                                                    >
                                                        <i className="fas fa-calendar-alt"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-5 mb-3">
                                        <div className="col-6">
                                            <div class="row mb-4">
                                                <div className="col-12">
                                                    <h5 className="font-weight-bold mb-3">Danh sách sản phẩm chính</h5>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={() => handleShowMainProduct()}
                                                    >
                                                        Thêm sản phẩm
                                                    </button>
                                                </div>
                                            </div>
                                            <table
                                                className="table table-bordered"
                                                id="dataTable"
                                                width="50%"
                                                cellSpacing={0}
                                            >
                                                <thead>
                                                    <tr className="bg bg-dark text-light">
                                                        <th scope="col" width="70%">
                                                            Sản phẩm
                                                        </th>
                                                        <th scope="col">Hình ảnh</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {listMainProducts && listMainProducts.length > 0 ? (
                                                        listMainProducts.map((item, index) => (
                                                            <tr key={item.id}>
                                                                <td>{item.name}</td>
                                                                <td>
                                                                    <img
                                                                        src={LINK_PRODUCT_IMAGE + item.image}
                                                                        className="card-img"
                                                                        style={{ width: '50%', height: '50%' }}
                                                                        alt="..."
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td className="text-center" colSpan="3">
                                                                Không có dữ liệu
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="row mt-5 mb-3">
                                        <div className="col-12">
                                            <div class="row mb-4">
                                                <div className="col-12">
                                                    <h5 className="font-weight-bold mb-3">
                                                        Danh sách sản phẩm mua kèm
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={() => handleShowShockDeal()}
                                                    >
                                                        Thêm sản phẩm
                                                    </button>
                                                </div>
                                            </div>
                                            <table
                                                className="table table-bordered"
                                                id="dataTable"
                                                width="50%"
                                                cellSpacing={0}
                                            >
                                                <thead>
                                                    <tr className="bg bg-dark text-light">
                                                        <th scope="col">Sản phẩm</th>
                                                        <th scope="col" width="12%">
                                                            Hình ảnh
                                                        </th>
                                                        <th scope="col">Giá bán hiện tại</th>
                                                        <th scope="col">Giá mua kèm</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {listShockDeals && listShockDeals.length > 0 ? (
                                                        listShockDeals.map((item, index) => (
                                                            <tr key={item.id}>
                                                                <td>{item.name}</td>
                                                                <td>
                                                                    <img
                                                                        src={LINK_PRODUCT_IMAGE + item.image}
                                                                        className="card-img"
                                                                        style={{ width: '90%', height: '90%' }}
                                                                        alt="..."
                                                                    />
                                                                </td>
                                                                <td>
                                                                    {String(item.productVersions[0].priceOut).replace(
                                                                        /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                        '$1,',
                                                                    )}
                                                                    <sup>đ</sup>,
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="otherPriceIn"
                                                                        value={item.formatPrice}
                                                                        onChange={(e) =>
                                                                            handleChangePriceShockDeal(e, index)
                                                                        }
                                                                    />
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
                                    <button type="submit" className="btn btn-primary">
                                        Lưu
                                    </button>
                                    <Link to="/admin-list-shock-deals" className="btn btn-dark ml-3">
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

export default AddShockDeal;
