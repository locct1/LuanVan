import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useUpdateProductData, useGetProductData } from '~/hooks/react-query/productData';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useBrandsData } from '~/hooks/react-query/brandData';
import { useWareHousesData } from '~/hooks/react-query/warehouseData';
import { useColorProductsData } from '~/hooks/react-query/colorproductData';
import LoadingAdmin from '~/components/LoadingAdmin';
import Select from 'react-select';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from 'html-react-parser';
import { useMatch, useParams } from 'react-router-dom';
import { LINK_PRODUCT_IMAGE, htmlTable } from '~/helpers/constants';
import PhotoDefaultProductSample from '~/components/ProductSample/PhotoDefaultProductSample';
import SlidePhotoProductSample from '~/components/ProductSample/SlidePhotoProductSample';
import ImageProduct360 from '~/components/ProductSample/ImageProduct360';
import { usePhotosByProductIdData } from '~/hooks/react-query/productsampleData';

function PhotoProductSamples() {
    const { id } = useParams();
    const { isLoading, data, isError, error } = useGetProductData(id);
    const { isLoading: isLoadingPhotosByProductId, data: dataPhotosByProductId } = usePhotosByProductIdData(id);
    const [selectProducSample, setSelectedProductSample] = useState('');
    const [productColorProduct, setProductSample] = useState(null);
    const [image360, setImage360] = useState(false);
    useEffect(() => {
        if (data && data !== null) {
            let productColorProduct = data.data.productColorProducts.find((p) => p.id === parseInt(selectProducSample));
            if (productColorProduct !== null) {
                setProductSample(productColorProduct);
            }
        }
    }, [data]);
    if (isLoading || isLoadingPhotosByProductId) {
        return <LoadingAdmin />;
    }
    const handleChangeProductSample = (e) => {
        setSelectedProductSample(e.target.value);
        if (e.target.value === 'image-360') {
            setImage360(true);
            console.log('fdfdfd', dataPhotosByProductId);
            return;
        } else {
            setImage360(false);
        }
        let productColorProduct = data.data.productColorProducts.find((p) => p.id === parseInt(e.target.value));
        setProductSample(productColorProduct);
    };
    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Thư viện ảnh: {data.data.name}</h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group row">
                                <label htmlFor="inputPassword" className="col-sm-4 col-form-label font-weight-bold">
                                    Mẫu sản phẩm:
                                </label>
                                <div className="col-sm-8">
                                    <select
                                        class="form-control"
                                        name="selectProductSample"
                                        value={selectProducSample}
                                        onChange={(e) => handleChangeProductSample(e)}
                                    >
                                        <option selected value="">
                                            Chọn mẫu sản phẩm
                                        </option>
                                        {data.data.productColorProducts?.map((productColorProduct, index) => (
                                            <option value={productColorProduct.id} key={productColorProduct.id}>
                                                {productColorProduct.colorProduct.name}
                                            </option>
                                        ))}
                                        <option value="image-360" key="image-360">
                                            Hình 360
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link to="/admin-list-products" type="submit" className="btn btn-dark ml-3">
                        Quay lại
                    </Link>
                </div>
            </div>

            {productColorProduct && productColorProduct !== null && image360 === false ? (
                <>
                    <PhotoDefaultProductSample productColorProduct={productColorProduct} />
                    <SlidePhotoProductSample productColorProduct={productColorProduct} />
                </>
            ) : (
                <></>
            )}
            {image360 && dataPhotosByProductId && image360 === true ? (
                <>
                    <ImageProduct360 productId={id} photos={dataPhotosByProductId} />
                </>
            ) : (
                <></>
            )}
        </>
    );
}

export default PhotoProductSamples;
