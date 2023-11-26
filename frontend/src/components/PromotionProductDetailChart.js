import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
            text: 'Chart.js Bar Chart',
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            ticks: {
                stepSize: 1,
            },
        },
    },
};
function PromotionProductDetailChart({ promotionProductDetails }) {
    const [dataChart, setDataChart] = useState();
    useEffect(() => {
        if (promotionProductDetails && promotionProductDetails) {
            let data = {
                labels: [],
                datasets: [
                    {
                        label: 'Số lượng',
                        data: [],
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],
            };
            // Loop through orders and accumulate sales by month if status is 3

            promotionProductDetails.map((item, index) => {
                let productName = '';
                if (item.productVersion.ram != null && item.productVersion.rom != null) {
                    productName = item.productVersion.ram.name + 'GB' + '-' + item.productVersion.rom.name + 'GB';
                }
                data.labels[index] =
                    item.productVersion.product.name + ' ' + productName + ' (' + item.colorProduct.name + ')';
                data.datasets[0].data[index] = item.quantity;
                // data.datasets.backgroundColor[index] = 'rgba(255, 99, 132, 0.2)';
                // data.datasets.borderColor[index] = 'rgba(255, 99, 132, 0.2)';
            });
            setDataChart(data);
        }
    }, [promotionProductDetails]);
    return (
        <>
            {dataChart ? (
                <>
                    <Bar options={options} data={dataChart} />;
                </>
            ) : (
                <></>
            )}
        </>
    );
}

export default PromotionProductDetailChart;
