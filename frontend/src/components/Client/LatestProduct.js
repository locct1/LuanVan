import useScript from '~/hooks/useScript';
import LatestProductCard from './LatestProductCard';
import { shuffleArray } from '~/helpers/shuffleArray';
import { LINK_APP_FRONTEND } from '~/helpers/constants';
function LastestProduct({ listProducts, promotionProductDetails }) {
    // useScript(LINK_APP_FRONTEND + 'js/client/jquery-3.3.1.min.js');
    // useScript(LINK_APP_FRONTEND + 'js/client/bootstrap.min.js');
    // // useScript(LINK_APP_FRONTEND + 'js/client/jquery.nice-select.min.js');
    // useScript(LINK_APP_FRONTEND + 'js/client/jquery-ui.min.js');
    // useScript(LINK_APP_FRONTEND + 'js/client/jquery.slicknav.js');
    // useScript(LINK_APP_FRONTEND + 'js/client/owl.carousel.min.js');
    // useScript(LINK_APP_FRONTEND + 'js/client/mixitup.min.js');
    useScript(LINK_APP_FRONTEND + 'js/client/main.js');
    return (
        <>
            <section className="latest-product spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div className="latest-product__text">
                                <h4>Sản phẩm mới nhất</h4>
                                <div className="latest-product__slider owl-carousel">
                                    <div className="latest-prdouct__slider__item">
                                        {listProducts && listProducts.length > 0 ? (
                                            shuffleArray(listProducts)
                                                .slice(0, 3)
                                                .map((item, index) => (
                                                    <LatestProductCard
                                                        key={index}
                                                        product={item}
                                                        promotionProductDetails={promotionProductDetails}
                                                    />
                                                ))
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <div className="latest-prdouct__slider__item">
                                        {listProducts && listProducts.length > 0 ? (
                                            shuffleArray(listProducts)
                                                .slice(0, 3)
                                                .map((item, index) => (
                                                    <LatestProductCard
                                                        key={index}
                                                        product={item}
                                                        promotionProductDetails={promotionProductDetails}
                                                    />
                                                ))
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="latest-product__text">
                                <h4>Sản phẩm mua nhiều</h4>
                                <div className="latest-product__slider owl-carousel">
                                    <div className="latest-prdouct__slider__item">
                                        {listProducts && listProducts.length > 0 ? (
                                            shuffleArray(listProducts)
                                                .slice(0, 3)
                                                .map((item, index) => (
                                                    <LatestProductCard
                                                        key={index}
                                                        product={item}
                                                        promotionProductDetails={promotionProductDetails}
                                                    />
                                                ))
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <div className="latest-prdouct__slider__item">
                                        {listProducts && listProducts.length > 0 ? (
                                            shuffleArray(listProducts)
                                                .slice(0, 3)
                                                .map((item, index) => (
                                                    <LatestProductCard
                                                        key={index}
                                                        product={item}
                                                        promotionProductDetails={promotionProductDetails}
                                                    />
                                                ))
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="latest-product__text">
                                <h4>Sản phẩm đánh giá cao</h4>
                                <div className="latest-product__slider owl-carousel">
                                    <div className="latest-prdouct__slider__item">
                                        {listProducts && listProducts.length > 0 ? (
                                            shuffleArray(listProducts)
                                                .slice(0, 3)
                                                .map((item, index) => (
                                                    <LatestProductCard
                                                        key={index}
                                                        product={item}
                                                        promotionProductDetails={promotionProductDetails}
                                                    />
                                                ))
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <div className="latest-prdouct__slider__item">
                                        {listProducts && listProducts.length > 0 ? (
                                            shuffleArray(listProducts)
                                                .slice(0, 3)
                                                .map((item, index) => (
                                                    <LatestProductCard
                                                        key={index}
                                                        product={item}
                                                        promotionProductDetails={promotionProductDetails}
                                                    />
                                                ))
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default LastestProduct;
