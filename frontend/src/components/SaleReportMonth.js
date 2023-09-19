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

const labels = [
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
// const labels = [
//     '01/09',
//     '02/09',
//     '03/09',
//     '04/09',
//     '05/09',
//     '06/09',
//     '07/09',
//     '08/09',
//     '09/09',
//     '10/09',
//     '11/09',
//     '12/09',
//     '13/09',
//     '14/09',
//     '15/09',
//     '16/09',
//     '17/09',
//     '18/09',
//     '19/09',
//     '20/09',
//     '21/09',
//     '22/09',
//     '23/09',
//     '24/09',
//     '25/09',
//     '26/09',
//     '27/09',
//     '28/09',
//     '29/09',
//     '30/09',
// ];
function SaleReportMonth() {
    const { isLoadingOrders, data: dataOrders, isError, error } = useOrdersData();
    const [salesReport, setSalesReports] = useState();
    useEffect(() => {
        if (dataOrders && dataOrders.data) {
            let data = {
                labels,
                datasets: [
                    {
                        fill: true,
                        label: 'VNĐ',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],
            };
            // Loop through orders and accumulate sales by month if status is 3
            dataOrders.data.forEach((order) => {
                if (order.orderStatusId === 4) {
                    const updatedAt = new Date(order.updatedAt);
                    const month = updatedAt.getMonth(); // Get the month (0-11)
                    data.datasets[0].data[+month] += order.total;
                }
            });
            console.log(data);
            setSalesReports(data);
        }
    }, [dataOrders]);
    if (isLoadingOrders) {
        return <></>;
    }
    return (
        <>
            {' '}
            {salesReport ? (
                <>
                    {' '}
                    <Line options={options} data={salesReport} />
                </>
            ) : (
                <></>
            )}
        </>
    );
}

export default SaleReportMonth;
