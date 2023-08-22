import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useGetBrandData, useUpdateBrandData } from '~/hooks/react-query/brandData';
import { ToastContainer, toast } from 'react-toastify';
import { useMatch, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateBrand } from '~/services/admin/brand.service';
import LoadingAdmin from '~/components/LoadingAdmin';
import { LINK_APP_FRONTEND, LINK_BRAND_IMAGE, LINK_PRODUCT_IMAGE } from '~/helpers/constants';
import { useProductsByBrandIdClientData } from '~/hooks/react-query/client/pageData';
import useScript from '~/hooks/useScript';
import ProductCard from '~/components/Client/ProductCard';
function ListProductsByBrand() {
    const { id } = useParams();
    const { isLoading, data, isError, error } = useProductsByBrandIdClientData(id);
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
                                    <Link to="/">Điện thoại</Link>
                                    <span>{data?.data.brand.name}</span>
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
                                <h2>Điện thoại {data?.data.brand.name} </h2>
                            </div>
                        </div>
                    </div>
                    <div className="row featured__filter">
                        {data && data.data.products.length > 0 ? (
                            data.data.products.map((item, index) => (
                                <>
                                    <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
                                        <ProductCard product={item} />
                                    </div>
                                </>
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

export default ListProductsByBrand;
