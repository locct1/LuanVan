import { NavLink, Link } from 'react-router-dom';
//import '~/assets/client/css/bootstrap.min.css';

import '~/assets/client/css/font-awesome.min.css';
import '~/assets/client/css/elegant-icons.css';
import '~/assets/client/css/owl.carousel.min.css';
import '~/assets/client/css/jquery-ui.min.css';
import '~/assets/client/css/slicknav.min.css';
//import '~/assets/client/css/style.css';
import './HomeLayout.scss';
import useScript from '~/hooks/useScript';
import { LINK_APP_FRONTEND } from '~/helpers/constants';
import ClientHeader from '~/layouts/components/Client/ClientHeader';
import ClientFooter from '~/layouts/components/Client/ClientFooter';
import ClientSideBar from '../components/Client/ClientSideBar';
import ClientCategoriesSection from '../components/Client/ClientCategoriesSection';
import ClientFeaturedSection from '../components/Client/ClientFeaturedSection';
import ClientBlogSection from '../components/Client/ClientBlogSection';
import ClientLatestProduct from '../components/Client/ClientLatestProduct';
import ClientSideBarNoImg from '../components/Client/ClientSideBarNoImg';
import ClientBannerSection from '../components/Client/ClientBannerSection';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { addDocument, generateKeywords } from '~/firebase/services';
import { uid } from 'uid';
import clientChatMessageSlice from '~/redux/Slices/ClientChatMessageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { infoRoomClientChatMessageSelector } from '~/redux/selectors';
import useFirestore from '~/hooks/useFirestore';
import firebase, { auth, db, storage } from '~/firebase/config';
import { AuthContext } from '~/Context/AuthProvider';
import ChatMessageClient from '~/components/Client/ChatMessageClient';
function HomeLayout({ children }) {
    useScript(LINK_APP_FRONTEND + 'js/client/jquery-3.3.1.min.js');
    useScript(LINK_APP_FRONTEND + 'js/client/bootstrap.min.js');
    // useScript(LINK_APP_FRONTEND + 'js/client/jquery.nice-select.min.js');
    useScript(LINK_APP_FRONTEND + 'js/client/jquery-ui.min.js');
    useScript(LINK_APP_FRONTEND + 'js/client/jquery.slicknav.js');
    useScript(LINK_APP_FRONTEND + 'js/client/owl.carousel.min.js');
    useScript(LINK_APP_FRONTEND + 'js/client/mixitup.min.js');
    useScript(LINK_APP_FRONTEND + 'js/client/main.js');

    return (
        <>
            <div className="client-layout">
                <ClientHeader />
                <ClientSideBar />
                {children}
                <ClientFooter />
                <ChatMessageClient />
            </div>
        </>
    );
}

export default HomeLayout;
