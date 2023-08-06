import Header from '~/layouts/components/AdminHeader';
import SideBar from '~/layouts/components/AdminSideBar';
import classNames from 'classnames/bind';
import '~/assets/admin/vendor/fontawesome-free/css/all.min.css';
import '~/assets/admin/css/sb-admin-2.css';
import useScript from '~/hooks/useScript';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./AdminLayout.scss"
// const cx = classNames.bind(styles);

function AdminLayout({ children }) {
    useScript('https://code.jquery.com/jquery-3.6.3.min.js');
    useScript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.9.2/umd/popper.min.js');
    useScript('https://startbootstrap.github.io/startbootstrap-sb-admin-2/vendor/bootstrap/js/bootstrap.bundle.min.js');
    useScript('https://startbootstrap.github.io/startbootstrap-sb-admin-2/vendor/jquery-easing/jquery.easing.min.js');
    useScript('https://startbootstrap.github.io/startbootstrap-sb-admin-2/js/sb-admin-2.min.js');

    const navigate = useNavigate();
    const [isActive, setActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const handleSidebarToggle = () => {
        setActive(!isActive);
    };
    let toggled = isActive ? 'toggled' : '';
    useEffect(() => {
        if (isActive === true) {
            document.body.classList.add('sidebar-toggled');
        } else {
            document.body.classList.remove('sidebar-toggled');
        }
        return function cleanup() {
            document.body.classList.remove('sidebar-toggled');
        };
    }, [isActive]);
    return (
        <div id="page-top">
            {/* Page Wrapper */}
            <div id="wrapper" className="admin-layout">
                {/* Sidebar */}
                <SideBar sidebarToggle={handleSidebarToggle} toggled={toggled} />
                {/* End of Sidebar */}
                {/* Content Wrapper */}
                <div id="content-wrapper" className="d-flex flex-column">
                    {/* Main Content */}
                    <div id="content">
                        {/* Topbar */}
                        <Header sidebarToggle={handleSidebarToggle} />
                        {/* End of Topbar */}
                        {/* Begin Page Content */}
                        <div className="container-fluid">{children}</div>
                        {/* /.container-fluid */}
                    </div>
                    {/* End of Main Content */}
                    {/* Footer */}
                    <footer className="sticky-footer bg-white">
                        <div className="container my-auto">
                            <div className="copyright text-center my-auto">
                                <span>Copyright © Your Website 2022</span>
                            </div>
                        </div>
                    </footer>
                    {/* End of Footer */}
                </div>
                {/* End of Content Wrapper */}
            </div>
            {/* End of Page Wrapper */}
            {/* Scroll to Top Button*/}
            <a className="scroll-to-top rounded" href="#page-top">
                <i className="fas fa-angle-up" />
            </a>
        </div>
    );
}

export default AdminLayout;
