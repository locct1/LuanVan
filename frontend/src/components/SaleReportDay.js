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
import { useProductPurchaseOrderData } from '~/hooks/react-query/productpurchaseorderData';
import { usePromotionProductsData } from '~/hooks/react-query/promotionproductData';
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
    const { isLoadingOrders, data: dataOrders } = useOrdersData();
    const { isLoading, data: dataProductPurchaseOrders } = useProductPurchaseOrderData();
    const { isLoading: isLoadingPromotionProducts, data: dataPromotionProducts } = usePromotionProductsData();
    const [salesReport, setSalesReports] = useState();
    const [listOrders, setListOrders] = useState([]);
    const [listProductPurchaseOrders, setListProductPurchaseOrders] = useState([]);
    const [listPromotionProducts, setListPromotionProducts] = useState([]);
    const [checked, setChecked] = useState();
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
    );
    const [endDate, setEndDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 23, 59, 59),
    );
    const handleSetStartDate = (date) => {
        // if (date.getDate() === endDate.getDate() || date > endDate) {
        //     setEndDate(new Date(new Date(date).setDate(new Date(date).getDate() + 1)));
        // }
        setStartDate(date);
    };
    const handleSetChecked = (data) => {
        // if (date.getDate() === endDate.getDate() || date > endDate) {
        //     setEndDate(new Date(new Date(date).setDate(new Date(date).getDate() + 1)));
        // }
        setChecked(data);
    };
    const handleSetEndDate = (date) => {
        if (date.getDate() === startDate.getDate() || date < startDate) {
            setStartDate(new Date(new Date(date).setDate(new Date(date).getDate() - 1)));
        }

        setEndDate(date);
    };
    useEffect(() => {
        setChecked('Day');
    }, []);
    useEffect(() => {
        if (
            dataOrders &&
            dataOrders.data &&
            dataProductPurchaseOrders &&
            dataProductPurchaseOrders.data &&
            dataPromotionProducts &&
            dataPromotionProducts.data &&
            checked === 'Day'
        ) {
            const ordersInDateRange = dataOrders.data.filter((order) => {
                const createdAt = new Date(order.createdAt);
                return order.orderStatusId !== 6 && createdAt >= startDate && createdAt <= endDate;
            });
            const productPurchaseOrdersInDateRange = dataProductPurchaseOrders.data.filter((order) => {
                const purchaseDate = new Date(order.purchaseDate);
                return purchaseDate >= startDate && purchaseDate <= endDate;
            });
            const filteredPromotionProducts = dataPromotionProducts.data.filter((product) => {
                const productStartDate = new Date(product.startDate);
                const productEndDate = new Date(product.endDate);
                return productStartDate <= endDate && productEndDate >= startDate;
            });
            console.log({ filteredPromotionProducts, dataPromotionProducts });
            setListOrders(ordersInDateRange);
            setListProductPurchaseOrders(productPurchaseOrdersInDateRange);
            setListPromotionProducts(filteredPromotionProducts);
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
                if (order.orderStatusId !== 6) {
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
        if (
            dataOrders &&
            dataOrders.data &&
            dataProductPurchaseOrders &&
            dataProductPurchaseOrders.data &&
            dataPromotionProducts &&
            dataPromotionProducts.data &&
            checked === 'Month'
        ) {
            const monthYearLabels = generateMonthYearLabels(startDate, endDate);
            console.log({ monthYearLabels });
            // Lọc dữ liệu cho từng tháng và năm
            const ordersInDateRange = dataOrders.data.filter((order) => {
                let createdAt = new Date(order.createdAt);
                createdAt = formatDateToMonthYear(createdAt);
                console.log({ createdAt });
                return order.orderStatusId !== 6 && monthYearLabels.includes(createdAt);
            });
            console.log({ ordersInDateRange });
            const productPurchaseOrdersInDateRange = dataProductPurchaseOrders.data.filter((order) => {
                let purchaseDate = new Date(order.purchaseDate);
                purchaseDate = formatDateToMonthYear(purchaseDate);
                return monthYearLabels.includes(purchaseDate);
            });

            const filteredPromotionProducts = dataPromotionProducts.data.filter((product) => {
                // Chuyển đổi ngày bắt đầu và kết thúc sản phẩm khuyến mãi thành chuỗi "Tháng MM/YYYY"
                const productStartMonthYear = formatDateToMonthYear(new Date(product.startDate));
                const productEndMonthYear = formatDateToMonthYear(new Date(product.endDate));

                return monthYearLabels.some((label) => {
                    return productStartMonthYear <= label && label <= productEndMonthYear;
                });
            });

            setListOrders(ordersInDateRange);
            setListProductPurchaseOrders(productPurchaseOrdersInDateRange);
            setListPromotionProducts(filteredPromotionProducts);

            // Tạo danh sách labels mới cho biểu đồ
            let data = {
                labels: monthYearLabels,
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
            const monthlySales = Array(monthYearLabels.length).fill(0);

            // Lặp qua danh sách đơn hàng và tính tổng doanh thu cho từng tháng và năm
            dataOrders.data.forEach((order) => {
                if (order.orderStatusId !== 6) {
                    const createdAt = formatDateToMonthYear(new Date(order.createdAt));
                    const index = monthYearLabels.findIndex((label) => label === createdAt);
                    if (index !== -1) {
                        monthlySales[index] += order.total;
                    }
                }
            });

            data.datasets[0].data = monthlySales;
            setSalesReports(data);
        }
    }, [dataOrders, startDate, endDate, dataPromotionProducts, dataProductPurchaseOrders, checked]);
    console.log(listOrders);
    function generateMonthYearLabels(startDate, endDate) {
        const labels = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
            labels.push(`Tháng ${month.toString().padStart(2, '0')}/${year}`);
            currentDate.setMonth(currentDate.getMonth() + 1); // Tăng tháng lên 1
        }

        return labels;
    }
    function formatDateToMonthYear(date) {
        const months = [
            'Tháng 01',
            'Tháng 02',
            'Tháng 03',
            'Tháng 04',
            'Tháng 05',
            'Tháng 06',
            'Tháng 07',
            'Tháng 08',
            'Tháng 09',
            'Tháng 10',
            'Tháng 11',
            'Tháng 12',
        ];

        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${month}/${year}`;
    }
    const calculateTotal = () => {
        if (listOrders && listOrders.length) {
            const totalSum = listOrders.reduce((accumulator, order) => accumulator + order.total, 0);
            return totalSum;
        }
        return 0; // Trả về 0 nếu listOrders không tồn tại hoặc rỗng
    };
    const calculateTotalProductPurchaseOrders = () => {
        if (listProductPurchaseOrders && listProductPurchaseOrders.length) {
            const totalSum = listProductPurchaseOrders.reduce((accumulator, order) => accumulator + order.total, 0);
            return totalSum;
        }
        return 0; // Trả về 0 nếu listOrders không tồn tại hoặc rỗng
    };
    if (isLoadingOrders || isLoading || isLoadingPromotionProducts) {
        return <></>;
    }
    return (
        <>
            <div className="row mb-2 mt-4">
                <div className="col-12">
                    <h4 className="font-weight-bold">Thống kê theo khoảng thời gian</h4>
                </div>
                <div className="col-lg-6 mt-2 ml-2">
                    <div className="form-check mb-2">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            onChange={() => handleSetChecked('Month')}
                            checked={checked === 'Month'}
                        />
                        <label className="form-check-label" htmlFor="defaultCheck1">
                            Theo tháng
                        </label>
                    </div>
                    <div className="form-check mb-2">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            onChange={() => handleSetChecked('Day')}
                            checked={checked === 'Day'}
                        />
                        <label className="form-check-label" htmlFor="defaultCheck1">
                            Theo ngày
                        </label>
                    </div>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-8">
                    {checked === 'Day' && (
                        <>
                            {' '}
                            <div className="row mt-3">
                                <div className="col-6">
                                    <div className="row">
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
                        </>
                    )}
                    {checked === 'Month' && (
                        <>
                            {' '}
                            <div className="row mt-3">
                                <div className="col-6">
                                    <div className="row">
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
                                                showMonthYearPicker
                                                dateFormat="MM/yyyy"
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
                                                showMonthYearPicker
                                                dateFormat="MM/yyyy"
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
                        </>
                    )}
                    {salesReport ? (
                        <>
                            {' '}
                            <Line options={options} data={salesReport} />
                        </>
                    ) : (
                        <></>
                    )}
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
                                                {listProductPurchaseOrders && listProductPurchaseOrders.length ? (
                                                    <>
                                                        {' '}
                                                        {String(calculateTotalProductPurchaseOrders()).replace(
                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                            '$1,',
                                                        )}
                                                    </>
                                                ) : (
                                                    <>0</>
                                                )}
                                                <sup>đ</sup>
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
                                                Tổng giá trị đơn hàng
                                            </div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                {listOrders && listOrders.length ? (
                                                    <>
                                                        {' '}
                                                        {String(calculateTotal()).replace(
                                                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                            '$1,',
                                                        )}
                                                    </>
                                                ) : (
                                                    <>0</>
                                                )}
                                                <sup>đ</sup>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {listPromotionProducts && listPromotionProducts.length > 0 ? (
                            listPromotionProducts.map((item, index) => {
                                const totalValue = item.promotionProductDetails.reduce((acc, detail) => {
                                    return acc + detail.discountedPrice * detail.quantity;
                                }, 0);
                                return (
                                    <div
                                        className="col-xl-3 col-md-6 mb-4"
                                        key={index}
                                        style={{ cursor: 'pointer' }}
                                        //  onClick={() => handleGetPromotionProduct(item)}
                                    >
                                        <div className="card border-left-primary shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                            {item.name}
                                                        </div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                            {String(totalValue).replace(
                                                                /(\d)(?=(\d\d\d)+(?!\d))/g,
                                                                '$1,',
                                                            )}
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
                </div>
            </div>
        </>
    );
}

export default SaleReportDay;
