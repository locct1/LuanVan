import { ToastContainer, toast } from 'react-toastify';
import InputSearch from '~/components/InputSearch';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { stringToSlug } from '~/helpers/covertString';
import { DateSchema } from 'yup';
import LoadingAdmin from '~/components/LoadingAdmin';
import {
    LINK_IMAGE_PRODUCT_360,
    LINK_PRODUCT_IMAGE,
    LINK_SLIDE_PRODUCT_COLOR_PRODUCT_IMAGE,
} from '~/helpers/constants';
import moment from 'moment';
import 'moment/locale/vi';
import './UploadImage.scss';
import {
    useDeleteImageProduct360Data,
    useDeleteProductSampleDefaultImageData,
    useDeleteSlideProductSampleImageData,
    useImageProducts360Data,
    useUploadProductSampleDefaultImageData,
    useUploadSlideProductSampleImageData,
} from '~/hooks/react-query/productsampleData';
function ImageProduct360({ photos, productId }) {
    const [linkImages, setLinkImages] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log(photos.data);
        setLinkImages(photos.data);
    }, [photos, productId]);
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
    const { mutate: uploadImageProducts360 } = useImageProducts360Data(onSuccess);
    const { mutate: deleteImageProduct360 } = useDeleteImageProduct360Data(onSuccessDelete);
    const onSelectFile = async (event) => {
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);
        if (linkImages.length >= 36 || linkImages.length + selectedFilesArray.length > 36) {
            event.target.value = '';
            toast.error('Tối đa 36 ảnh');
            return;
        }
        const formData = new FormData();
        for (let i = 0; i < selectedFilesArray.length; i++) {
            formData.append(`images`, selectedFilesArray[i]);
        }
        formData.append(`id`, productId);
        uploadImageProducts360(formData);
    };

    const deleteHandler = async (image) => {
        deleteImageProduct360(image.id);
    };
    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Hình ảnh 360</h6>
                </div>
                <div className="card-body">
                    <section className="upload-image">
                        <label className="upload-plus bg bg-success text-light">
                            <span>+</span>
                            <span>tối đa 36 ảnh</span>
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
                            {linkImages &&
                                linkImages.length > 0 &&
                                linkImages.map((image, index) => {
                                    return (
                                        <div key={image.id} className="image">
                                            <img
                                                src={LINK_IMAGE_PRODUCT_360 + image.fileName}
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

export default ImageProduct360;
