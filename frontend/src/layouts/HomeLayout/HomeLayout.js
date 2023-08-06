import { NavLink, Link } from 'react-router-dom';
// import '~/assets/client/css/bootstrap.min.css';
import '~/assets/client/css/font-awesome.min.css';
import '~/assets/client/css/elegant-icons.css';
import '~/assets/client/css/flaticon.css';
import '~/assets/client/css/owl.carousel.min.css';
import '~/assets/client/css/nice-select.css';
import '~/assets/client/css/jquery-ui.min.css';
import '~/assets/client/css/magnific-popup.css';
import '~/assets/client/css/slicknav.min.css';
import './HomeLayout.scss';
import useScript from '~/hooks/useScript';
import { LINK_APP_FRONTEND } from '~/helpers/constants';

import ClientHeader from '../components/Client/ClientHeader';
import ClientFooter from '../components/Client/ClientFooter';
function HomeLayout({ children }) {
    useScript(LINK_APP_FRONTEND + 'js/client/jquery-3.3.1.min.js');
    useScript(LINK_APP_FRONTEND + 'js/client/bootstrap.min.js');
    useScript(LINK_APP_FRONTEND + 'js/client/jquery.magnific-popup.min.js');
    useScript(LINK_APP_FRONTEND + 'js/client/jquery.nice-select.min.js');
    useScript(LINK_APP_FRONTEND + 'js/client/jquery-ui.min.js');
    useScript(LINK_APP_FRONTEND + 'js/client/jquery.slicknav.js');
    useScript(LINK_APP_FRONTEND + 'js/client/owl.carousel.min.js');
    useScript(LINK_APP_FRONTEND + 'js/client/main.js');
    return (
        <>
            <div className="client-layout">
                <ClientHeader />
                {children}
                {/* About Us Section End */}
                {/* Services Section End */}

                <ClientFooter />
                {/* Footer Section End */}
                {/* Search model Begin */}
            </div>
        </>
    );
}

export default HomeLayout;
