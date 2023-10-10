import { useEffect, useState } from 'react';
import ReviewProductModal from './ReviewProductModal';
import { infoClientSelector, isAuthenticatedClientSelector } from '~/redux/selectors';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import './ReviewProduct.scss';
import {
    useDeleteReviewProductData,
    useLikeReviewProductData,
    useReviewProductsByProductIdData,
    useUnLikeReviewProductData,
} from '~/hooks/react-query/client/pageData';
import moment from 'moment';
import 'moment/locale/vi';
import { FaStar } from 'react-icons/fa';
import { LINK_REVIEW_PRODUCT_PHOTO } from '~/helpers/constants';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));

function ReviewProduct({ product }) {
    const [show, setShow] = useState(false);
    const [totalStar, setTotalStar] = useState(false);
    const [timeLineStars, setTimeLineStars] = useState([
        { star: 1, width: 0, total: 0 },
        { star: 2, width: 0, total: 0 },
        { star: 3, width: 0, total: 0 },
        { star: 4, width: 0, total: 0 },
        { star: 5, width: 0, total: 0 },
    ]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const isAuthenticatedClient = useSelector(isAuthenticatedClientSelector);
    const { mutate: likeReviewProduct } = useLikeReviewProductData();
    const onSuccess = (data) => {
        console.log(data);
        if (data.success) {
            toast.success('Xóa bình luận thành công');
        }
    };
    const { mutate: unLikeReviewProduct } = useUnLikeReviewProductData();
    const { mutate: deleteReviewProduct } = useDeleteReviewProductData(onSuccess);

    const infoClient = useSelector(infoClientSelector);
    const { isLoading: isLoadingdataReviewProducts, data: dataReviewProducts } = useReviewProductsByProductIdData(
        product.id,
    );
    useEffect(() => {
        if (dataReviewProducts && dataReviewProducts.data && dataReviewProducts.data.length > 0) {
            const reviews = dataReviewProducts.data; // Mảng các đánh giá
            let totalRating = 0; // Khởi tạo tổng số sao

            // Duyệt qua mảng đánh giá và tính tổng số sao
            for (let i = 0; i < reviews.length; i++) {
                const rating = reviews[i].rating; // Lấy giá trị xếp hạng từ đánh giá hiện tại
                totalRating += rating; // Thêm giá trị xếp hạng vào tổng số sao
            }
            const averageRating = totalRating / reviews.length;
            const roundedAverageRating = averageRating.toFixed(1);
            const updatedTimeLineStars = [...timeLineStars]; // Tạo một bản sao của mảng timeLineStars để cập nhật

            // Đặt giá trị total cho mỗi sao là 0
            updatedTimeLineStars.forEach((starObj) => {
                starObj.total = 0;
            });

            // Duyệt qua mảng đánh giá và đếm số lượng đánh giá cho mỗi sao
            reviews.forEach((review) => {
                const rating = review.rating; // Lấy giá trị xếp hạng từ đánh giá hiện tại
                // Tăng tổng số đánh giá cho sao tương ứng
                updatedTimeLineStars[rating - 1].total++;
            });

            // Tính tỷ lệ đánh giá cho mỗi sao
            const totalReviews = reviews.length;
            updatedTimeLineStars.forEach((starObj) => {
                if (totalReviews > 0) {
                    starObj.width = Math.round((starObj.total / totalReviews) * 100);
                } else {
                    starObj.width = 0;
                }
            });
            console.log(updatedTimeLineStars);
            // Cập nhật state với giá trị mới của timeLineStars
            setTimeLineStars(updatedTimeLineStars);
            setTotalStar(roundedAverageRating);
        }
    }, [dataReviewProducts]);
    const checkUserLogin = () => {
        if (isAuthenticatedClient) {
            handleShow();
            return;
        }
        toast.warning('Vui lòng đăng nhập để viết đánh giá');
    };
    const handleChangeStatusReviewProduct = (reviewProduct) => {
        if (!isAuthenticatedClient) {
            toast.warning('Vui lòng đăng nhập để thích bình luận');
            return;
        }
        let findReviewProduct = dataReviewProducts.data.find((x) => x.id === reviewProduct.id);
        if (findReviewProduct) {
            let checkLikeReviewProduct = findReviewProduct.likeReviewProducts.find(
                (x) => x.userId === infoClient.id && x.reviewProductId === reviewProduct.id,
            );
            if (checkLikeReviewProduct) {
                unLikeReviewProduct(checkLikeReviewProduct.id);
            } else {
                likeReviewProduct(reviewProduct.id);
            }
        }
    };
    const handleDeleteReviewProduct = (reviewProduct) => {
        if (!isAuthenticatedClient) {
            toast.warning('Vui lòng đăng nhập để xóa bình luận');
            return;
        }
        deleteReviewProduct(reviewProduct.id);
    };
    if (isLoadingdataReviewProducts) {
        return <></>;
    }

    return (
        <>
            <div class="container">
                <div class="row">
                    <div class="col-8">
                        <div className="comment">
                            {' '}
                            <div class="card">
                                <div class="card-body">
                                    <h4 class="font-weight-bold">Đánh giá {product.name}</h4>
                                    <div className=" mt-3 mb-3">
                                        <div className="row">
                                            <div className="col-5">
                                                <div className="d-flex">
                                                    <h4 className="mr-3 text-warning"> {totalStar ?? 0}</h4>

                                                    <Stack spacing={1} className="mt-1">
                                                        <Rating
                                                            name="half-rating-read"
                                                            defaultValue={0}
                                                            value={totalStar}
                                                            precision={0.1}
                                                            readOnly
                                                        />
                                                    </Stack>
                                                    <h5 className="ml-3 text-primary mt-1">
                                                        {dataReviewProducts.data.length} đánh giá
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row mt-4">
                                            <div className="col-6 d-flex flex-column">
                                                {timeLineStars && timeLineStars.length > 0 ? (
                                                    timeLineStars.map((item, index) => (
                                                        <div className="row d-flex mb-2" key={index}>
                                                            <div className="col-2 d-flex">
                                                                <h6 className="mr-1">{item.star}</h6>{' '}
                                                                <FaStar
                                                                    className="mr-1"
                                                                    key={index}
                                                                    size={15}
                                                                    color={'#ffc107'}
                                                                />
                                                            </div>
                                                            <div className="col-8">
                                                                {' '}
                                                                <Box sx={{ flexGrow: 1 }} className="mt-1" width="100%">
                                                                    <BorderLinearProgress
                                                                        variant="determinate"
                                                                        value={item.width}
                                                                    />
                                                                </Box>
                                                            </div>
                                                            <div className="col-2 d-flex">
                                                                {/* <h6 className="ml-1">{item.total}</h6> */}
                                                                <h6 className="ml-1 align-content-end">
                                                                    {item.width}%
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={() => checkUserLogin()} class="btn btn-primary mt-3">
                                        Viết đánh giá
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {product && <ReviewProductModal show={show} onClose={handleClose} product={product} />}
                <div className="mb-5 mt-5 comment">
                    <div class="row">
                        <div class="col-8">
                            <div className="card">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h6 className="mb-5 font-weight-bold">Đánh giá khách hàng</h6>
                                        <div className="row">
                                            <div className="col-md-12">
                                                {dataReviewProducts && dataReviewProducts.data.length > 0 ? (
                                                    dataReviewProducts.data.map((item, index) => (
                                                        <div className="media mb-4">
                                                            <div className="avatar mr-2">
                                                                {item.user.fullName.split(' ').slice(-1)[0].charAt(0)}
                                                            </div>
                                                            <div className="media-body">
                                                                <div className="row">
                                                                    <div className="col-8 d-flex">
                                                                        <h5>{item.user.fullName}</h5>
                                                                    </div>
                                                                    {/* <div className="col-4">
                                                                        <div className="pull-right reply">
                                                                            <a href="#">
                                                                                <span>
                                                                                    <i className="fa fa-reply" /> reply
                                                                                </span>
                                                                            </a>
                                                                        </div>
                                                                    </div> */}
                                                                </div>
                                                                <div className="row mt-3 mb-3">
                                                                    <div className="col-8 d-flex">
                                                                        {[...Array(item.rating)].map((star, index) => (
                                                                            <FaStar
                                                                                className="mr-1"
                                                                                key={index}
                                                                                size={15}
                                                                                color={'#ffc107'}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={`row ${
                                                                        item.reviewProductPhotos &&
                                                                        item.reviewProductPhotos.length > 0
                                                                            ? 'mt-3 mb-3'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    <div className="col-8 d-flex">
                                                                        {item.reviewProductPhotos &&
                                                                        item.reviewProductPhotos.length > 0 ? (
                                                                            item.reviewProductPhotos.map(
                                                                                (photo, index) => (
                                                                                    <img
                                                                                        src={
                                                                                            LINK_REVIEW_PRODUCT_PHOTO +
                                                                                            photo.fileName
                                                                                        }
                                                                                        alt=""
                                                                                        className="mr-1"
                                                                                        style={{
                                                                                            height: '80px',
                                                                                            width: '80px',
                                                                                        }}
                                                                                    />
                                                                                ),
                                                                            )
                                                                        ) : (
                                                                            <></>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-8 d-flex">
                                                                        <p>
                                                                            <span
                                                                                className={
                                                                                    item.likeReviewProducts.find(
                                                                                        (x) =>
                                                                                            x.userId ===
                                                                                                infoClient?.id &&
                                                                                            x.reviewProductId ===
                                                                                                item.id,
                                                                                    )
                                                                                        ? 'text-primary'
                                                                                        : ''
                                                                                }
                                                                            >
                                                                                <i
                                                                                    class="fas fa-thumbs-up"
                                                                                    aria-hidden="true"
                                                                                    style={{ cursor: 'pointer' }}
                                                                                    onClick={() =>
                                                                                        handleChangeStatusReviewProduct(
                                                                                            item,
                                                                                        )
                                                                                    }
                                                                                ></i>{' '}
                                                                                Hữu ích (
                                                                                {item.likeReviewProducts.length})
                                                                            </span>
                                                                            {item.user.id === infoClient?.id ? (
                                                                                <span
                                                                                    style={{ cursor: 'pointer' }}
                                                                                    onClick={() =>
                                                                                        handleDeleteReviewProduct(item)
                                                                                    }
                                                                                    className="ml-3 text-danger"
                                                                                >
                                                                                    Xóa
                                                                                </span>
                                                                            ) : (
                                                                                <></>
                                                                            )}
                                                                            <span className="ml-3">
                                                                                {moment(item.createdAt).format(
                                                                                    'DD/MM/YYYY HH:mm:ss',
                                                                                )}
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-8 d-flex">
                                                                        <p>{item.commentContent}</p>
                                                                    </div>
                                                                </div>
                                                                {item.feedbackReviewProducts ? (
                                                                    item.feedbackReviewProducts.map((item, index) => (
                                                                        <div className="media">
                                                                            <div className="avatar-admin mr-2">A</div>

                                                                            <div className="media-body">
                                                                                <div className="row">
                                                                                    <div className="col-12 d-flex">
                                                                                        <h5>
                                                                                            {item.user.fullName}{' '}
                                                                                            <span class="badge badge-pill badge-warning text-dark">
                                                                                                Quản trị viên
                                                                                            </span>
                                                                                        </h5>
                                                                                    </div>
                                                                                </div>

                                                                                <p className="mt-2">
                                                                                    {item.feedBackContent}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <></>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReviewProduct;
