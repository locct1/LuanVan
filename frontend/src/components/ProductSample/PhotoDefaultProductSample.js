import { ToastContainer, toast } from 'react-toastify';
import InputSearch from '~/components/InputSearch';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { stringToSlug } from '~/helpers/covertString';
import { DateSchema } from 'yup';
import LoadingAdmin from '~/components/LoadingAdmin';
import { LINK_PRODUCT_IMAGE, LINK_PRODUCT_SAMPLE_DEFAULT_IMAGE } from '~/helpers/constants';
import moment from 'moment';
import 'moment/locale/vi';
import './UploadImage.scss';
import {
    useDeleteProductSampleDefaultImageData,
    useUploadProductSampleDefaultImageData,
} from '~/hooks/react-query/productsampleData';
function PhotoDefaultProductSample({ productSample }) {
    const [linkImage, setLinkImage] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setLinkImage(productSample);
    }, [productSample]);
    const onSuccess = (data) => {
        if (data.success) {
            toast.success('Upload thành công');
        }
    };
    const onSuccessDelete = (data) => {
        if (data.success) {
            toast.success('Xóa ảnh thành công');
        }
    };
    const { mutate: uploadProductSampleDefaultImage } = useUploadProductSampleDefaultImageData(onSuccess);
    const { mutate: deleteProductSampleDefaultImage } = useDeleteProductSampleDefaultImageData(onSuccessDelete);
    const onSelectFile = async (event) => {
        const selectedFile = event.target.files[0];

        if (linkImage.fileName !== null) {
            event.target.value = '';
            toast.error('Tối đa 1 ảnh');
            return;
        }
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append(`id`, productSample.id);
        uploadProductSampleDefaultImage(formData);
    };

    const deleteHandler = async () => {
        deleteProductSampleDefaultImage(productSample.id);
    };

    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Hình ảnh mặc định</h6>
                </div>
                <div className="card-body">
                    <section className="upload-image">
                        <label className="upload-plus bg bg-success text-light">
                            <span>+</span>
                            <span>tối đa 1 ảnh</span>
                            <input
                                type="file"
                                name="images"
                                onChange={onSelectFile}
                                accept="image/png , image/jpeg, image/webp"
                            />
                        </label>
                        <br />

                        <input type="file" multiple />
                        <div className="images">
                            {linkImage && linkImage.fileName && (
                                <>
                                    <div className="image">
                                        <img
                                            src={LINK_PRODUCT_SAMPLE_DEFAULT_IMAGE + linkImage.fileName}
                                            height="200"
                                            alt="upload"
                                        />
                                        <button onClick={() => deleteHandler()}>Xóa</button>
                                        <p>{1}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default PhotoDefaultProductSample;
