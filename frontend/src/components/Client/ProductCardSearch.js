import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LINK_PRODUCT_IMAGE } from '~/helpers/constants';

function ProductCardSearch({ product, promotionProductDetails }) {
    const [productVersion, setProductVersion] = useState();
    const [discountedPrice, setDiscountedPrice] = useState(null);
    useEffect(() => {
        if (product) {
            setProductVersion(product.productVersions[0]);

            let promotionDetail = promotionProductDetails.find(
                (x) => x.productVersionId === product.productVersions[0].id,
            );
            console.log(promotionDetail);
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
    console.log(discountedPrice);
    return (
        <>
            <div className="col-3 pt-2 pb-2 d-flex justify-content-center ">
                <img src={LINK_PRODUCT_IMAGE + product.image} alt="" align="center" width="70%" />
            </div>
            <div className="col-8">
                <div className="row">
                    <div className="col-12 p-0 mb-2">
                        <span className="font-weight-bold">{product.name}</span>
                    </div>
                </div>
                <div className="row">
                    {product.productVersions[0].ram &&
                        product.productVersions[0].rom &&
                        product.productVersions.map((item, index) => {
                            return (
                                <div
                                    className={`col-2 d-flex justify-content-center ${
                                        item.id === productVersion?.id
                                            ? 'border border-primary text-primary'
                                            : 'border border-light-custom text-dark'
                                    } p-1 mr-4 rounded`}
                                    onClick={() => handleChangeProductVersion(item)}
                                    style={{ fontSize: '0.8vw', cursor: 'pointer', fontWeight: '700' }}
                                >
                                    {product.isShowRam === true ? <>{item.ram.name}GB</> : <>{item.rom.name}GB</>}
                                </div>
                            );
                        })}
                </div>
                <div className="row mt-3">
                    <div className="col-12 pl-0">
                        {discountedPrice && discountedPrice !== null ? (
                            <div>
                                <h6 style={{ color: '#d70018' }} className="gia">
                                    {String(discountedPrice).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                    <sup>đ</sup>
                                </h6>
                                <h6
                                    style={{
                                        textDecoration: 'line-through', // Gạch ngang chữ
                                        color: '#6c757d', // Màu chữ xám
                                        fontWeight: 300, // Font-weight nhẹ (light)
                                    }}
                                    className="gia"
                                >
                                    {String(productVersion?.priceOut).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                    <sup>đ</sup>
                                </h6>
                            </div>
                        ) : (
                            <>
                                <h6 style={{ color: '#d70018' }} className="gia">
                                    {String(productVersion?.priceOut).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                    <sup>đ</sup>
                                </h6>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductCardSearch;
