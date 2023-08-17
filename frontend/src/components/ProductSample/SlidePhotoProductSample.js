import { ToastContainer, toast } from 'react-toastify';
import InputSearch from '~/components/InputSearch';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { stringToSlug } from '~/helpers/covertString';
import { DateSchema } from 'yup';
import LoadingAdmin from '~/components/LoadingAdmin';
import { LINK_PRODUCT_IMAGE, LINK_SLIDE_PRODUCT_SAMPLE_IMAGE } from '~/helpers/constants';
import moment from 'moment';
import 'moment/locale/vi';
import './UploadImage.scss';
import {
    useDeleteProductSampleDefaultImageData,
    useDeleteSlideProductSampleImageData,
    useUploadProductSampleDefaultImageData,
    useUploadSlideProductSampleImageData,
} from '~/hooks/react-query/productsampleData';
function SlidePhotoProductSample({ productSample }) {
    const [linkImages, setLinkImages] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setLinkImages(productSample);
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
    const { mutate: uploadSlideProductSampleImage } = useUploadSlideProductSampleImageData(onSuccess);
    const { mutate: deleteSlideProductSampleImage } = useDeleteSlideProductSampleImageData(onSuccessDelete);
    const onSelectFile = async (event) => {
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);
        if (linkImages.length >= 5 || linkImages.length + selectedFilesArray.length > 5) {
            event.target.value = '';
            toast.error('Tối đa 5 ảnh');
            return;
        }
        const formData = new FormData();
        for (let i = 0; i < selectedFilesArray.length; i++) {
            formData.append(`images`, selectedFilesArray[i]);
        }
        formData.append(`id`, productSample.id);
        uploadSlideProductSampleImage(formData);
    };

    const deleteHandler = async (image) => {
        deleteSlideProductSampleImage(image.id);
    };
    console.log(linkImages.photos);
    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Slide hình ảnh</h6>
                </div>
                <div className="card-body">
                    <section className="upload-image">
                        <label className="upload-plus bg bg-success text-light">
                            <span>+</span>
                            <span>tối đa 5 ảnh</span>
                            <input
                                type="file"
                                name="images"
                                onChange={onSelectFile}
                                multiple
                                accept="image/png , image/jpeg, image/webp"
                            />
                        </label>
                        <br />

                        <input type="file" multiple />
                        <div className="images">
                            {linkImages.photos &&
                                linkImages.photos.map((image, index) => {
                                    return (
                                        <div key={image.id} className="image">
                                            <img
                                                src={LINK_SLIDE_PRODUCT_SAMPLE_IMAGE + image.fileName}
                                                height="200"
                                                alt="upload"
                                            />
                                            <button onClick={() => deleteHandler(image)}>Xóa</button>
                                            <p>{index + 1}</p>
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default SlidePhotoProductSample;
