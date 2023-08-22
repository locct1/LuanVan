import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductCard from '~/components/Client/ProductCard';
import { LINK_PRODUCT_IMAGE } from '~/helpers/constants';
import { stringToSlug } from '~/helpers/covertString';
import { useProductsClientData } from '~/hooks/react-query/client/pageData';

function ListProductsBySearch() {
    const { search } = useLocation();
    const [listProducts, setListProducts] = useState([]);
    const searchParams = new URLSearchParams(search);
    const searchQuery = searchParams.get('search_product');
    const { isLoading, data, isError, error } = useProductsClientData();
    useEffect(() => {
        if (data && data.data) {
            let newArray = data.data.filter((product) => {
                return stringToSlug(product.name).includes(stringToSlug(searchQuery));
            });

            setListProducts(newArray);
        }
    }, [data, searchQuery]);

    return (
        <>
            {' '}
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
                                <h2>Tìm kiếm điện thoại</h2>
                                <div className="breadcrumb__option">
                                    <Link to="/">Trang chủ</Link>
                                    <Link to="/">Điện thoại</Link>
                                    <span>Từ khóa: {searchQuery ?? ''}</span>
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
                                <h2>Tìm kiếm điện thoại: {searchQuery ?? ''} </h2>
                            </div>
                        </div>
                    </div>
                    <div className="row featured__filter">
                        {listProducts && listProducts.length > 0 ? (
                            listProducts.map((item, index) => (
                                <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
                                    <ProductCard product={item} />
                                </div>
                            ))
                        ) : (
                            <p>Chưa có sản phẩm nào.</p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default ListProductsBySearch;
