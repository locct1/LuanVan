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
import { useChargePortsData, useJackPlugsData } from '~/hooks/react-query/productData';
import { useProductCategoriesData } from '~/hooks/react-query/productcategoryData';
import useScript from '~/hooks/useScript';
const dataPinTypes = [
    {
        id: 1,
        name: 'Dưới 10.000 mAh',
        minCapacity: 0,
        maxCapacity: 9999,
    },
    {
        id: 2,
        name: '10.000 mAh',
        minCapacity: 10000,
        maxCapacity: 10000,
    },
    {
        id: 3,
        name: '15000 mAh',
        minCapacity: 15000,
        maxCapacity: 15000,
    },
    {
        id: 4,
        name: '20.0000 mAh',
        minCapacity: 200000,
        maxCapacity: 200000,
    },
];
const dataChargingTypes = [
    {
        id: 1,
        name: '10W',
        minCapacity: 10,
        maxCapacity: 10,
    },
    {
        id: 2,
        name: '12W',
        minCapacity: 12,
        maxCapacity: 12,
    },
    {
        id: 3,
        name: '18W',
        minCapacity: 15,
        maxCapacity: 15,
    },
    {
        id: 4,
        name: '20W',
        minCapacity: 20,
        maxCapacity: 20,
    },
    {
        id: 5,
        name: '25W',
        minCapacity: 25,
        maxCapacity: 25,
    },
    {
        id: 6,
        name: '30W',
        minCapacity: 30,
        maxCapacity: 30,
    },
];
const dataHeadPhoneTimeTypes = [
    {
        id: 1,
        name: 'Dưới 4 tiếng',
        minCapacity: 0,
        maxCapacity: 3.9,
    },
    {
        id: 2,
        name: '4-6 tiếng',
        minCapacity: 4,
        maxCapacity: 5.9,
    },
    {
        id: 3,
        name: '6-8 tiếng',
        minCapacity: 6,
        maxCapacity: 7.9,
    },
    {
        id: 4,
        name: '8 tiếng trở lên',
        minCapacity: 8,
        maxCapacity: 20,
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
function ListAccessoriesClients() {
    const { isLoading, data, isError, error } = useProductsClientData();
    const { isLoading: isLoadingBrands, data: dataBrands } = useBrandsClientData();
    const { isLoading: isLoadingRams, data: dataRams } = useRamsClientData();
    const { isLoading: isLoadingRoms, data: dataRoms } = useRomsClientData();
    const { isLoading: isLoadingProductCategories, data: dataProductCategories } = useProductCategoriesData();
    const { isLoading: isLoadingChargePorts, data: dataChargePorts } = useChargePortsData();
    const { isLoading: isLoadingJackPlugs, data: dataJackPlugs } = useJackPlugsData();
    const { isLoading: isLoadingOperatingSystemTypes, data: dataOperatingSystemTypes } =
        useOperatingSystemTypesClientData();

    const [checkedBrands, setCheckedBrands] = useState([]);
    const [checkedAllBrands, setCheckedAllBrands] = useState(false);
    const [checkedProductCategories, setCheckedProductCategories] = useState([]);
    const [checkedAllProductCategories, setCheckedAllProductCategories] = useState(false);

    const [checkedPinTypes, setCheckedPinTypes] = useState([]);
    const [checkedAllPinTypes, setCheckedAllPinTypes] = useState(false);

    const [checkedChargingTypes, setCheckedChargingTypes] = useState([]);
    const [checkedAllChargingTypes, setCheckedAllChargingTypes] = useState(false);

    const [checkedHeadPhoneTimeTypes, setCheckedHeadPhoneTimeTypes] = useState([]);
    const [checkedAllHeadPhoneTimeTypes, setCheckedAllHeadPhoneTimeTypes] = useState(false);

    const [checkedChargingPortTypes, setCheckedChargingPortTypes] = useState([]);
    const [checkedAllChargingPortTypes, setCheckedAllChargingPortTypes] = useState(false);

    const [checkedJackPlugTypes, setCheckedJackPlugTypes] = useState([]);
    const [checkedAllJackPlugTypes, setCheckedAllJackPlugTypes] = useState(false);

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
    const handleCheckedProductCategories = (id) => {
        const isChecked = checkedProductCategories.includes(id);
        setCheckedPinTypes([]);
        setCheckedChargingTypes([]);
        setCheckedJackPlugTypes([]);
        setCheckedChargingPortTypes([]);
        if (isChecked) {
            setCheckedProductCategories((checked) => checked.filter((check) => check !== id));
        } else {
            setCheckedProductCategories((prev) => [id]);
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
    const handleCheckedChargingTypes = (id) => {
        const isChecked = checkedChargingTypes.includes(id);
        console.log(checkedChargingTypes);
        console.log(id);
        if (isChecked) {
            setCheckedChargingTypes((checked) => checked.filter((check) => check !== id));
        } else {
            setCheckedChargingTypes((prev) => [...prev, id]);
        }
    };
    const handleCheckedHeadPhoneTimeTypes = (id) => {
        const isChecked = checkedHeadPhoneTimeTypes.includes(id);
        console.log(checkedHeadPhoneTimeTypes);
        console.log(id);
        if (isChecked) {
            setCheckedHeadPhoneTimeTypes((checked) => checked.filter((check) => check !== id));
        } else {
            setCheckedHeadPhoneTimeTypes((prev) => [...prev, id]);
        }
    };
    const handleCheckedChargingPortTypes = (id) => {
        const isChecked = checkedChargingPortTypes.includes(id);
        console.log(checkedChargingPortTypes);
        console.log(id);
        if (isChecked) {
            setCheckedChargingPortTypes((checked) => checked.filter((check) => check !== id));
        } else {
            setCheckedChargingPortTypes((prev) => [...prev, id]);
        }
    };
    const handleCheckedJackPlugTypes = (id) => {
        const isChecked = checkedJackPlugTypes.includes(id);
        console.log(checkedJackPlugTypes);
        console.log(id);
        if (isChecked) {
            setCheckedJackPlugTypes((checked) => checked.filter((check) => check !== id));
        } else {
            setCheckedJackPlugTypes((prev) => [...prev, id]);
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
    const handleCheckAllProductCategories = (id) => {
        if (checkedAllProductCategories === true) {
            setCheckedProductCategories([]);
            return;
        }
        setCheckedAllProductCategories(!checkedAllProductCategories);
        setCheckedProductCategories([]);
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
    const handleCheckAllChargingTypes = (id) => {
        if (checkedAllChargingTypes === true) {
            setCheckedChargingTypes([]);
            return;
        }
        setCheckedAllChargingTypes(!checkedAllChargingTypes);
        setCheckedChargingTypes([]);
    };
    const handleCheckAllHeadPhoneTimeTypes = (id) => {
        if (checkedAllHeadPhoneTimeTypes === true) {
            setCheckedHeadPhoneTimeTypes([]);
            return;
        }
        setCheckedAllHeadPhoneTimeTypes(!checkedAllHeadPhoneTimeTypes);
        setCheckedHeadPhoneTimeTypes([]);
    };
    const handleCheckAllChargingPortTypes = (id) => {
        if (checkedAllChargingPortTypes === true) {
            setCheckedChargingPortTypes([]);
            return;
        }
        setCheckedAllChargingPortTypes(!checkedAllChargingPortTypes);
        setCheckedChargingPortTypes([]);
    };
    const handleCheckAllJackPlugTypes = (id) => {
        if (checkedAllJackPlugTypes === true) {
            setCheckedJackPlugTypes([]);
            return;
        }
        setCheckedAllJackPlugTypes(!checkedAllJackPlugTypes);
        setCheckedJackPlugTypes([]);
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
            if (checkedProductCategories && checkedProductCategories.length > 0) {
                setCheckedAllProductCategories(false);
                listProducts = listProducts.filter((product) => {
                    // Check if the product's brand ID is included in checkedBrands
                    return checkedProductCategories.includes(product.productCategoryCode);
                });
            }
            if (checkedOperatingSystemTypes && checkedOperatingSystemTypes.length > 0) {
                setCheckedAllOperatingSystemTypes(false);
                listProducts = listProducts.filter((product) => {
                    // Check if the product's brand ID is included in checkedOperatingSystemTypes
                    return checkedOperatingSystemTypes.includes(product.operatingSystemProduct.operatingSystemTypeId);
                });
            }
            if (checkedChargingPortTypes && checkedChargingPortTypes.length > 0) {
                setCheckedAllChargingPortTypes(false);
                listProducts = listProducts.filter((product) => {
                    // Check if the product's brand ID is included in checkedChargingPortTypes
                    return checkedChargingPortTypes.includes(product.chargerPortId);
                });
            }
            if (checkedJackPlugTypes && checkedJackPlugTypes.length > 0) {
                setCheckedAllJackPlugTypes(false);
                listProducts = listProducts.filter((product) => {
                    // Check if the product's brand ID is included in checkedJackPlugTypes
                    return checkedJackPlugTypes.includes(product.jackPlugId);
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
            if (checkedChargingTypes && checkedChargingTypes.length > 0) {
                setCheckedAllChargingTypes(false);

                listProducts = listProducts.filter((product) => {
                    const productCapacity = product.charging; // Thay bằng trường dữ liệu chứa dung lượng pin của sản phẩm
                    return checkedChargingTypes.some((pinType) => {
                        const type = dataChargingTypes.find((pin) => pin.id === pinType);
                        return type && productCapacity >= type.minCapacity && productCapacity <= type.maxCapacity;
                    });
                });
            }
            if (checkedHeadPhoneTimeTypes && checkedHeadPhoneTimeTypes.length > 0) {
                setCheckedAllHeadPhoneTimeTypes(false);

                listProducts = listProducts.filter((product) => {
                    const productCapacity = product.headPhoneTime; // Thay bằng trường dữ liệu chứa dung lượng pin của sản phẩm
                    return checkedHeadPhoneTimeTypes.some((pinType) => {
                        const type = dataHeadPhoneTimeTypes.find((pin) => pin.id === pinType);
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
        checkedProductCategories,
        checkedBrands,
        checkedChargingPortTypes,
        checkedJackPlugTypes,
        checkedHeadPhoneTimeTypes,
        checkedPinTypes,
        checkedChargingTypes,
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
        isLoadingPromotionProduct ||
        isLoadingProductCategories ||
        isLoadingChargePorts ||
        isLoadingJackPlugs
    ) {
        <></>;
    }
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
                                    <span>Danh sách phụ kiện</span>
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
                                    <h6 className="font-weight-bold float-left">Loại sản phẩm</h6>
                                </div>
                            </div>
                            <div className="row mt-1 mb-3">
                                <div className="col-lg-6 mt-2">
                                    <div className="form-check" onChange={() => handleCheckAllProductCategories()}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={checkedAllProductCategories}
                                        />
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            Tất cả
                                        </label>
                                    </div>
                                </div>
                                {dataProductCategories &&
                                dataProductCategories.data &&
                                dataProductCategories.data.length > 0 ? (
                                    dataProductCategories.data
                                        .filter((product) => product.code !== 'DIENTHOAI')
                                        .map((item, index) => (
                                            <div className="col-lg-6 mt-2" key={index}>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        onChange={() => handleCheckedProductCategories(item.code)}
                                                        checked={checkedProductCategories.includes(item.code)}
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
                            {checkedProductCategories[0] === 'SACDUPHONG' ? (
                                <>
                                    <div className="row mt-3">
                                        <div className="col-lg-12">
                                            <h6 className="font-weight-bold float-left">Dung lượng pin</h6>
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
                                            <h6 className="font-weight-bold float-left">Công suất sạc</h6>
                                        </div>
                                    </div>
                                    <div className="row mt-1">
                                        <div className="col-lg-6 mt-2">
                                            <div className="form-check" onChange={() => handleCheckAllChargingTypes()}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={checkedAllChargingTypes}
                                                />
                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                    Tất cả
                                                </label>
                                            </div>
                                        </div>
                                        {dataChargingTypes && dataChargingTypes && dataChargingTypes.length > 0 ? (
                                            dataChargingTypes.map((item, index) => (
                                                <div className="col-lg-6 mt-2" key={index}>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            onChange={() => handleCheckedChargingTypes(item.id)}
                                                            checked={checkedChargingTypes.includes(item.id)}
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
                                            <h6 className="font-weight-bold float-left">Cổng sạc</h6>
                                        </div>
                                    </div>
                                    <div className="row mt-1">
                                        <div className="col-lg-6 mt-2">
                                            <div
                                                className="form-check"
                                                onChange={() => handleCheckAllChargingPortTypes()}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={checkedAllChargingPortTypes}
                                                />
                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                    Tất cả
                                                </label>
                                            </div>
                                        </div>
                                        {dataChargePorts && dataChargePorts.data && dataChargePorts.data.length > 0 ? (
                                            dataChargePorts.data.map((item, index) => (
                                                <div className="col-lg-6 mt-2" key={index}>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            onChange={() => handleCheckedChargingPortTypes(item.id)}
                                                            checked={checkedChargingPortTypes.includes(item.id)}
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
                                            <h6 className="font-weight-bold float-left">Jack cắm</h6>
                                        </div>
                                    </div>
                                    <div className="row mt-1">
                                        <div className="col-lg-6 mt-2">
                                            <div className="form-check" onChange={() => handleCheckAllJackPlugTypes()}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={checkedAllJackPlugTypes}
                                                />
                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                    Tất cả
                                                </label>
                                            </div>
                                        </div>
                                        {dataJackPlugs && dataJackPlugs.data && dataJackPlugs.data.length > 0 ? (
                                            dataJackPlugs.data.map((item, index) => (
                                                <div className="col-lg-6 mt-2" key={index}>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            onChange={() => handleCheckedJackPlugTypes(item.id)}
                                                            checked={checkedJackPlugTypes.includes(item.id)}
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
                                </>
                            ) : (
                                <></>
                            )}
                            {checkedProductCategories[0] === 'TAINGHE' ? (
                                <>
                                    <div className="row mt-3">
                                        <div className="col-lg-12">
                                            <h6 className="font-weight-bold float-left">Thời lượng pin</h6>
                                        </div>
                                    </div>
                                    <div className="row mt-1">
                                        <div className="col-lg-12 mt-2">
                                            <div
                                                className="form-check"
                                                onChange={() => handleCheckAllHeadPhoneTimeTypes()}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={checkedAllHeadPhoneTimeTypes}
                                                />
                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                    Tất cả
                                                </label>
                                            </div>
                                        </div>
                                        {dataHeadPhoneTimeTypes &&
                                        dataHeadPhoneTimeTypes &&
                                        dataHeadPhoneTimeTypes.length > 0 ? (
                                            dataHeadPhoneTimeTypes.map((item, index) => (
                                                <div className="col-lg-12 mt-2" key={index}>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            onChange={() => handleCheckedHeadPhoneTimeTypes(item.id)}
                                                            checked={checkedHeadPhoneTimeTypes.includes(item.id)}
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
                                            <h6 className="font-weight-bold float-left">Cổng sạc</h6>
                                        </div>
                                    </div>
                                    <div className="row mt-1">
                                        <div className="col-lg-6 mt-2">
                                            <div
                                                className="form-check"
                                                onChange={() => handleCheckAllChargingPortTypes()}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={checkedAllChargingPortTypes}
                                                />
                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                    Tất cả
                                                </label>
                                            </div>
                                        </div>
                                        {dataChargePorts && dataChargePorts.data && dataChargePorts.data.length > 0 ? (
                                            dataChargePorts.data.map((item, index) => (
                                                <div className="col-lg-6 mt-2" key={index}>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            onChange={() => handleCheckedChargingPortTypes(item.id)}
                                                            checked={checkedChargingPortTypes.includes(item.id)}
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
                                            <h6 className="font-weight-bold float-left">Jack cắm</h6>
                                        </div>
                                    </div>
                                    <div className="row mt-1">
                                        <div className="col-lg-6 mt-2">
                                            <div className="form-check" onChange={() => handleCheckAllJackPlugTypes()}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={checkedAllJackPlugTypes}
                                                />
                                                <label className="form-check-label" htmlFor="defaultCheck1">
                                                    Tất cả
                                                </label>
                                            </div>
                                        </div>
                                        {dataJackPlugs && dataJackPlugs.data && dataJackPlugs.data.length > 0 ? (
                                            dataJackPlugs.data.map((item, index) => (
                                                <div className="col-lg-6 mt-2" key={index}>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            onChange={() => handleCheckedJackPlugTypes(item.id)}
                                                            checked={checkedJackPlugTypes.includes(item.id)}
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
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="col-8">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="section-title">
                                        <h4 className="font-weight-bold float-left">Danh sách phụ kiện</h4>
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
                                filterProducts.filter((product) => product.productCategoryCode !== 'DIENTHOAI').length >
                                    0 ? (
                                    filterProducts
                                        ?.filter((product) => product.productCategoryCode !== 'DIENTHOAI')
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

export default ListAccessoriesClients;
