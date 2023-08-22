import { Link } from 'react-router-dom';
import { LINK_PRODUCT_IMAGE } from '~/helpers/constants';

function ProductCard({ product }) {
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
                    <h5 style={{ color: '#d70018' }} className="gia">
                        {String(product.priceOut).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                        <sup>đ</sup>
                    </h5>
                </div>
            </div>
        </>
    );
}

export default ProductCard;
