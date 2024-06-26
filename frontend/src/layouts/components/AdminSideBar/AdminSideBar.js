import classNames from 'classnames/bind';
import styles from './AdminSideBar.module.scss';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { infoAdminSelector } from '~/redux/selectors';
import './AdminSideBar.scss';
function AdminSideBar({ sidebarToggle, toggled }) {
    const cx = classNames.bind(styles);
    // const infoAdmin = useSelector(infoAdminSelector);
    const infoAdmin = true;
    const classNameFunc = ({ isActive }) => (isActive ? 'nav-link admin-active' : 'nav-link');
    return (
        <ul className={`navbar-nav bg-primary-custom sidebar sidebar-dark accordion ${toggled}`} id="accordionSidebar">
            {/* Sidebar - Brand */}
            <NavLink className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink" />
                </div>

                <div className="sidebar-brand-text mx-3"> Quản trị viên</div>
            </NavLink>
            {/* Divider */}
            <hr className="sidebar-divider my-0" />
            {/* Nav Item - Dashboard */}
            <li className="nav-item">
                <NavLink to="/admin-dashboard" className="nav-link">
                    <i className="fas fa-fw fa-tachometer-alt"></i>
                    Tổng quan
                </NavLink>
            </li>
            {/* Divider */}
            <hr className="sidebar-divider" />
            {/* Heading */}
            <div className="sidebar-heading">Quản lý</div>
            {/* Nav Item - Pages Collapse Menu */}
            {/* Nav Item - Charts */}

            <li className="nav-item">
                <NavLink to="/admin-list-warehouses" className={classNameFunc}>
                    <i className="fas fa-fw fa-chart-area" />
                    <span>Quản lý kho </span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/admin-list-suppliers" className={classNameFunc}>
                    <i className="fas fa-fw fa-chart-area" />
                    <span>Quản lý nhà cung cấp </span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/admin-list-colorproducts" className={classNameFunc}>
                    <i className="fas fa-fw fa-chart-area" />
                    <span>Quản lý màu sắc</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/admin-list-brands" className={classNameFunc}>
                    <i className="fas fa-fw fa-chart-area" />
                    <span>Quản lý thương hiệu</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/admin-list-products" className={classNameFunc}>
                    <i className="fas fa-fw fa-chart-area" />
                    <span>Quản lý sản phẩm</span>
                </NavLink>
            </li>
            {/* Divider */}
            <hr className="sidebar-divider d-none d-md-block" />
            {/* Sidebar Toggler (Sidebar) */}
            <div className="text-center d-none d-md-inline">
                <button
                    className="rounded-circle border-0"
                    onClick={() => {
                        sidebarToggle();
                    }}
                    id="sidebarToggle"
                />
            </div>
        </ul>
    );
}

export default AdminSideBar;
