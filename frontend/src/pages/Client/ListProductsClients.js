import { Link } from 'react-router-dom';
import ProductCard from '~/components/Client/ProductCard';
import { LINK_APP_FRONTEND, LINK_PRODUCT_IMAGE } from '~/helpers/constants';
import { useProductsClientData } from '~/hooks/react-query/client/pageData';
import useScript from '~/hooks/useScript';

function ListProductsClient() {
    const { isLoading, data, isError, error } = useProductsClientData();
    if (isLoading) {
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
                                    <span>Danh sách điện thoại</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="featured spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title">
                                <h2> Danh sách điện thoại </h2>
                            </div>
                        </div>
                    </div>
                    <div className="row featured__filter">
                        {data && data.data.length > 0 ? (
                            data.data.map((item, index) => (
                                <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
                                    <ProductCard product={item} />
                                </div>
                            ))
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default ListProductsClient;
