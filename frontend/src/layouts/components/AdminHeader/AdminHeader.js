import classNames from 'classnames/bind';
import styles from './AdminHeader.module.scss';
import { Dropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdminLogout } from '~/redux/Slices/AdminAuthSlice';
import { infoAdminSelector } from '~/redux/selectors';
const cx = classNames.bind(styles);

function AdminHeader({ sidebarToggle }) {
    const dispatch = useDispatch();
    const Logout = async () => {
        dispatch(AdminLogout());
    };
    const infoAdmin = useSelector(infoAdminSelector);
    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            {/* Sidebar Toggle (Topbar) */}
            <button
                id="sidebarToggleTop"
                onClick={() => {
                    sidebarToggle();
                }}
                className="btn btn-link d-md-none rounded-circle mr-3"
            >
                <i className="fa fa-bars" />
            </button>

            {/* Topbar Navbar */}
            <ul className="navbar-nav ml-auto">
                <div className="topbar-divider d-none d-sm-block" />
                {/* Nav Item - User Information */}
                <Dropdown>
                    <Dropdown.Toggle className="bg-primary-custom" id="dropdown-basic" size="sm">
                        {infoAdmin !== null ? <>{infoAdmin.fullName}</> : <>Chưa đăng nhập</>}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Cập nhật thông tin</Dropdown.Item>
                        <Dropdown.Item onClick={() => Logout()}>Đăng xuất</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ul>
        </nav>
    );
}

export default AdminHeader;
