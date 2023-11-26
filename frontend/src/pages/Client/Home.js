import { useProductsClientData, usePromotionProductsClientData } from '~/hooks/react-query/client/pageData';
import ClientBannerSection from '~/layouts/components/Client/ClientBannerSection';
import { LINK_APP_FRONTEND, LINK_PRODUCT_IMAGE } from '~/helpers/constants';
import useScript from '~/hooks/useScript';
import ProductCard from '~/components/Client/ProductCard';
import { useEffect, useState } from 'react';
import { date } from 'yup';
import LastestProduct from '~/components/Client/LatestProduct';

function Home() {
    const { isLoading, data, isError, error } = useProductsClientData();
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
    if (isLoading || isLoadingPromotionProduct) {
        <></>;
    }
    return (
        <>
            <ClientBannerSection />

            <section className="featured spad pb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title">
                                <h2>Điện thoại mới nhất</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row featured__filter">
                        {data && data.data.length > 0 ? (
                            data.data
                                ?.filter((product) => product.productCategoryCode === 'DIENTHOAI')
                                .map((item, index) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
                                        <ProductCard product={item} promotionProductDetails={promotionProductDetails} />
                                    </div>
                                ))
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </section>
            <section className="featured spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title">
                                <h2>Phụ kiện mới nhất</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row featured__filter">
                        {data && data.data.length > 0 ? (
                            data.data
                                ?.filter((product) => product.productCategoryCode !== 'DIENTHOAI')
                                .map((item, index) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
                                        <ProductCard product={item} promotionProductDetails={promotionProductDetails} />
                                    </div>
                                ))
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </section>
            <ClientBannerSection />
            {data && data.data && promotionProductDetails && (
                <LastestProduct listProducts={data.data} promotionProductDetails={promotionProductDetails} />
            )}
        </>
    );
}

export default Home;
