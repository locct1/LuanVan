import { forEach } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ImageProduct360Modal from '~/components/Client/ImageProduct360Modal';
import ProductCard from '~/components/Client/ProductCard';
import ReviewProduct from '~/components/Client/ReviewProduct';
import { LINK_PRODUCT_IMAGE, LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE } from '~/helpers/constants';
import { stringToSlug } from '~/helpers/covertString';
import {
    useProductByIdClientData,
    useProductSamplesClientData,
    useProductsClientData,
    usePromotionProductsClientData,
    useShockDealsClientData,
} from '~/hooks/react-query/client/pageData';
import { usePhotosByProductIdData } from '~/hooks/react-query/productsampleData';
import { useShockDealsData } from '~/hooks/react-query/shockdealData';
import useScript from '~/hooks/useScript';
import CartSlice from '~/redux/Slices/CartSlice';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};
function ProductDetail() {
    // useScript('https://cdn.scaleflex.it/plugins/js-cloudimage-360-view/2.7.1/js-cloudimage-360-view.min.js');
    const [expanded, setExpanded] = useState(false);
    const { isLoading: isLoadingListProducts, data: dataListProducts } = useProductsClientData();
    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const showMoreButton = (
        <div className="row d-flex justify-content-center">
            {' '}
            <button className="btn btn-info" onClick={toggleExpanded}>
                {expanded ? 'Thu gọn' : 'Xem thêm'}
            </button>
        </div>
    );
    const [slideImages, setSlideImages] = useState([]);
    const [productVersion, setProductVersion] = useState();
    const [productSample, setProductSample] = useState();
    const [productColorProduct, setProductColorProduct] = useState();
    const [discountedPrice, setDiscountedPrice] = useState(null);
    const [listShockDeals, setListShockDeals] = useState([]);
    const [selectedListShockDeals, setSelectedListShockDeals] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const dispatch = useDispatch();
    const { isLoading, data, isError, error } = useProductByIdClientData(id);
    const { isLoading: isLoadingProductSamples, data: dataProductSamples } = useProductSamplesClientData();
    const { isLoading: isLoadingPromotionProduct, data: dataPromotionProducts } = usePromotionProductsClientData();
    const { isLoading: isLoadingShockDetails, data: dataShockDetails } = useShockDealsClientData();
    const { isLoading: isLoadingPhotosByProductId, data: dataPhotosByProductId } = usePhotosByProductIdData(id);
    const [show, setShow] = useState(false);
    const [imageProduct360, setImageProduct360] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [promotionProductDetails, setPromotionProductDetails] = useState([]);
    useEffect(() => {
        if (
            data &&
            data.data &&
            dataProductSamples &&
            dataProductSamples.data &&
            dataPromotionProducts &&
            dataShockDetails &&
            dataShockDetails.data
        ) {
            window.scrollTo(0, 0);
            setSlideImages([data.data.image]);
            setProductVersion(data.data.productVersions[0]);
            setProductColorProduct(data.data.productColorProducts[0]);
            let productSample = dataProductSamples.data.find(
                (x) =>
                    x.productVersionId === data.data.productVersions[0].id &&
                    x.colorProductId === data.data.productColorProducts[0].colorProductId,
            );

            if (productSample) {
                setProductSample(productSample);
            }
            let list = [];
            dataPromotionProducts.data.forEach((promotion) => {
                promotion.promotionProductDetails.forEach((detail) => {
                    list.push(detail);
                });
            });
            setPromotionProductDetails(list);
            let promotionDetail = list.find((x) => x.productVersionId === data.data.productVersions[0].id);
            if (promotionDetail) {
                setDiscountedPrice(promotionDetail.discountedPrice);
            }
            //shock Deals
            let listShockDeals = [];
            dataShockDetails.data.forEach((shockDeal) => {
                shockDeal.shockDealDetails.forEach((detail) => {
                    listShockDeals.push(detail);
                });
            });

            const listFilterShockDeal = listShockDeals.filter((x) => x.mainProductId === data.data.id);

            setListShockDeals(listFilterShockDeal);
            setSelectedListShockDeals(listFilterShockDeal);
        }
    }, [data, dataProductSamples, dataPromotionProducts]);
    const handleClickChangeSlideImages = (id) => {
        let productColorProduct = data.data.productColorProducts.find((x) => x.id === id);
        setImageProduct360(null);
        if (productColorProduct) {
            setSlideImages(productColorProduct.photos);
        }
        // const mainRoot = document.getElementById('locationSlideImages');
        // mainRoot.scrollIntoView({ block: 'center' });
    };
    const handleClickChangeProductVersion = (id) => {
        let findProductVersion = data.data.productVersions.find((x) => x.id === id);
        let productSample = dataProductSamples.data.find(
            (x) =>
                x.productVersionId === findProductVersion.id && x.colorProductId === productColorProduct.colorProductId,
        );
        setProductSample(productSample);

        if (findProductVersion) {
            setQuantity(1);
            setProductVersion(findProductVersion);
        }
        let promotionDetail = promotionProductDetails.find((x) => x.productVersionId === findProductVersion.id);
        if (promotionDetail) {
            setDiscountedPrice(promotionDetail.discountedPrice);
        } else {
            setDiscountedPrice(null);
        }
    };
    const handleClickChangeProductColorProduct = (id) => {
        let findProductColorProduct = data.data.productColorProducts.find((x) => x.id === id);
        setSlideImages([findProductColorProduct.fileName]);
        let productSample = dataProductSamples.data.find(
            (x) =>
                x.productVersionId === productVersion.id && x.colorProductId === findProductColorProduct.colorProductId,
        );
        setProductSample(productSample);
        if (findProductColorProduct) {
            setQuantity(1);
            setProductColorProduct(findProductColorProduct);
        }
    };
    const handleClickChangeSlideImageDefault = (id) => {
        setImageProduct360(null);
        setSlideImages([data.data.image]);
        // const mainRoot = document.getElementById('locationSlideImages');
        // mainRoot.scrollIntoView({ block: 'center' });
    };
    const handleChangeQuantity = (e) => {
        setQuantity(e.target.value);
    };

    const handleChangeQuantityMinus = () => {
        if (parseInt(quantity) === 1) {
            return;
        }
        setQuantity(parseInt(quantity) - 1);
    };
    const handleChangeQuantityPlus = () => {
        setQuantity(parseInt(quantity) + 1);
    };
    const handleAddProductToCart = () => {
        if (productSample === undefined || productSample === null) {
            toast.warning('Vui lòng chọn màu sản phẩm');
            return;
        }
        let productaddtoCart = {
            ...productSample,
            gift: false,
            fileName: productColorProduct.fileName,
            priceOut: productSample.productVersion.priceOut,
            productName: data.data.name,
            height: data.data.height,
            weight: data.data.weight,
            width: data.data.width,
            length: data.data.length,
            discountedPrice: discountedPrice !== null ? discountedPrice : null,
            quantityCart: quantity,
        };
        dispatch(CartSlice.actions.addProduct(productaddtoCart));
        selectedListShockDeals.forEach((shockDeal) => {
            let productShockDeal = {
                productId: shockDeal.productShockDeal.id,
                productMainId: productSample.id,
                fileName: shockDeal.productShockDeal.image,
                gift: true,
                priceOut: shockDeal.productShockDeal.productVersions[0].priceOut,
                productVersionId: shockDeal.productShockDeal.productVersions[0].id,
                shockDealPrice: shockDeal.shockDealPrice,
                productName: shockDeal.productShockDeal.name,
                height: shockDeal.productShockDeal.height,
                weight: shockDeal.productShockDeal.weight,
                width: shockDeal.productShockDeal.width,
                length: shockDeal.productShockDeal.length,
                discountedPrice: null,
                quantityCart: quantity,
            };
            dispatch(CartSlice.actions.addShockDealProduct(productShockDeal));
        });
    };
    const handleClickShowImageProduct360 = async () => {
        setSlideImages([data.data.image]);
        let scriptToRemove = document.querySelector(
            'script[src="https://cdn.scaleflex.it/plugins/js-cloudimage-360-view/2.7.1/js-cloudimage-360-view.min.js"]',
        );

        if (scriptToRemove) {
            scriptToRemove.parentNode.removeChild(scriptToRemove);
        }
        if (dataPhotosByProductId && dataPhotosByProductId.data.length > 0) {
            let tenTep = dataPhotosByProductId.data[0].fileName.split('.')[0];

            let lastIndex = tenTep.lastIndexOf('-');

            let phanTruocDauHienCuoiCung = tenTep.substring(0, lastIndex);

            let duoiFile = dataPhotosByProductId.data[0].fileName.split('.').pop();
            let data = {
                fileName: phanTruocDauHienCuoiCung,
                extension: duoiFile,
            };
            const script = document.createElement('script');
            script.src = 'https://cdn.scaleflex.it/plugins/js-cloudimage-360-view/2.7.1/js-cloudimage-360-view.min.js';
            script.async = false;
            document.body.appendChild(script);
            setImageProduct360(data);
            // handleShow();
        }
    };
    const handleChange = (item) => {
        if (selectedListShockDeals.some((selectedItem) => selectedItem.id === item.id)) {
            setSelectedListShockDeals(selectedListShockDeals.filter((value) => value.id !== item.id));
        } else {
            setSelectedListShockDeals([...selectedListShockDeals, item]);
        }
    };
    if (
        isLoading ||
        isLoadingListProducts ||
        isLoadingProductSamples ||
        isLoadingPromotionProduct ||
        isLoadingPhotosByProductId ||
        isLoadingShockDetails
    ) {
        return <></>;
    }
    console.log(slideImages);
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
                                    <Link to="/">Điện thoại</Link>
                                    <span>{data?.data.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="product-details spad" style={{ paddingTop: '35px' }}>
                <div className="container">
                    <hr></hr>
                    <div className="row">
                        <div className="col-lg-5 col-md-5">
                            <div className="product__details__pic">
                                <div className="product__details__pic__item" id="locationSlideImages">
                                    {imageProduct360 && (
                                        <>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-lg-12 col-md-12">
                                                        <div>
                                                            <div
                                                                className="cloudimage-360"
                                                                data-folder="https://localhost:7077/Uploads/ImageProduct360/"
                                                                data-filename={`${imageProduct360.fileName}-{index}.${imageProduct360.extension}`}
                                                                data-amount={36}
                                                                data-box-shadow="inset 0 0 100px #222"
                                                                data-bottom-circle="true"
                                                                data-autoplay="true"
                                                                data-magnifier={2}
                                                                data-full-screen="true"
                                                            >
                                                                <button className="cloudimage-360-prev" />
                                                                <button className="cloudimage-360-next" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {slideImages && slideImages.length === 1 && imageProduct360 === null ? (
                                        <>
                                            <img
                                                style={{ maxWidth: '83%' }}
                                                className="product__details__pic__item--large"
                                                src={
                                                    data.data.image === slideImages[0]
                                                        ? LINK_PRODUCT_IMAGE + data.data.image
                                                        : LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE + slideImages[0]
                                                }
                                                alt=""
                                            />
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {slideImages && slideImages.length > 1 && imageProduct360 === null ? (
                                        <>
                                            <div id="demo" className="carousel slide" data-ride="carousel">
                                                {/* Indicators */}
                                                {/* <ul className="carousel-indicators">
                                                    {slideImages && slideImages.length > 0 ? (
                                                        slideImages.map((item, index) => (
                                                            <>
                                                                <li
                                                                    key={index}
                                                                    data-target="#demo"
                                                                    data-slide-to={index}
                                                                    className={index === 0 ? 'active' : ''}
                                                                />
                                                            </>
                                                        ))
                                                    ) : (
                                                        <p>Chưa có sản phẩm nào.</p>
                                                    )}
                                                </ul> */}
                                                {/* The slideshow */}
                                                <div className="carousel-inner">
                                                    {slideImages && slideImages.length > 0 ? (
                                                        slideImages.map((item, index) => (
                                                            <>
                                                                <div
                                                                    data-interval={3000}
                                                                    className={`carousel-item ${
                                                                        index === 0 ? 'active' : ''
                                                                    }`}
                                                                >
                                                                    <img
                                                                        src={
                                                                            LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE +
                                                                            item.fileName
                                                                        }
                                                                        alt="Los Angeles"
                                                                        width={1100}
                                                                        height={500}
                                                                    />
                                                                </div>
                                                            </>
                                                        ))
                                                    ) : (
                                                        <p>Chưa có sản phẩm nào.</p>
                                                    )}
                                                </div>
                                                {/* Left and right controls */}
                                                <a className="carousel-control-prev" href="#demo" data-slide="prev">
                                                    <i className="fa fa-chevron-left" />
                                                </a>
                                                <a className="carousel-control-next" href="#demo" data-slide="next">
                                                    <i className="fa fa-chevron-right" />
                                                </a>
                                            </div>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="row d-flex justify-content-center mt-5">
                                    <button
                                        className="btn btn-info mr-2 mt-3"
                                        onClick={() => handleClickChangeSlideImageDefault()}
                                    >
                                        Mặc định
                                    </button>
                                    {data && data.data.productColorProducts.length > 0 ? (
                                        data.data.productColorProducts.map((item, index) => (
                                            <>
                                                <img
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleClickChangeSlideImages(item.id)}
                                                    src={LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE + item.fileName}
                                                    alt=""
                                                    width="20%"
                                                    className="mt-3"
                                                />
                                            </>
                                        ))
                                    ) : (
                                        <p>Chưa có sản phẩm nào.</p>
                                    )}
                                    {dataPhotosByProductId && dataPhotosByProductId.data.length > 0 ? (
                                        <img
                                            onClick={() => handleClickShowImageProduct360()}
                                            style={{ cursor: 'pointer' }}
                                            src="https://media.istockphoto.com/id/694311040/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-360-%C4%91%E1%BB%99-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng-d%E1%BA%A5u-hi%E1%BB%87u-360-%C4%91%E1%BB%99.jpg?s=1024x1024&w=is&k=20&c=PaCOH3hlbLmg6izQ8Hgq1YQ9lmDCIdCv-1GBq30Cy94="
                                            alt=""
                                            width="20%"
                                            className="ml-2 mt-3"
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-7">
                            <div className="product__details__text">
                                <h3>{data?.data.name}</h3>
                                {/* <div className="product__details__rating">
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star-half-o" />
                                    <span>(18 reviews)</span>
                                </div> */}
                                <div className="d-flex">
                                    {discountedPrice && discountedPrice !== null ? (
                                        <>
                                            <div className="product__details__price mr-3">
                                                {String(discountedPrice).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                                <sup>đ</sup>
                                            </div>
                                            <div
                                                className="product__details__price"
                                                style={{
                                                    textDecoration: 'line-through', // Gạch ngang chữ
                                                    color: '#6c757d', // Màu chữ xám
                                                    fontWeight: 300,
                                                    fontSize: '24px', // Font-weight nhẹ (light)
                                                }}
                                            >
                                                {String(productVersion?.priceOut).replace(
                                                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                    '$1,',
                                                )}
                                                <sup>đ</sup>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="product__details__price">
                                                {String(productVersion?.priceOut).replace(
                                                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                    '$1,',
                                                )}
                                                <sup>đ</sup>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="row">
                                    {data &&
                                    data.data.productVersions.length > 0 &&
                                    data.data.productVersions[0].ram &&
                                    data.data.productVersions[0].rom ? (
                                        data.data.productVersions.map((item, index) => (
                                            <p
                                                onClick={() => handleClickChangeProductVersion(item.id)}
                                                className={`ml-3 ${
                                                    productVersion && productVersion.id === item.id
                                                        ? 'btn btn-dark text-light border'
                                                        : 'btn btn-light border'
                                                }`}
                                            >
                                                <span className="ram-rom-separator">
                                                    {item.ram?.name}GB
                                                    <span>-</span>
                                                    {item.rom?.name}GB
                                                </span>
                                            </p>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="row">
                                    {data && data.data.productColorProducts.length > 0 ? (
                                        data.data.productColorProducts.map((item, index) => (
                                            <p
                                                onClick={() => handleClickChangeProductColorProduct(item.id)}
                                                className={`ml-3 ${
                                                    productColorProduct && productColorProduct.id === item.id
                                                        ? 'btn btn-dark text-light border'
                                                        : 'btn btn-light border'
                                                }`}
                                            >
                                                <span className="ram-rom-separator">{item.colorProduct?.name}</span>
                                            </p>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="product__details__quantity">
                                    <div className="quantity">
                                        <div className="pro-qty">
                                            <i
                                                onClick={() => handleChangeQuantityMinus()}
                                                className="fa fa-minus"
                                                style={{ cursor: 'pointer' }}
                                            ></i>
                                            <input
                                                type="text"
                                                defaultValue={1}
                                                value={quantity}
                                                onChange={(e) => handleChangeQuantity(e)}
                                            />
                                            <i
                                                onClick={() => handleChangeQuantityPlus()}
                                                className="fa fa-plus"
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button href="#" className="btn btn-danger" onClick={() => handleAddProductToCart()}>
                                    Thêm vào giỏ hàng
                                </button>
                                <ul>
                                    <li>
                                        <b>Số lượng: </b>
                                        <span>
                                            {productSample ? productSample.quantity : 'Vui lòng chọn màu điện thoại'}
                                        </span>
                                    </li>
                                    <li>
                                        <b>Thương hiệu</b> <span>{data?.data.brand.name}</span>
                                    </li>
                                    <li>
                                        <b>Vận chuyển</b>{' '}
                                        <span>
                                            Trong ngày <samp>Miễn phí vận chuyển ngay hôm nay</samp>
                                        </span>
                                    </li>
                                    <li>
                                        <b>Chia sẻ</b>
                                        <div class="share">
                                            <a href="#">
                                                <i class="fa fa-facebook"></i>
                                            </a>
                                            <a href="#">
                                                <i class="fa fa-twitter"></i>
                                            </a>
                                            <a href="#">
                                                <i class="fa fa-instagram"></i>
                                            </a>
                                            <a href="#">
                                                <i class="fa fa-pinterest"></i>
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div>
                        <hr />
                        <div className="row  justify-content-center">
                            <div className="col-8">
                                {listShockDeals && listShockDeals.length > 0 && (
                                    <>
                                        <div className="card mt-3">
                                            <div className="card-header text-center">
                                                <h5>Ưu đãi khi mua kèm</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-3">
                                                        <img src={LINK_PRODUCT_IMAGE + data.data.image} />
                                                    </div>
                                                    <div className="col-9">
                                                        <h5>
                                                            {data?.data.name}{' '}
                                                            {data.data.isShowRam === true ? (
                                                                <>
                                                                    {productVersion?.ram &&
                                                                    productVersion.ram.name !== null ? (
                                                                        <>
                                                                            {productVersion.ram.name}GB-
                                                                            {productVersion.rom.name}GB
                                                                        </>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {productVersion.rom &&
                                                                    productVersion.rom.name !== null ? (
                                                                        <>
                                                                            {productVersion.ram.name}GB-
                                                                            {productVersion.rom.name}GB
                                                                        </>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </>
                                                            )}
                                                        </h5>
                                                        {discountedPrice && discountedPrice !== null ? (
                                                            <>
                                                                <div className="d-flex">
                                                                    {' '}
                                                                    <div
                                                                        className="product__details__price mr-3 mt-1"
                                                                        style={{
                                                                            color: '#dd2222',
                                                                            fontSize: '15px',
                                                                            fontWeight: '700',
                                                                            marginBottom: '0px', // Font-weight nhẹ (light)
                                                                        }}
                                                                    >
                                                                        {String(discountedPrice).replace(
                                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                            '$1,',
                                                                        )}
                                                                        <sup>đ</sup>
                                                                    </div>
                                                                    <div
                                                                        className="product__details__price mt-1"
                                                                        style={{
                                                                            textDecoration: 'line-through', // Gạch ngang chữ
                                                                            color: '#6c757d', // Màu chữ xám
                                                                            fontWeight: 300,
                                                                            fontSize: '15px', // Font-weight nhẹ (light)
                                                                        }}
                                                                    >
                                                                        {String(productVersion?.priceOut).replace(
                                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                            '$1,',
                                                                        )}
                                                                        <sup>đ</sup>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div
                                                                    className="product__details__price mt-1"
                                                                    style={{
                                                                        color: '#dd2222',
                                                                        fontWeight: '700',
                                                                        fontSize: '15px', // Font-weight nhẹ (light)
                                                                    }}
                                                                >
                                                                    {String(productVersion?.priceOut).replace(
                                                                        /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                        '$1,',
                                                                    )}
                                                                    <sup>đ</sup>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                {listShockDeals && listShockDeals.length > 0 ? (
                                                    listShockDeals.map((item, index) => (
                                                        <div className="row mt-4" key={item.id}>
                                                            <div className="col-3">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    onChange={() => handleChange(item)}
                                                                    checked={selectedListShockDeals.some(
                                                                        (selectedItem) => selectedItem.id === item.id,
                                                                    )}
                                                                />
                                                                <img
                                                                    src={
                                                                        LINK_PRODUCT_IMAGE + item.productShockDeal.image
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="col-9">
                                                                <h5>{item.productShockDeal.name} </h5>

                                                                <div className="d-flex">
                                                                    <div
                                                                        className="product__details__price mr-3 mt-1"
                                                                        style={{
                                                                            color: '#dd2222',
                                                                            fontWeight: '700',
                                                                            fontSize: '15px',
                                                                            marginBottom: '0px', // Font-weight nhẹ (light)
                                                                        }}
                                                                    >
                                                                        {String(item.shockDealPrice).replace(
                                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                            '$1,',
                                                                        )}
                                                                        <sup>đ</sup>
                                                                    </div>
                                                                    <div
                                                                        className="product__details__price mt-1"
                                                                        style={{
                                                                            textDecoration: 'line-through', // Gạch ngang chữ
                                                                            color: '#6c757d', // Màu chữ xám
                                                                            fontWeight: 300,
                                                                            fontSize: '15px', // Font-weight nhẹ (light)
                                                                        }}
                                                                    >
                                                                        {String(
                                                                            item.productShockDeal.productVersions[0]
                                                                                ?.priceOut,
                                                                        ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                                                        <sup>đ</sup>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                            <div class="card-footer text-muted">
                                                <h6>
                                                    Tổng tiền:{' '}
                                                    {discountedPrice && discountedPrice !== null ? (
                                                        <>
                                                            <span
                                                                className="mr-2"
                                                                style={{
                                                                    color: '#dd2222', // Màu chữ xám
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                {' '}
                                                                {String(
                                                                    discountedPrice +
                                                                        selectedListShockDeals.reduce(
                                                                            (total, deal) =>
                                                                                total + deal.shockDealPrice,
                                                                            0,
                                                                        ),
                                                                ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                                                <sup>đ</sup>
                                                            </span>
                                                            <span
                                                                style={{
                                                                    textDecoration: 'line-through', // Gạch ngang chữ
                                                                    color: '#6c757d', // Màu chữ xám
                                                                    fontWeight: 300,
                                                                    fontSize: '15px', // Font-weight nhẹ (light)
                                                                }}
                                                            >
                                                                {' '}
                                                                {String(
                                                                    productVersion?.priceOut +
                                                                        selectedListShockDeals.reduce(
                                                                            (total, deal) =>
                                                                                total +
                                                                                deal.productShockDeal.productVersions[0]
                                                                                    .priceOut,
                                                                            0,
                                                                        ),
                                                                ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                                                <sup>đ</sup>
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {' '}
                                                            <span
                                                                className="mr-2"
                                                                style={{
                                                                    color: '#dd2222', // Màu chữ xám
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                {' '}
                                                                {String(
                                                                    productVersion?.priceOut +
                                                                        selectedListShockDeals.reduce(
                                                                            (total, deal) =>
                                                                                total + deal.shockDealPrice,
                                                                            0,
                                                                        ),
                                                                ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                                                <sup>đ</sup>
                                                            </span>
                                                            <span
                                                                style={{
                                                                    textDecoration: 'line-through', // Gạch ngang chữ
                                                                    color: '#6c757d', // Màu chữ xám
                                                                    fontWeight: 300,
                                                                    fontSize: '15px', // Font-weight nhẹ (light)
                                                                }}
                                                            >
                                                                {' '}
                                                                {String(
                                                                    productVersion?.priceOut +
                                                                        selectedListShockDeals.reduce(
                                                                            (total, deal) =>
                                                                                total +
                                                                                deal.productShockDeal.productVersions[0]
                                                                                    .priceOut,
                                                                            0,
                                                                        ),
                                                                ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                                                <sup>đ</sup>
                                                            </span>
                                                        </>
                                                    )}
                                                </h6>
                                            </div>
                                        </div>
                                        <hr />
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="container">
                            <div className="row mt-3">
                                <div className="col-12">
                                    <h4 className="font-weight-bold">Sản phẩm tương tự</h4>
                                </div>
                            </div>
                            <div className="row featured__filter">
                                <div className="col-12">
                                    <Carousel responsive={responsive}>
                                        {dataListProducts && dataListProducts.data.length > 0 ? (
                                            dataListProducts.data
                                                ?.filter((product) => product.brandId === data.data.brandId)
                                                .map((item, index) => (
                                                    <div className="mt-5" key={item.id}>
                                                        <ProductCard
                                                            product={item}
                                                            promotionProductDetails={promotionProductDetails}
                                                        />
                                                    </div>
                                                ))
                                        ) : (
                                            <></>
                                        )}
                                    </Carousel>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-8">
                                <br />
                                <h5 style={{ fontSize: 27, fontWeight: 600, color: '#d70018' }}>ĐẶT ĐIỂM NỔI BẬT</h5>
                                <br />
                                <div className="text-justify">
                                    {expanded ? (
                                        <div dangerouslySetInnerHTML={{ __html: data.data?.infomation }} />
                                    ) : (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: data.data?.infomation.slice(0, 700) + '.........', // Hiển thị một phần ban đầu
                                            }}
                                        />
                                    )}
                                    {data.data?.infomation.length > 500 && showMoreButton}
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <h5 style={{ fontSize: 27, fontWeight: 600, marginTop: 18 }}>Thông số kỹ thuật</h5>
                                <br />
                                <table class="table table-striped">
                                    <tbody>
                                        {data.data?.operatingSystemProduct?.name && (
                                            <tr>
                                                <td>Hệ điều hành:</td>
                                                <td> {data.data?.operatingSystemProduct?.name}</td>
                                            </tr>
                                        )}
                                        {data.data.screenTechnology?.name &&
                                            data.data.screenWidth &&
                                            data.data.resolution && (
                                                <tr>
                                                    <td>Màn hình:</td>
                                                    <td>
                                                        {data.data.screenTechnology.name}, {data.data.screenWidth},{' '}
                                                        {data.data.resolution}
                                                    </td>
                                                </tr>
                                            )}
                                        {data.data?.rearCamera && (
                                            <tr>
                                                <td>Camera sau:</td>
                                                <td>{data.data?.rearCamera}</td>
                                            </tr>
                                        )}
                                        {data.data?.frontCamera && (
                                            <tr>
                                                <td>Camera trước:</td>
                                                <td>{data.data?.frontCamera}</td>
                                            </tr>
                                        )}
                                        {data.data?.chip?.name && (
                                            <tr>
                                                <td>Chip:</td>
                                                <td>{data.data?.chip?.name}</td>
                                            </tr>
                                        )}
                                        {data.data?.sim && (
                                            <tr>
                                                <td>Sim:</td>
                                                <td>{data.data?.sim}</td>
                                            </tr>
                                        )}
                                        {productVersion?.ram?.name && (
                                            <tr>
                                                <td>RAM:</td>
                                                <td>{productVersion?.ram?.name}GB</td>
                                            </tr>
                                        )}

                                        {productVersion?.rom?.name && (
                                            <tr>
                                                <td>Dung lượng lưu trữ: :</td>
                                                <td>{productVersion.rom.name}GB</td>
                                            </tr>
                                        )}
                                        {data.data?.battery && data.data?.charging && (
                                            <tr>
                                                <td>Pin/Công suất sạc:</td>
                                                <td>
                                                    {data.data?.battery} mAh, {data.data?.charging} W
                                                </td>
                                            </tr>
                                        )}
                                        {data.data?.headPhoneTime && (
                                            <tr>
                                                <td>Thời gian sử dụng:</td>
                                                <td>{data.data?.headPhoneTime} giờ</td>
                                            </tr>
                                        )}
                                        {data.data?.chargerPort?.name && (
                                            <tr>
                                                <td>Cổng sạc:</td>
                                                <td>{data.data?.chargerPort?.name}</td>
                                            </tr>
                                        )}
                                        {data.data?.jackPlug?.name && (
                                            <tr>
                                                <td>Jack cắm:</td>
                                                <td>{data.data?.jackPlug?.name}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {data?.data && <ReviewProduct product={data?.data} />}
        </>
    );
}

export default ProductDetail;
