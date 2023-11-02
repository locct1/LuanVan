import { Button, Modal } from 'react-bootstrap';
import { LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE, LINK_PRODUCT_IMAGE } from '~/helpers/constants';
import moment from 'moment';
import { FaStar } from 'react-icons/fa';
import 'moment/locale/vi';
import React, { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { infoClientSelector, isAuthenticatedClientSelector } from '~/redux/selectors';
import { useSelector } from 'react-redux';
import { useCreateReviewProductClientData } from '~/hooks/react-query/client/pageData';
import {
    useAddFeedBackReviewProductData,
    useDeleteFeedBackReviewProductData,
} from '~/hooks/react-query/reviewproduct.Data';

function FeedBackReviewProductModal({ show, onClose, reviewProduct }) {
    const schema = yup
        .object()
        .shape({
            feedBackContent: yup.string().required('Vui lòng nhập phản hồi'),
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
    const [errorsForm, setErrorsForm] = useState([]);

    const onSuccess = (data) => {
        if (data.success) {
            resetField('feedBackContent');
            onClose();
            toast.success('Phản hồi hồi thành công');
        } else {
            setErrorsForm(data.errors);
        }
    };

    const { mutate: addFeedBackReviewProduct } = useAddFeedBackReviewProductData(onSuccess);
    const { mutate: deleteFeedBackReviewProduct } = useDeleteFeedBackReviewProductData();
    const onSubmit = async (data) => {
        console.log(data);
        let dataFeedBackReviewProduct = {
            feedBackContent: data.feedBackContent,
            ReviewProductId: reviewProduct.id,
        };
        console.log(dataFeedBackReviewProduct);
        addFeedBackReviewProduct(dataFeedBackReviewProduct);
    };
    const handleClose = () => {
        resetField('feedBackContent');
        onClose();
    };
    const handleDleteFeedBackReviewProduct = (feedbackReviewProduct) => {
        console.log(feedbackReviewProduct);
        deleteFeedBackReviewProduct(feedbackReviewProduct.id);
    };
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="modal-70w">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton className="bg-primary">
                        <Modal.Title className="font-weight-bold text-light">Phản hồi đánh giá</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <div className="row">
                                <div className="col-5">
                                    <p>
                                        <span className="font-weight-bold">Tên khách hàng:</span>{' '}
                                        {reviewProduct.user.fullName}
                                    </p>
                                    <p>
                                        <span className="font-weight-bold">Số điện thoại:</span>{' '}
                                        {reviewProduct.user.phoneNumber}
                                    </p>
                                    <p>
                                        <span className="font-weight-bold">Email:</span> {reviewProduct.user.email}
                                    </p>
                                    <p>
                                        <span className="font-weight-bold">Sao:</span>{' '}
                                        {[...Array(reviewProduct.rating)].map((star, index) => (
                                            <FaStar className="mr-1" key={index} size={15} color={'#ffc107'} />
                                        ))}
                                    </p>
                                    <p>
                                        <span className="font-weight-bold">Nội dung:</span>{' '}
                                        {reviewProduct.commentContent}
                                    </p>
                                </div>
                                <div className="col-7">
                                    {errorsForm && errorsForm.length > 0 && (
                                        <>
                                            {errorsForm.map((error, index) => (
                                                <p className="text-danger" key={index}>
                                                    {error}
                                                </p>
                                            ))}
                                        </>
                                    )}
                                    <label className="font-weight-bold">Đã phản hồi:</label>
                                    <br></br>
                                    {reviewProduct.feedbackReviewProducts ? (
                                        reviewProduct.feedbackReviewProducts.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <div className="d-flex">
                                                    {' '}
                                                    <p>{item.feedBackContent} </p>{' '}
                                                    <i
                                                        className="fas fa-times ml-3"
                                                        style={{ color: 'red', cursor: 'pointer' }}
                                                        onClick={() => handleDleteFeedBackReviewProduct(item)}
                                                    ></i>
                                                </div>
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                    <label className="font-weight-bold">Phản hồi:</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        name="feedBackContent"
                                        placeholder="Mời bạn chia sẻ thêm cảm nhận....."
                                        {...register('feedBackContent')}
                                        rows={5}
                                    />
                                    {errors.feedBackContent?.message && (
                                        <p className="mt-2 text-danger">{errors.feedBackContent?.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="primary">
                            Xác nhận
                        </Button>
                        <Button type="button" variant="dark" onClick={() => handleClose()}>
                            Hủy
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}

export default FeedBackReviewProductModal;
