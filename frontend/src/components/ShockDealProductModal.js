import { Button, Modal } from 'react-bootstrap';
import { LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE, LINK_PRODUCT_IMAGE } from '~/helpers/constants';
import moment from 'moment';

import 'moment/locale/vi';
import { useEffect, useState } from 'react';
import { callAPIGetOrderDetail, callAPIGetOrderTrackingDetail } from '~/services/client/getaddress.service';
import { capitalizeFirstLetter } from '~/helpers/covertString';
import { useProductsClientData, useRequestCancelOrderClientData } from '~/hooks/react-query/client/pageData';
import { toast } from 'react-toastify';
import { useProductCategoriesData } from '~/hooks/react-query/productcategoryData';
import { useProductsData } from '~/hooks/react-query/productData';
import LoadingAdmin from './LoadingAdmin';
import { logDOM } from '@testing-library/react';
function ShockDealProductModal({ show, onClose, setShockDeal, listShockDeals }) {
    const { isLoading, data } = useProductCategoriesData();
    const { isLoading: isLoadingProducts, data: dataProducts } = useProductsClientData();
    const [selectedProductCategories, setSelectedProductCategories] = useState(null);
    const [selectedAllProductCategories, setSelectedAllProductCategories] = useState(true);
    const [selectedShockDealProducts, setSelectedShockDealProducts] = useState(false);
    const [filterListProducts, setFilterListProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    useEffect(() => {
        if (listShockDeals && listShockDeals.length > 0) {
            setSelectedProducts(listShockDeals);
        }
    }, [listShockDeals]);
    const handleSelectedShockDealProduct = (product) => {
        const isProductExisting = selectedProducts.some((x) => x.id === product.id);
        if (isProductExisting) {
            // Nếu sản phẩm đã tồn tại, loại bỏ nó khỏi mảng
            setSelectedProducts((prev) => prev.filter((x) => x.id !== product.id));
        } else {
            product.shockDealPrice = '0';
            product.formatPrice = '0';
            setSelectedProducts((prev) => [...prev, product]);
        }
    };
    const handleSelectedAllProductCategory = (id) => {
        if (selectedAllProductCategories === true) {
            setSelectedProductCategories(null);
            return;
        }
        if (selectedAllProductCategories === false) {
            setSelectedProductCategories(null);
            setSelectedShockDealProducts(false);
        }
        setSelectedAllProductCategories(!selectedAllProductCategories);
        setSelectedProductCategories(null);
    };
    const handleSelectedShockDealProducts = (id) => {
        if (selectedShockDealProducts === false) {
            setSelectedProductCategories(null);
            setSelectedAllProductCategories(false);
        }
        setSelectedShockDealProducts(!selectedShockDealProducts);
        setSelectedProductCategories(null);
    };
    const handleSelectedProductCategory = (productCategory) => {
        console.log('cjecl', productCategory);
        const isProductCategory = data.data.find((x) => x.id === productCategory.id);
        console.log('dsdsds', isProductCategory);
        if (isProductCategory) {
            setSelectedAllProductCategories(false);
            setSelectedShockDealProducts(false);
            setSelectedProductCategories(productCategory);
        }
    };
    const handleConfirmShockDealProduct = () => {
        setShockDeal(selectedProducts);
    };
    useEffect(() => {
        if (dataProducts && dataProducts.data) {
            if (selectedAllProductCategories === true) {
                setFilterListProducts(dataProducts.data);
            }
            if (selectedProductCategories) {
                let newListProducts = dataProducts.data.filter(
                    (product) => product.productCategoryCode === selectedProductCategories.code,
                );
                setFilterListProducts(newListProducts);
            }
            if (selectedShockDealProducts === true) {
                setFilterListProducts(selectedProducts);
            }
        }
    }, [dataProducts, selectedProductCategories, selectedAllProductCategories, selectedShockDealProducts]);
    if (isLoading || isLoadingProducts) {
        return <LoadingAdmin />;
    }

    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="modal-70w">
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title className="font-weight-bold text-light">Sản phẩm mua kèm:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row ml-1">
                        <div className="col-2">
                            <h5 className="font-weight-bold mb-4">Loại sản phẩm</h5>
                            <div
                                className={`mb-2 ${
                                    selectedAllProductCategories && selectedAllProductCategories === true
                                        ? 'selected-item'
                                        : ''
                                }`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSelectedAllProductCategory()}
                            >
                                <h5> Tất cả</h5>
                            </div>
                            {data && data.data.length > 0 ? (
                                data.data.map((item, index) => (
                                    <div
                                        className={`mb-3 ${
                                            selectedProductCategories && selectedProductCategories.id === item.id
                                                ? 'selected-item'
                                                : ''
                                        }`}
                                        key={item.id}
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleSelectedProductCategory(item)}
                                    >
                                        <h5> {item.name}</h5>
                                    </div>
                                ))
                            ) : (
                                <></>
                            )}
                            <div
                                className={`mb-2 ${
                                    selectedShockDealProducts && selectedShockDealProducts === true
                                        ? 'selected-item'
                                        : ''
                                }`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSelectedShockDealProducts()}
                            >
                                <h5> Đã chọn</h5>
                            </div>
                        </div>
                        <div className="col-10">
                            <h5 className="font-weight-bold mb-4">Danh sách sản phẩm</h5>
                            <div className="row">
                                {filterListProducts && filterListProducts.length > 0 ? (
                                    filterListProducts.map((item, index) => (
                                        <div className={`col-4 mb-4`} key={item.id}>
                                            <div
                                                onClick={() => handleSelectedShockDealProduct(item)}
                                                className={`card text-center p-3 ${
                                                    selectedProducts.some((x) => x.id === item.id)
                                                        ? 'selected-item-main'
                                                        : ''
                                                }`}
                                                style={{ width: '18rem' }}
                                            >
                                                <img
                                                    src={LINK_PRODUCT_IMAGE + item.image}
                                                    className="card-img-top image-center" // Thêm lớp CSS tùy chỉnh ở đây
                                                    style={{ width: '50%' }}
                                                    alt="..."
                                                />
                                                <div className="card-body">
                                                    <h6 className="card-title font-weight-bold">{item.name}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="primary" onClick={() => handleConfirmShockDealProduct()}>
                        Xác nhận
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ShockDealProductModal;
