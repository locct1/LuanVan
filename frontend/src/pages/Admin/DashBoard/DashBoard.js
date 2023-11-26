import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from 'faker';
import { useOrdersData } from '~/hooks/react-query/orderData';
import SaleReportMonth from '~/components/SaleReportMonth';
import SaleReportDay from '~/components/SaleReportDay';
import { useDashBoardsData } from '~/hooks/react-query/dashboardData';
import LoadingAdmin from '~/components/LoadingAdmin';
import TotalProductCategories from '~/components/TotalProductCategories';
import PromotionProductDetailModal from '~/components/PromotionProductDetailModal';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);
export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Thống kê doanh thu theo tháng',
        },
    },
};

const labelss = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
];
const labels = [
    '01/09',
    '02/09',
    '03/09',
    '04/09',
    '05/09',
    '06/09',
    '07/09',
    '08/09',
    '09/09',
    '10/09',
    '11/09',
    '12/09',
    '13/09',
    '14/09',
    '15/09',
    '16/09',
    '17/09',
    '18/09',
    '19/09',
    '20/09',
    '21/09',
    '22/09',
    '23/09',
    '24/09',
    '25/09',
    '26/09',
    '27/09',
    '28/09',
    '29/09',
    '30/09',
];
export const data = {
    labels,
    datasets: [
        {
            fill: true,
            label: 'VNĐ',
            data: [
                10000000, 2000000, 3000000, 4000000, 10000000, 1200000, 10000, 2000000, 300000, 9000000, 10000000,
                1200000,
            ],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};
function DashBoard() {
    const { isLoading, data, isError, error } = useDashBoardsData();
    const [show, setShow] = useState(false);
    const [promotionProduct, setPromotionProduct] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleGetPromotionProduct = async (promotionProduct) => {
        setPromotionProduct(promotionProduct);
        handleShow();
    };
    if (isLoading) {
        <LoadingAdmin />;
    }
    return (
        <div className="container-flud">
            <div className="row mb-2">
                <div className="col-12">
                    <h4 className="font-weight-bold">Tổng quan</h4>
                </div>
            </div>
            {promotionProduct && (
                <PromotionProductDetailModal show={show} onClose={handleClose} promotionProduct={promotionProduct} />
            )}
            <div className="row">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Tổng số kho
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.amountOfWareHouses ? data.data.amountOfWareHouses : 0} kho
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-secondary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                                        Tổng số nhà cung cấp
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.amountOfSuppliers ? data.data.amountOfSuppliers : 0} nhà cung cấp
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-success shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Tổng số thương hiệu
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.amountOfBrands ? data.data.amountOfBrands : 0} thương hiệu
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-danger shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                        Tổng số loại
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.amountOfProductCategories ? data.data.amountOfProductCategories : 0}{' '}
                                        loại
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-warning shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        Tổng số màu sắc
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.amountOfColorProducts ? data.data.amountOfColorProducts : 0} màu sắc
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                        Tổng số điện thoại
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.amountOfPhones ? data.data.amountOfPhones : 0} điện thoại
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-dark shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-dark text-uppercase mb-1">
                                        Tổng số phụ kiện
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.amountOfAccessories ? data.data.amountOfAccessories : 0} phụ kiện
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-danger shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                        Tổng số mẫu sản phẩm
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.amountOfProductSamples ? data.data.amountOfProductSamples : 0} mẫu
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Tổng số mẫu điện thoại
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.amountOfProductSamplePhones
                                            ? data.data.amountOfProductSamplePhones
                                            : 0}{' '}
                                        mẫu
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-secondary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                                        Tổng số mẫu phụ kiện
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.amountOfProductSampleAccessories
                                            ? data.data.amountOfProductSampleAccessories
                                            : 0}{' '}
                                        mẫu
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-3">
                    <h5 className="font-weight-bold">Tổng sản phẩm: {data?.data.amountOfProducts} </h5>
                    <TotalProductCategories totalListProductCategories={data?.data.totalListProductCategories} />
                </div>
                <div className="col-3">
                    <h5 className="font-weight-bold">Tổng mẫu sản phẩm: {data?.data.amountOfProductSamples} </h5>
                    <TotalProductCategories totalListProductCategories={data?.data.totalListProductSamples} />
                </div>
                <div className="col-3">
                    <h5 className="font-weight-bold">
                        Tổng mẫu sản phẩm theo thương hiệu: {data?.data.amountOfProductSamples}{' '}
                    </h5>
                    <TotalProductCategories totalListProductCategories={data?.data.totalProductSamplesByBrands} />
                </div>
                <div className="col-3">
                    <h5 className="font-weight-bold">
                        Tổng mẫu sản phẩm trong kho:{' '}
                        {data?.data?.totalProductSamplesByWareHouses?.reduce((acc, item) => acc + (item.total || 0), 0)}{' '}
                    </h5>
                    <TotalProductCategories totalListProductCategories={data?.data.totalProductSamplesByWareHouses} />
                </div>
            </div>
            <div className="row mb-2 mt-4">
                <div className="col-12">
                    <h4 className="font-weight-bold">Thống kê tổng doanh số</h4>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Tổng giá trị phiếu nhập
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.totalOfProductPurchaseOrders
                                            ? String(data?.data.totalOfProductPurchaseOrders).replace(
                                                  /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                  '$1,',
                                              )
                                            : 0}
                                        <sup>đ</sup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-secondary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                                        Tổng giá trị đơn hàng
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.totalOfOrders
                                            ? String(data?.data.totalOfOrders).replace(
                                                  /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                  '$1,',
                                              )
                                            : 0}
                                        <sup>đ</sup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                        Tổng đơn hàng hoàn thành
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.amountOfOrdersCompleted}/{data?.data.amountOfOrders}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-danger shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                        Tổng đơn hàng bị hủy
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {data?.data.amountOfOrdersCanceled}/{data?.data.amountOfOrders}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-2 mt-4">
                <div className="col-12">
                    <h4 className="font-weight-bold">Thống kê doanh số đợt khuyến mãi gần nhất</h4>
                </div>
            </div>
            <div className="row">
                {data && data.data && data.data.listPromotionProducts.length > 0 ? (
                    data.data.listPromotionProducts.map((item, index) => {
                        const totalValue = item.promotionProductDetails.reduce((acc, detail) => {
                            return acc + detail.discountedPrice * detail.quantity;
                        }, 0);
                        return (
                            <div
                                className="col-xl-3 col-md-6 mb-4"
                                key={index}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleGetPromotionProduct(item)}
                            >
                                <div className="card border-left-primary shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                    {item.name}
                                                </div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                    {String(totalValue).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                                                    <sup>đ</sup>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <></>
                )}
            </div>
            {/* <div className="row d-flex justify-content-center">
                <div className="col-8">
                    <SaleReportMonth />
                </div>
            </div> */}

            <SaleReportDay />
        </div>
    );
}

export default DashBoard;
