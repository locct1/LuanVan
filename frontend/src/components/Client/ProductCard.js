import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LINK_PRODUCT_IMAGE } from '~/helpers/constants';

function ProductCard({ product, promotionProductDetails }) {
    const [productVersion, setProductVersion] = useState();
    const [discountedPrice, setDiscountedPrice] = useState(null);
    useEffect(() => {
        if (product) {
            setProductVersion(product.productVersions[0]);

            let promotionDetail = promotionProductDetails.find(
                (x) => x.productVersionId === product.productVersions[0].id,
            );
            if (promotionDetail) {
                setDiscountedPrice(promotionDetail.discountedPrice);
            }
        }
    }, [product, promotionProductDetails]);
    const handleChangeProductVersion = (data) => {
        setProductVersion(data);
        let promotionDetail = promotionProductDetails.find((x) => x.productVersionId === data.id);
        if (promotionDetail) {
            setDiscountedPrice(promotionDetail.discountedPrice);
        } else {
            setDiscountedPrice(null);
        }
    };
    return (
        <>
            <div className="featured__item ">
                <div
                    className="featured__item__pic zoom set-bg"
                    data-setbg={LINK_PRODUCT_IMAGE + product.image}
                    style={{
                        backgroundImage: 'url(' + LINK_PRODUCT_IMAGE + product.image + ')',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <ul className="featured__item__pic__hover">
                        <li>
                            <a href="#">
                                <i className="fa fa-heart"></i>
                            </a>
                        </li>
                        <li>
                            <Link to={`/product-detail/${product.id}`}>
                                <i className="fa fa-eye"></i>
                            </Link>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fa fa-shopping-cart"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="featured__item__text">
                    <h6>
                        <a href="#">{product.name}</a>
                    </h6>
                    <h6>
                        <div className="row justify-content-center">
                            {product.productVersions[0].ram &&
                                product.productVersions[0].rom &&
                                product.productVersions.map((item, index) => {
                                    return (
                                        <div
                                            className={`col-3 ${
                                                item.id === productVersion?.id
                                                    ? 'border border-primary text-primary'
                                                    : 'border border-light-custom text-dark'
                                            } p-1 ml-2 rounded`}
                                            onClick={() => handleChangeProductVersion(item)}
                                            style={{ fontSize: '0.8vw', cursor: 'pointer' }}
                                        >
                                            {product.isShowRam === true ? (
                                                <>
                                                    {item.ram && item.ram.name !== null ? (
                                                        <>{item.ram.name}GB</>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {item.rom && item.rom.name !== null ? (
                                                        <>{item.rom.name}GB</>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </h6>
                    {discountedPrice && discountedPrice !== null ? (
                        <div>
                            <h5 style={{ color: '#d70018' }} className="gia">
                                {String(discountedPrice).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                <sup>đ</sup>
                            </h5>
                            <h5
                                style={{
                                    textDecoration: 'line-through', // Gạch ngang chữ
                                    color: '#6c757d', // Màu chữ xám
                                    fontWeight: 300, // Font-weight nhẹ (light)
                                }}
                                className="gia"
                            >
                                {String(productVersion?.priceOut).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                <sup>đ</sup>
                            </h5>
                        </div>
                    ) : (
                        <>
                            <h5 style={{ color: '#d70018' }} className="gia">
                                {String(productVersion?.priceOut).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                <sup>đ</sup>
                            </h5>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default ProductCard;
