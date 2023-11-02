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
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
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
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
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
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
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
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
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
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
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
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
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
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
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
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
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
            <div className="row d-flex justify-content-center">
                <div className="col-8">
                    <SaleReportMonth />
                </div>
            </div>
            <div className="row mt-5 d-flex justify-content-center">
                <div className="col-8">
                    <SaleReportDay />
                </div>
            </div>
        </div>
    );
}

export default DashBoard;
