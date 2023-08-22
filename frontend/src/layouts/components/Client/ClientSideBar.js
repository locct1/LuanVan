import HeroCategories from './SideBar/HeroCategories';
import Search from './SideBar/Search';

function ClientSideBar() {
    return (
        <>
            <section className="hero">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <HeroCategories />
                        </div>
                        <div className="col-lg-9">
                            <div className="hero__search">
                                <Search />

                                <div className="hero__search__phone">
                                    <div className="hero__search__phone__icon">
                                        <i className="fa fa-phone" />
                                    </div>
                                    <div className="hero__search__phone__text">
                                        <h5>+65 11.188.888</h5>
                                        <span>support 24/7 time</span>
                                    </div>
                                </div>
                            </div>
                            <div id="demo" className="carousel slide" data-ride="carousel">
                                {/* Indicators */}
                                <ul className="carousel-indicators">
                                    <li data-target="#demo" data-slide-to={0} className />
                                    <li data-target="#demo" data-slide-to={1} className />
                                    <li data-target="#demo" data-slide-to={2} className />
                                    <li data-target="#demo" data-slide-to={3} className="active" />
                                </ul>
                                {/* The slideshow */}
                                <div className="carousel-inner">
                                    <div className="carousel-item" data-interval={3000}>
                                        <img
                                            src="/img/client/banner/banner1.png"
                                            alt="Los Angeles"
                                            width={1100}
                                            height={500}
                                            className="border"
                                        />
                                    </div>
                                    <div className="carousel-item" data-interval={3000}>
                                        <img
                                            src="/img/client/banner/banner10.png"
                                            alt="Chicago"
                                            width={1100}
                                            height={500}
                                            className="border"
                                        />
                                    </div>
                                    <div className="carousel-item" data-interval={3000}>
                                        <img
                                            src="/img/client/banner/banner11.jpg"
                                            alt="Chicago"
                                            width={1100}
                                            height={500}
                                            className="border"
                                        />
                                    </div>
                                    <div className="carousel-item active" data-interval={3000}>
                                        <img
                                            src="/img/client/banner/banner4.png"
                                            alt="New York"
                                            width={1100}
                                            height={500}
                                            className="border"
                                        />
                                    </div>
                                </div>
                                {/* Left and right controls */}
                                <a className="carousel-control-prev" href="#demo" data-slide="prev">
                                    <i className="fa fa-chevron-left" />
                                </a>
                                <a className="carousel-control-next" href="#demo" data-slide="next">
                                    <i className="fa fa-chevron-right" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ClientSideBar;
