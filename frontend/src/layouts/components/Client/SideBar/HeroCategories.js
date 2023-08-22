import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LINK_BRAND_IMAGE } from '~/helpers/constants';
import { useBrandsClientData } from '~/hooks/react-query/client/pageData';

function HeroCategories() {
    const { isLoading, data, isError, error } = useBrandsClientData();
    const [isOpen, setIsOpen] = useState(true); // Mặc định là true để hiển thị
    const location = useLocation();
    const handleClick = () => {
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        if (location.pathname === '/') {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [location]);
    return (
        <>
            <div className="hero__categories">
                <div className="hero__categories__all" onClick={handleClick}>
                    <i className="fa fa-bars" />
                    <span>Thương hiệu</span>
                </div>
                {isLoading ? (
                    <></>
                ) : (
                    <>
                        <ul style={{ display: isOpen ? 'block' : 'none' }}>
                            {data.data && data.data.length > 0 ? (
                                data.data.map((item, index) => (
                                    <Link key={index} to={`/list-product-by-brand/${item.id}`}>
                                        <li>
                                            <img
                                                className="zoomm"
                                                style={{ marginTop: 10, marginBottom: 10 }}
                                                src={LINK_BRAND_IMAGE + item.image}
                                                alt="...."
                                            />
                                        </li>
                                    </Link>
                                ))
                            ) : (
                                <></>
                            )}
                        </ul>
                    </>
                )}
            </div>
        </>
    );
}

export default HeroCategories;
