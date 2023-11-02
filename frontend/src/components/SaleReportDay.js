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
import viLocale from 'date-fns/locale/vi';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);
export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Thống kê doanh thu theo ngày',
        },
    },
};

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
function SaleReportDay() {
    const { isLoadingOrders, data: dataOrders, isError, error } = useOrdersData();
    const [salesReport, setSalesReports] = useState();
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
    );
    const [endDate, setEndDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59),
    );
    const handleSetStartDate = (date) => {
        // if (date.getDate() === endDate.getDate() || date > endDate) {
        //     setEndDate(new Date(new Date(date).setDate(new Date(date).getDate() + 1)));
        // }
        setStartDate(date);
    };
    const handleSetEndDate = (date) => {
        if (date.getDate() === startDate.getDate() || date < startDate) {
            setStartDate(new Date(new Date(date).setDate(new Date(date).getDate() - 1)));
        }

        setEndDate(date);
    };
    useEffect(() => {
        if (dataOrders && dataOrders.data) {
            const dateList = [];
            const labels = [];

            const currentDate = new Date(startDate);

            while (currentDate <= endDate) {
                dateList.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1); // Tăng ngày lên 1
            }
            dateList.forEach((date) => {
                const day = date.getDate().toString().padStart(2, '0'); // Lấy ngày và định dạng thành DD
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng và định dạng thành MM
                const label = `${day}-${month}`;
                labels.push(label);
            });
            let data = {
                labels,
                datasets: [
                    {
                        fill: true,
                        label: 'VNĐ',
                        data: [],
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],
            };
            const dailySales = Array(dateList.length).fill(0);

            // Lặp qua danh sách đơn hàng và tính tổng doanh thu cho mỗi ngày
            dataOrders.data.forEach((order) => {
                if (order.orderStatusId === 4) {
                    const updatedAt = new Date(order.updatedAt);
                    const day = updatedAt.getDate().toString().padStart(2, '0');
                    const month = (updatedAt.getMonth() + 1).toString().padStart(2, '0');
                    const orderDate = `${day}-${month}`;
                    const index = labels.findIndex((label) => label === orderDate);
                    if (index !== -1) {
                        dailySales[index] += order.total;
                    }
                }
            });
            data.datasets[0].data = dailySales;
            setSalesReports(data);
        }
    }, [dataOrders, startDate, endDate]);
    if (isLoadingOrders) {
        return <></>;
    }
    return (
        <>
            <div className="row mt-3">
                <div className="col-6">
                    <div className="row">
                        {' '}
                        <div className="mt-3 col-4">
                            <span className="font-weight-bold">Ngày bắt đầu:</span>
                        </div>
                        <div className="col-8">
                            <DatePicker
                                dayClassName={() => 'example-datepicker-day-class'}
                                popperClassName="example-datepicker-class"
                                todayButton="TODAY"
                                locale="vi"
                                className="mt-2 form-control"
                                selected={startDate}
                                onChange={(date) => handleSetStartDate(date)}
                                dateFormat="dd/MM/yyyy"
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '33%',
                                    right: '148px',
                                }}
                            >
                                <i className="fas fa-calendar-alt"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-6">
                    <div className="row">
                        {' '}
                        <div className="mt-3 col-4">
                            <span className="font-weight-bold">Ngày kết thúc:</span>
                        </div>
                        <div className="col-8">
                            <DatePicker
                                dayClassName={() => 'example-datepicker-day-class'}
                                popperClassName="example-datepicker-class"
                                todayButton="TODAY"
                                locale="vi"
                                className="mt-2 form-control"
                                selected={endDate}
                                onChange={(date) => handleSetEndDate(date)}
                                dateFormat="dd/MM/yyyy"
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '33%',
                                    right: '148px',
                                }}
                            >
                                <i className="fas fa-calendar-alt"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>{' '}
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

export default SaleReportDay;
