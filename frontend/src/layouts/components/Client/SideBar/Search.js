import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.scss';
import { useProductsClientData, usePromotionProductsClientData } from '~/hooks/react-query/client/pageData';
import ProductCardSearch from '~/components/Client/ProductCardSearch';
import Fuse from 'fuse.js';
import { stringToSlug } from '~/helpers/covertString';
function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [listProducts, setListProducts] = useState([]);
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

    const handleInputChange = (event) => {
        if (data && data.data) {
            const fuse = new Fuse(data.data, {
                keys: ['name'],
                threshold: 0.5,
            });
            let covertString = event.target.value.replace(/ào/g, 'ao').trim();
            let results = fuse.search(covertString);
            let resultProducts = results.map((resultProduct) => resultProduct.item);
            if (resultProducts.length === 0) {
                let newArray = data.data.filter((product) => {
                    return stringToSlug(product.name).includes(stringToSlug(covertString));
                });
                setListProducts(newArray);
            }
            setListProducts(resultProducts);
        }
        setSearchQuery(event.target.value);
    };
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        // Gọi hàm xử lý dữ liệu khi form được submit, ví dụ:
        // processSearchQuery(searchQuery);
        event.preventDefault();
        // Sử dụng navigate để điều hướng và cập nhật query parameter
        navigate(`/search-product/?search_product=${searchQuery}`);
    };
    if (isLoading || isLoadingPromotionProduct) {
        <></>;
    }
    return (
        <>
            <div className="hero__search__form SearchContainer">
                <form onSubmit={handleSubmit}>
                    <input
                        autocomplete="off"
                        type="text"
                        placeholder="Bạn cần tìm sản phẩm nào?"
                        id="search_data"
                        className="form-control input-lg ui-autocomplete-input"
                        value={searchQuery}
                        name="q"
                        onChange={handleInputChange}
                        required
                    />
                    <button className="site-btn" type="submit">
                        <i className="fa fa-search" />
                    </button>
                </form>
            </div>
            {searchQuery && searchQuery !== '' ? (
                <>
                    <div className="card suggesetionbox shadow-lg  mb-5 bg-white rounded">
                        <div className="card-header font-weight-bold">Sản phẩm gợi ý</div>
                        <ul className="list-group list-group-flush">
                            <div className="row mt-3 mb-3">
                                {listProducts && listProducts.length > 0 ? (
                                    listProducts.map((item, index) => (
                                        <>
                                            <ProductCardSearch
                                                product={item}
                                                key={index}
                                                promotionProductDetails={promotionProductDetails}
                                            />
                                        </>
                                    ))
                                ) : (
                                    <>
                                        <div className="col-12 ml-3">Không có sản phẩm cần tìm.</div>
                                    </>
                                )}
                            </div>
                        </ul>
                    </div>
                </>
            ) : (
                <></>
            )}
        </>
    );
}

export default Search;
