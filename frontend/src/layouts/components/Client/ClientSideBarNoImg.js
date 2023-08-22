import HeroCategories from './SideBar/HeroCategories';
import Search from './SideBar/Search';

function ClientSideBarNoImg() {
    return (
        <>
            <section className="hero hero-normal">
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
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ClientSideBarNoImg;
