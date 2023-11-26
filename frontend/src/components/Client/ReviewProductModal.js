import { Button, Modal } from 'react-bootstrap';
import { LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE, LINK_PRODUCT_IMAGE } from '~/helpers/constants';
import moment from 'moment';
import { FaStar } from 'react-icons/fa';
import 'moment/locale/vi';
import { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import './ReviewProductModal.scss';
import { ToastContainer, toast } from 'react-toastify';
import { infoClientSelector, isAuthenticatedClientSelector } from '~/redux/selectors';
import { useSelector } from 'react-redux';
import { useCreateReviewProductClientData } from '~/hooks/react-query/client/pageData';
import { callAPIClassifyComments } from '~/services/client/api_classify_vietnamese_comments.service';

function ReviewProductModal({ show, onClose, product }) {
    const schema = yup
        .object()
        .shape({
            commentContent: yup.string().required('Vui lòng nhập chia sẻ cảm nhận'),
        })
        .required();
    const {
        register,
        resetField,
        handleSubmit,
        clearErrors,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    //UploadFIle
    const [showUpload, setShowUpload] = useState(false);
    const [uploadImages, setUploadImages] = useState([]);
    const isAuthenticatedClient = useSelector(isAuthenticatedClientSelector);
    const infoClient = useSelector(infoClientSelector);

    const onSelectFile = (event) => {
        const selectedFiles = event.target.files;
        console.log(event.target.files);
        const selectedFilesArray = Array.from(selectedFiles);

        // setUploadImages([...uploadImages, event.target.files]);
        if (uploadImages.length >= 4 || uploadImages.length + selectedFilesArray.length > 4) {
            event.target.value = '';
            toast.error('Tối đa 4 ảnh');
            return;
        }
        const imagesArray = selectedFilesArray.map((file) => {
            const blob = URL.createObjectURL(file);
            return { file: file, blob: blob };
        });
        setShowUpload(true);
        setUploadImages([...uploadImages, ...imagesArray]);

        // FOR BUG IN CHROME
        event.target.value = '';
    };

    function deleteHandler(image) {
        console.log(image);
        console.log(uploadImages);
        setUploadImages(uploadImages.filter((e) => e.blob !== image.blob));
        URL.revokeObjectURL(image);
    }
    const handleUploadImages = (event) => {
        const uploadImagesRequest = uploadImages.map((obj) => obj.file);
        console.log(uploadImagesRequest);
        setUploadImages([]);
        setShowUpload(false);
    };
    const [errorsForm, setErrorsForm] = useState([]);

    const onSuccess = (data) => {
        if (data.success) {
            resetField('commentContent');
            setUploadImages([]);
            setRating(null);
            onClose();
            toast.success('VIết đánh giá thành công');
        } else {
            setErrorsForm(data.errors);
        }
    };

    const { mutate: createReviewProductClient } = useCreateReviewProductClientData(onSuccess);
    const onSubmit = async (data) => {
        const formData = new FormData();
        if (typeof rating !== 'number') {
            alert(21);
            setErrorsForm({ ...errorsForm, rating: 'Vui lòng chọn sao đánh giá' });
            return;
        }
        let result = await callAPIClassifyComments({
            text: data.commentContent,
        });
        console.log(result);
        const uploadImagesRequest = uploadImages.map((obj) => obj.file);
        formData.append('commentContent', data.commentContent);
        formData.append('productId', parseInt(product.id));
        formData.append('rating', parseInt(rating));
        formData.append('userId', infoClient.id);
        formData.append('isPositive', result.sentiment);
        for (let i = 0; i < uploadImagesRequest.length; i++) {
            formData.append(`images`, uploadImagesRequest[i]);
        }
        createReviewProductClient(formData);
    };
    const handleSetRating = (currentRating) => {
        setErrorsForm({});
        setRating(currentRating);
    };
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="modal-70w">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton className="bg-primary">
                        <Modal.Title className="font-weight-bold text-light">Đánh giá sản phẩm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-center">
                                <img src={LINK_PRODUCT_IMAGE + product.image} alt="" width="20%" />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 d-flex justify-content-center">
                                <h4 className="font-weight-bold">{product.name}</h4>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 d-flex justify-content-center">
                                {[...Array(5)].map((star, index) => {
                                    const currentRating = index + 1;
                                    return (
                                        <label>
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={currentRating}
                                                style={{ display: 'none' }}
                                            />{' '}
                                            <FaStar
                                                style={{ cursor: 'pointer' }}
                                                size={50}
                                                color={currentRating <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                                                onClick={() => handleSetRating(currentRating)}
                                                onMouseEnter={() => setHover(currentRating)}
                                                onMouseLeave={() => setHover(null)}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 d-flex justify-content-center">
                                <p className="font-weight-bold">
                                    Đánh giá của bạn là: {rating}{' '}
                                    <i className="fas fa-star" style={{ color: '#ffc107' }}></i>
                                </p>
                                <br></br>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 d-flex justify-content-center">
                                {errorsForm?.rating && <p className="mt-2 text-danger">{errorsForm?.rating}</p>}
                            </div>
                        </div>
                        <div className="row mt-3 d-flex justify-content-center">
                            <div className="col-8">
                                <div className="form-group w-80">
                                    <label className="font-weight-bold">Cảm nhận của bạn:</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        name="commentContent"
                                        placeholder="Mời bạn chia sẻ thêm cảm nhận....."
                                        {...register('commentContent')}
                                        rows={5}
                                    />
                                    {errors.commentContent?.message && (
                                        <p className="mt-2 text-danger">{errors.commentContent?.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="row  d-flex justify-content-center">
                            <div className="col-8">
                                <section>
                                    <label>
                                        <span className="btn btn-info">Gửi ảnh </span>
                                        <span className="ml-2">(tối đa 4 ảnh)</span>
                                        <input
                                            style={{ display: 'none' }}
                                            type="file"
                                            name="images"
                                            onChange={onSelectFile}
                                            multiple
                                            accept="image/png , image/jpeg, image/webp"
                                        />
                                    </label>
                                    <br />
                                    <div className="images mt-3">
                                        <div className="d-flex">
                                            {' '}
                                            {uploadImages &&
                                                uploadImages.map((image, index) => {
                                                    return (
                                                        <div key={index} className="container-review-product">
                                                            <img src={image.blob} height="100" alt="upload" />
                                                            <i
                                                                className="fas fa-times"
                                                                onClick={() => deleteHandler(image)}
                                                            ></i>
                                                            <p>{index + 1}</p>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="primary">
                            Xác nhận
                        </Button>
                        <Button type="button" variant="dark" onClick={onClose}>
                            Hủy
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}

export default ReviewProductModal;
