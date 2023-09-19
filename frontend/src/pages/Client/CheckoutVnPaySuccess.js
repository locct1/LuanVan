import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '~/components/Client/ProductCard';
import { LINK_PRODUCT_IMAGE, LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE } from '~/helpers/constants';
import { stringToSlug } from '~/helpers/covertString';
import {
    usePaymentMethodsClientData,
    useProductByIdClientData,
    useProductsClientData,
} from '~/hooks/react-query/client/pageData';
import CartSlice from '~/redux/Slices/CartSlice';
import {
    infoCart,
    infoCheckOutSelector,
    infoClientSelector,
    infoNoteSelector,
    infoRecipientSelector,
} from '~/redux/selectors';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ClientLoadUser } from '~/redux/Slices/ClientAuthSlice';
import { callAPIGetDistrict, callAPIGetProvince, callAPIGetWard } from '~/services/client/getaddress.service';
import { UpdateInfoClientService } from '~/services/client/clientAuth.service';
import { usePaymentMethodsData } from '~/hooks/react-query/paymentmethodData';
import { createOrderClient } from '~/services/client/page.service';
import moment from 'moment';
function CheckoutVnPaySuccess() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [vnpay, setVnPay] = useState(Object.fromEntries([...searchParams]));
    const recipient = useSelector(infoRecipientSelector);
    const cart = useSelector(infoCart);
    const note = useSelector(infoNoteSelector);
    const isCheckOut = useSelector(infoCheckOutSelector);
    const [success, setSuccess] = useState(false);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        if (isCheckOut === false && vnpay.vnp_TransactionStatus === '00') {
            console.log(vnpay);
            let response = await createOrderClient({
                infoRecipient: recipient,
                order: cart,
                note: note,
                paymentMethodId: 3,
                onl_Amount: vnpay.vnp_Amount,
                onl_BankCode: vnpay.vnp_BankCode,
                onl_OrderInfo: vnpay.vnp_OrderInfo,
                onl_PayDate: vnpay.vnp_PayDate,
                onl_TransactionStatus: vnpay.vnp_TransactionStatus,
                onl_SecureHash: vnpay.vnp_SecureHash,
                onl_TransactionNo: vnpay.vnp_TransactionNo,
                onl_OrderId: vnpay.vnp_TxnRef,
            });
            if (response.success) {
                toast.success(response.message);
                dispatch(CartSlice.actions.resetCart());
                dispatch(
                    CartSlice.actions.updateCheckOut({
                        isCheckOut: true,
                    }),
                );
                setSuccess(true);
            } else {
                toast.error(response.message);
            }

            if (isLoading)
                setTimeout(() => {
                    setIsLoading(false);
                }, 100);

            return;
        }
        if (isLoading)
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
    };
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
                                    <h4 className="text-light">
                                        {vnpay.vnp_TransactionStatus === '00' && success === true ? (
                                            <>
                                                {' '}
                                                Bạn đã đặt hàng thành công <i class="fa fa-check"></i> Cảm ơn bạn, chúng
                                                tôi sẽ liên hệ với bạn ngay khi nhận được thông báo đơn hàng.
                                            </>
                                        ) : (
                                            <>Giao dịch không hợp lệ.Vui lòng thử lại trong giây lát.</>
                                        )}
                                    </h4>
                                </div>
                                <Link to="/" className="text-light">
                                    Xem lịch sử đơn hàng tại đây.
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-12 mb-5">
                            <div class="card">
                                <h5 class="card-header">Thông tin giao dịch</h5>
                                <div class="card-body">
                                    <h5 class="card-title">
                                        Trạng thái:{' '}
                                        {vnpay.vnp_TransactionStatus === '00'
                                            ? 'Giao dịch thành công'
                                            : 'Giao dịch không hợp lệ'}{' '}
                                    </h5>
                                    <h5 class="card-title">Mô tả: {vnpay.vnp_OrderInfo ? vnpay.vnp_OrderInfo : ''}</h5>
                                    <h5 class="card-title">
                                        Tổng tiền thanh toán:{' '}
                                        {vnpay.vnp_Amount
                                            ? String(parseInt(vnpay.vnp_Amount) / 100).replace(
                                                  /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                  '$1,',
                                              ) + ' đ'
                                            : ''}
                                    </h5>
                                    <h5 class="card-title">
                                        Thời gian giao dịch:{' '}
                                        {vnpay.vnp_PayDate
                                            ? moment(vnpay.vnp_PayDate, 'YYYYMMDDHHmmss').format('DD/MM/YYYY HH:mm:ss')
                                            : 'Giao dịch không hợp lệ'}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default CheckoutVnPaySuccess;
