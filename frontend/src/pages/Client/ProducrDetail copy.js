import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '~/components/Client/ProductCard';
import { LINK_PRODUCT_IMAGE, LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE } from '~/helpers/constants';
import { stringToSlug } from '~/helpers/covertString';
import { useProductByIdClientData, useProductsClientData } from '~/hooks/react-query/client/pageData';
import CartSlice from '~/redux/Slices/CartSlice';
function ProductDetail() {
    const [slideImages, setSlideImages] = useState([]);
    const [productSample, setProductSample] = useState();
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const dispatch = useDispatch();
    const { isLoading, data, isError, error } = useProductByIdClientData(id);
    useEffect(() => {
        if (data && data.data) {
            console.log(data.data);
            window.scrollTo(0, 0);
            setSlideImages([data.data.image]);
            setProductSample(data.data.productSamples[0]);
        }
    }, [data]);
    const handleClickChangeSlideImages = (id) => {
        let productSample = data.data.productSamples.find((x) => x.id === id);
        if (productSample) {
            setSlideImages(productSample.photos);
        }
        // const mainRoot = document.getElementById('locationSlideImages');
        // mainRoot.scrollIntoView({ block: 'center' });
    };
    const handleClickChangeProductSample = (id) => {
        let productSample = data.data.productSamples.find((x) => x.id === id);
        if (productSample) {
            setQuantity(1);
            setProductSample(productSample);
        }
    };
    const handleClickChangeSlideImageDefault = (id) => {
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
            priceOut: data.data.priceOut,
            productName: data.data.name,
            quantityCart: quantity,
        };
        dispatch(CartSlice.actions.addProduct(productaddtoCart));
    };
    if (isLoading) {
        return <></>;
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
                                    {slideImages && slideImages.length === 1 ? (
                                        <>
                                            <img
                                                style={{ maxWidth: '83%' }}
                                                className="product__details__pic__item--large"
                                                src={LINK_PRODUCT_IMAGE + data.data.image}
                                                alt=""
                                            />
                                        </>
                                    ) : (
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
                                    )}
                                </div>
                                <div className="row d-flex justify-content-center mt-5">
                                    <button
                                        className="btn btn-info mr-2 mt-3"
                                        onClick={() => handleClickChangeSlideImageDefault()}
                                    >
                                        Mặc định
                                    </button>
                                    {data && data.data.productSamples.length > 0 ? (
                                        data.data.productSamples.map((item, index) => (
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
                                    <img
                                        style={{ cursor: 'pointer' }}
                                        src="https://media.istockphoto.com/id/694311040/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-360-%C4%91%E1%BB%99-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng-d%E1%BA%A5u-hi%E1%BB%87u-360-%C4%91%E1%BB%99.jpg?s=1024x1024&w=is&k=20&c=PaCOH3hlbLmg6izQ8Hgq1YQ9lmDCIdCv-1GBq30Cy94="
                                        alt=""
                                        width="20%"
                                        className="ml-2 mt-3"
                                    />
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
                                <div className="product__details__price">
                                    {String(data.data?.priceOut).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                    <sup>đ</sup>
                                </div>
                                <div className="row">
                                    {data && data.data.productSamples.length > 0 ? (
                                        data.data.productSamples.map((item, index) => (
                                            <p
                                                onClick={() => handleClickChangeProductSample(item.id)}
                                                className={`ml-3 ${
                                                    productSample && productSample.id === item.id
                                                        ? 'btn btn-dark text-light border'
                                                        : 'btn btn-light border'
                                                }`}
                                            >
                                                {item.colorProduct.name}
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
                                        <b>Số lượng: </b>{' '}
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
                        <div className="row">
                            <div className="col-lg-7">
                                <br />
                                <h5 style={{ fontSize: 27, fontWeight: 600, color: '#d70018' }}>ĐẶT ĐIỂM NỔI BẬT</h5>
                                <br />
                                <div dangerouslySetInnerHTML={{ __html: data.data?.infomation }} />
                            </div>
                            <div className="col-lg-5">
                                <h5 style={{ fontSize: 27, fontWeight: 600, marginTop: 18 }}>Thông số kỹ thuật</h5>
                                <br />
                                <div className="table table-striped">
                                    <div dangerouslySetInnerHTML={{ __html: data.data?.technicalDetail }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ProductDetail;
