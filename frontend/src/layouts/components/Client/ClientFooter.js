function ClientFooter() {
    return (
        <>
            <footer className="footer spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="footer__about">
                                <div className="footer__about__logo">
                                    <a href="/LKshop">
                                        <img src="/img/client/logo6.png" alt />
                                    </a>
                                </div>
                                <ul>
                                    <li>Địa chỉ: 123/456 đường ABC</li>
                                    <li>Phone: 0939131275</li>
                                    <li>Email: LKSHOP@gmail.com</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-1">
                            <div className="footer__widget">
                                <h6>Liên kết hữu ích</h6>
                                <ul>
                                    <li>
                                        <a href="#">Về chúng tôi</a>
                                    </li>
                                    <li>
                                        <a href="#">Về cửa hàng chúng tôi</a>
                                    </li>
                                    <li>
                                        <a href="#">Mua sắm an toàn</a>
                                    </li>
                                    <li>
                                        <a href="#">Thông tin giao hàng</a>
                                    </li>
                                    <li>
                                        <a href="#">Chính sách bảo mật</a>
                                    </li>
                                    <li>
                                        <a href="#">Sơ đồ trang web chúng tôi</a>
                                    </li>
                                </ul>
                                <ul>
                                    <li>
                                        <a href="#">Chúng tôi là ai</a>
                                    </li>
                                    <li>
                                        <a href="#">Dịch vụ của chúng tôi</a>
                                    </li>
                                    <li>
                                        <a href="#">Dự án</a>
                                    </li>
                                    <li>
                                        <a href="#">Liên hệ</a>
                                    </li>
                                    <li>
                                        <a href="#">Sự đổi mới</a>
                                    </li>
                                    <li>
                                        <a href="#">Chứng nhận</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                            <div className="footer__widget">
                                <h6>Tham gia bản tin của chúng tôi ngay bây giờ</h6>
                                <p>
                                    Nhận thông tin cập nhật qua E-mail về cửa hàng mới nhất của chúng tôi và các ưu đãi
                                    đặc biệt..
                                </p>
                                <input
                                    type="text"
                                    placeholder="Nhập email của bạn"
                                    id="id-input"
                                    style={{ paddingLeft: 13 }}
                                />
                                <button type="submit" className="site-btn">
                                    Đăng ký
                                </button>
                                <div className="footer__widget__social">
                                    <a href="#">
                                        <i className="fa fa-facebook" />
                                    </a>
                                    <a href="#">
                                        <i className="fa fa-instagram" />
                                    </a>
                                    <a href="#">
                                        <i className="fa fa-twitter" />
                                    </a>
                                    <a href="#">
                                        <i className="fa fa-pinterest" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="footer__copyright">
                                <div className="footer__copyright__text">
                                    <p>
                                        {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                                        Copyright 2021 © Website được phát triển bởi LKshop | Luôn đồng hành cùng bạn{' '}
                                        <i className="fa fa-heart" aria-hidden="true" /> Hãy đến với chúng tôi{' '}
                                        <a href="#" target="_blank">
                                            LKshop
                                        </a>
                                    </p>
                                </div>
                                <div className="footer__copyright__payment">
                                    <img src="img/payment-item.png" alt />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default ClientFooter;
