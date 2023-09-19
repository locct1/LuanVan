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
    return (
        <div className="container">
            <div className="row mb-2">
                <div className="col-12">
                    <h4>Tổng quan</h4>
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
