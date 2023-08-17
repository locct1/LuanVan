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

function PhotoProductSamples() {
    const { id } = useParams();
    const { isLoading, data, isError, error } = useGetProductData(id);
    const [selectProducSample, setSelectedProductSample] = useState('');
    const [productSample, setProductSample] = useState(null);
    useEffect(() => {
        if (data && data !== null) {
            let productSample = data.data.productSamples.find((p) => p.id === parseInt(selectProducSample));
            if (productSample !== null) {
                setProductSample(productSample);
            }
        }
    }, [data]);
    if (isLoading) {
        return <LoadingAdmin />;
    }
    const handleChangeProductSample = (e) => {
        setSelectedProductSample(e.target.value);
        let productSample = data.data.productSamples.find((p) => p.id === parseInt(e.target.value));
        setProductSample(productSample);
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
                                        {data.data.productSamples?.map((productSample, index) => (
                                            <option value={productSample.id} key={productSample.id}>
                                                {productSample.colorProduct.name}
                                            </option>
                                        ))}
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

            {productSample && productSample !== null ? (
                <>
                    <PhotoDefaultProductSample productSample={productSample} />
                    <SlidePhotoProductSample productSample={productSample} />
                </>
            ) : (
                <></>
            )}
        </>
    );
}

export default PhotoProductSamples;
