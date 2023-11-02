import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '~/components/Client/ProductCard';
import { LINK_APP_FRONTEND, LINK_BRAND_IMAGE, LINK_PRODUCT_IMAGE } from '~/helpers/constants';
import {
    useBrandsClientData,
    useOperatingSystemTypesClientData,
    useProductsClientData,
    usePromotionProductsClientData,
    useRamsClientData,
    useRomsClientData,
} from '~/hooks/react-query/client/pageData';
import useScript from '~/hooks/useScript';
const dataPinTypes = [
    {
        id: 1,
        name: 'Dưới 3000 mAh',
        minCapacity: 0,
        maxCapacity: 3000,
    },
    {
        id: 2,
        name: 'Pin từ 3000 - 4000 mAh',
        minCapacity: 3001,
        maxCapacity: 4000,
    },
    {
        id: 3,
        name: 'Pin từ 4000 - 5000 mAh',
        minCapacity: 4001,
        maxCapacity: 5000,
    },
    {
        id: 4,
        name: 'Siêu trâu: trên 5000 mAh',
        minCapacity: 5001,
        maxCapacity: 200000,
    },
];
const dataManHinhTypes = [
    {
        id: 1,
        name: 'Màn hình nhỏ: dưới 5.0 inch',
        minSize: 0,
        maxSize: 5.0,
    },
    {
        id: 2,
        name: 'Nhỏ gọn vừa tay: dưới 6.0 inch, tràn viền',
        minSize: 5.1,
        maxSize: 6.0,
    },
    {
        id: 3,
        name: 'Trên 6.0 inch',
        minSize: 6.1,
        maxSize: 20.1,
    },
];
function ListProductsClient() {
    const { isLoading, data, isError, error } = useProductsClientData();
    const { isLoading: isLoadingBrands, data: dataBrands } = useBrandsClientData();
    const { isLoading: isLoadingRams, data: dataRams } = useRamsClientData();
    const { isLoading: isLoadingRoms, data: dataRoms } = useRomsClientData();
    const { isLoading: isLoadingOperatingSystemTypes, data: dataOperatingSystemTypes } =
        useOperatingSystemTypesClientData();

    const [checkedBrands, setCheckedBrands] = useState([]);
    const [checkedAllBrands, setCheckedAllBrands] = useState(false);

    const [checkedPinTypes, setCheckedPinTypes] = useState([]);
    const [checkedAllPinTypes, setCheckedAllPinTypes] = useState(false);

    const [checkedManHinhTypes, setCheckedManHinhTypes] = useState([]);
    const [checkedAllManHinhTypes, setCheckedAllManHinhTypes] = useState(false);

    const [checkedRams, setCheckedRams] = useState([]);
    const [checkedAllRams, setCheckedAllRams] = useState(false);

    const [checkedRoms, setCheckedRoms] = useState([]);
    const [checkedAllRoms, setCheckedAllRoms] = useState(false);

    const [checkedOperatingSystemTypes, setCheckedOperatingSystemTypes] = useState([]);
    const [checkedAllOperatingSystemTypes, setCheckedAllOperatingSystemTypes] = useState(false);

    const [filterProducts, setFilterProducts] = useState([]);
    const { isLoading: isLoadingPromotionProduct, data: dataPromotionProducts } = usePromotionProductsClientData();
    const [promotionProductDetails, setPromotionProductDetails] = useState([]);
    useEffect(() => {
        // Lặp qua dataPromotionProducts để trích xuất các productVersionId đang được khuyến mãi
        if (data && dataPromotionProducts) {
            let list = [];
            dataPromotionProducts.data.forEach((promotion) => {
                promotion.promotionProductDetails.forEach((detail) => {
                    list.push(detail);
                });
            });
            setPromotionProductDetails(list);
        }
    }, [data, dataPromotionProducts]);
    const handleCheckBrands = (id) => {
        const isChecked = checkedBrands.includes(id);
        if (isChecked) {
            setCheckedBrands((checked) => checked.filter((check) => check !== id));
        } else {
            setCheckedBrands((prev) => [...prev, id]);
        }
    };
    const handleCheckRams = (id) => {
        const isChecked = checkedRams.includes(id);
        if (isChecked) {
            setCheckedRams((checked) => checked.filter((check) => check !== id));
        } else {
            setCheckedRams((prev) => [...prev, id]);
        }
    };
    const handleCheckRoms = (id) => {
        const isChecked = checkedRoms.includes(id);
        if (isChecked) {
            setCheckedRoms((checked) => checked.filter((check) => check !== id));
        } else {
            setCheckedRoms((prev) => [...prev, id]);
        }
    };
    const handleCheckOperatingSystemTypes = (id) => {
        const isChecked = checkedOperatingSystemTypes.includes(id);
        if (isChecked) {
            setCheckedOperatingSystemTypes((checked) => checked.filter((check) => check !== id));
        } else {
            setCheckedOperatingSystemTypes((prev) => [...prev, id]);
        }
    };
    const handleCheckedPinTypes = (id) => {
        const isChecked = checkedPinTypes.includes(id);
        if (isChecked) {
            setCheckedPinTypes((checked) => checked.filter((check) => check !== id));
        } else {
            setCheckedPinTypes((prev) => [...prev, id]);
        }
    };
    const handleCheckedManHinhTypes = (id) => {
        const isChecked = checkedManHinhTypes.includes(id);
        if (isChecked) {
            setCheckedManHinhTypes((checked) => checked.filter((check) => check !== id));
        } else {
            setCheckedManHinhTypes((prev) => [...prev, id]);
        }
    };
    const handleCheckAllBrands = (id) => {
        if (checkedAllBrands === true) {
            setCheckedBrands([]);
            return;
        }
        setCheckedAllBrands(!checkedAllBrands);
        setCheckedBrands([]);
    };

    const handleCheckAllRams = (id) => {
        if (checkedAllRams === true) {
            setCheckedRams([]);
            return;
        }
        setCheckedAllRams(!checkedAllRams);
        setCheckedRams([]);
    };
    const handleCheckAllRoms = (id) => {
        if (checkedAllRoms === true) {
            setCheckedRoms([]);
            return;
        }
        setCheckedAllRoms(!checkedAllRoms);
        setCheckedRoms([]);
    };
    const handleCheckAllOperatingSystemTypes = (id) => {
        if (checkedAllOperatingSystemTypes === true) {
            setCheckedOperatingSystemTypes([]);
            return;
        }
        setCheckedAllOperatingSystemTypes(!checkedAllOperatingSystemTypes);
        setCheckedOperatingSystemTypes([]);
    };
    const handleCheckAllPinTypes = (id) => {
        if (checkedAllPinTypes === true) {
            setCheckedPinTypes([]);
            return;
        }
        setCheckedAllPinTypes(!checkedAllPinTypes);
        setCheckedPinTypes([]);
    };
    const handleCheckAllManHinhTypes = (id) => {
        if (checkedAllManHinhTypes === true) {
            setCheckedManHinhTypes([]);
            return;
        }
        setCheckedAllManHinhTypes(!checkedAllManHinhTypes);
        setCheckedManHinhTypes([]);
    };
    useEffect(() => {
        if (data && data.data) {
            let listProducts = data.data;
            if (checkedBrands && checkedBrands.length > 0) {
                setCheckedAllBrands(false);
                listProducts = listProducts.filter((product) => {
                    // Check if the product's brand ID is included in checkedBrands
                    return checkedBrands.includes(product.brandId);
                });
            }
            if (checkedOperatingSystemTypes && checkedOperatingSystemTypes.length > 0) {
                setCheckedAllOperatingSystemTypes(false);
                listProducts = listProducts.filter((product) => {
                    if (product.operatingSystemProduct && product.operatingSystemProduct.operatingSystemTypeId) {
                        return checkedOperatingSystemTypes.includes(
                            product.operatingSystemProduct.operatingSystemTypeId,
                        );
                    }
                    // Handle the case where operatingSystemProduct or operatingSystemTypeId is null/undefined.
                    return false;
                });
            }
            if (checkedPinTypes && checkedPinTypes.length > 0) {
                setCheckedAllPinTypes(false);

                listProducts = listProducts.filter((product) => {
                    const productCapacity = product.battery; // Thay bằng trường dữ liệu chứa dung lượng pin của sản phẩm
                    return checkedPinTypes.some((pinType) => {
                        const type = dataPinTypes.find((pin) => pin.id === pinType);
                        return type && productCapacity >= type.minCapacity && productCapacity <= type.maxCapacity;
                    });
                });
            }
            if (checkedManHinhTypes && checkedManHinhTypes.length > 0) {
                setCheckedAllManHinhTypes(false);

                listProducts = listProducts.filter((product) => {
                    const productScreenWidth = product.screenWidth; // Thay bằng trường dữ liệu chứa dung lượng pin của sản phẩm
                    return checkedManHinhTypes.some((pinType) => {
                        const type = dataManHinhTypes.find((pin) => pin.id === pinType);
                        return type && productScreenWidth >= type.minSize && productScreenWidth <= type.maxSize;
                    });
                });
            }
            //  console.log(listProducts);
            setFilterProducts(listProducts);
        }
    }, [
        checkedBrands,
        checkedPinTypes,
        checkedManHinhTypes,
        checkedOperatingSystemTypes,
        checkedRams,
        checkedRams,
        data,
    ]);
    if (
        isLoading ||
        isLoadingBrands ||
        isLoadingRams ||
        isLoadingRoms ||
        isLoadingOperatingSystemTypes ||
        isLoadingPromotionProduct
    ) {
        <></>;
    }
    console.log(checkedOperatingSystemTypes);
    return (
        <>
            <section
                className="breadcrumb-section"
                style={{
                    backgroundImage: 'url(http://localhost:3000/img/client/breadcrumb.PNG)',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <div className="breadcrumb__option">
                                    <Link to="/">Trang chủ</Link>
                                    <span>Danh sách điện thoại</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="featured span">
                <div className="container">
                    <div className="row">
                        <div className="col-4">
                            {' '}
                            <div className="row mb-3">
                                <div className="col-lg-12">
                                    <div className="section-title">
                                        <h4 className="font-weight-bold float-left">Bộ lọc</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <h6 className="font-weight-bold float-left">Thương hiệu</h6>
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-lg-6 mt-2">
                                    <div className="form-check" onChange={() => handleCheckAllBrands()}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={checkedAllBrands}
                                        />
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            Tất cả
                                        </label>
                                    </div>
                                </div>
                                {dataBrands && dataBrands.data && dataBrands.data.length > 0 ? (
                                    dataBrands.data.map((item, index) => (
                                        <div className="col-lg-6 mt-2" key={index}>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    onChange={() => handleCheckBrands(item.id)}
                                                    checked={checkedBrands.includes(item.id)}
                                                />
                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                    {item.name}
                                                </label>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="row mt-3">
                                <div className="col-lg-12">
                                    <h6 className="font-weight-bold float-left">Hiệu năng và pin</h6>
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-lg-12 mt-2">
                                    <div className="form-check" onChange={() => handleCheckAllPinTypes()}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={checkedAllPinTypes}
                                        />
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            Tất cả
                                        </label>
                                    </div>
                                </div>
                                {dataPinTypes && dataPinTypes && dataPinTypes.length > 0 ? (
                                    dataPinTypes.map((item, index) => (
                                        <div className="col-lg-12 mt-2" key={index}>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    onChange={() => handleCheckedPinTypes(item.id)}
                                                    checked={checkedPinTypes.includes(item.id)}
                                                />
                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                    {item.name}
                                                </label>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="row mt-3">
                                <div className="col-lg-12">
                                    <h6 className="font-weight-bold float-left">Màn hình</h6>
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-lg-12 mt-2">
                                    <div className="form-check" onChange={() => handleCheckAllManHinhTypes()}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={checkedAllManHinhTypes}
                                        />
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            Tất cả
                                        </label>
                                    </div>
                                </div>
                                {dataManHinhTypes && dataManHinhTypes && dataManHinhTypes.length > 0 ? (
                                    dataManHinhTypes.map((item, index) => (
                                        <div className="col-lg-12 mt-2" key={index}>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    onChange={() => handleCheckedManHinhTypes(item.id)}
                                                    checked={checkedManHinhTypes.includes(item.id)}
                                                />
                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                    {item.name}
                                                </label>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="row mt-3">
                                <div className="col-lg-12">
                                    <h6 className="font-weight-bold float-left">Hệ điều hành</h6>
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-lg-6 mt-2">
                                    <div className="form-check" onChange={() => handleCheckAllOperatingSystemTypes()}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={checkedAllOperatingSystemTypes}
                                        />
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            Tất cả
                                        </label>
                                    </div>
                                </div>
                                {dataOperatingSystemTypes &&
                                dataOperatingSystemTypes.data &&
                                dataOperatingSystemTypes.data.length > 0 ? (
                                    dataOperatingSystemTypes.data.map((item, index) => (
                                        <div className="col-lg-6 mt-2" key={index}>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    onChange={() => handleCheckOperatingSystemTypes(item.id)}
                                                    checked={checkedOperatingSystemTypes.includes(item.id)}
                                                />
                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                    {item.name}
                                                </label>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="row mt-3">
                                <div className="col-lg-12">
                                    <h6 className="font-weight-bold float-left">Ram</h6>
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-lg-6 mt-2">
                                    <div className="form-check" onChange={() => handleCheckAllRams()}>
                                        <input className="form-check-input" type="checkbox" checked={checkedAllRams} />
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            Tất cả
                                        </label>
                                    </div>
                                </div>
                                {dataRams && dataRams.data && dataRams.data.length > 0 ? (
                                    dataRams.data.map((item, index) => (
                                        <div className="col-lg-6 mt-2" key={index}>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    onChange={() => handleCheckRams(item.id)}
                                                    checked={checkedRams.includes(item.id)}
                                                />
                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                    {item.name}GB
                                                </label>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="row mt-3">
                                <div className="col-lg-12">
                                    <h6 className="font-weight-bold float-left">Rom</h6>
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-lg-6 mt-2">
                                    <div className="form-check" onChange={() => handleCheckAllRoms()}>
                                        <input className="form-check-input" type="checkbox" checked={checkedAllRoms} />
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            Tất cả
                                        </label>
                                    </div>
                                </div>
                                {dataRoms && dataRoms.data && dataRoms.data.length > 0 ? (
                                    dataRoms.data.map((item, index) => (
                                        <div className="col-lg-6 mt-2" key={index}>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    onChange={() => handleCheckRoms(item.id)}
                                                    checked={checkedRoms.includes(item.id)}
                                                />
                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                    {item.name}GB
                                                </label>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="section-title">
                                        <h4 className="font-weight-bold float-left">Danh sách điện thoại</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2 justify-content-between">
                                <div className="col-12 justify-content-between">
                                    {' '}
                                    {dataBrands && dataBrands.data && dataBrands.data.length > 0 ? (
                                        dataBrands.data.map((item, index) => (
                                            <img
                                                key={index}
                                                className="zoomm ml-2 mr-2 rounded border-bottom-info "
                                                style={{ marginTop: 10, marginBottom: 10, cursor: 'pointer' }}
                                                src={LINK_BRAND_IMAGE + item.image}
                                                alt="...."
                                            />
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                            <br />
                            <div className="row featured__filter mt-2">
                                {filterProducts &&
                                filterProducts.filter((product) => product.productCategoryCode === 'DIENTHOAI').length >
                                    0 ? (
                                    filterProducts
                                        ?.filter((product) => product.productCategoryCode === 'DIENTHOAI')
                                        .map((item, index) => (
                                            <div className="col-lg-4 col-md-4 col-sm-6" key={item.id}>
                                                <ProductCard
                                                    product={item}
                                                    promotionProductDetails={promotionProductDetails}
                                                />
                                            </div>
                                        ))
                                ) : (
                                    <>Chưa có sản phẩm.</>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ListProductsClient;
