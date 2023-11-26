import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
export const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: 'Tổng số sản phẩm',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
};
function TotalProductCategories({ totalListProductCategories }) {
    const [dataProductCategories, setData] = useState();
    useEffect(() => {
        let data = {
            labels: [],
            datasets: [
                {
                    label: 'Tổng số',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)', // Đã sửa để làm màu đậm hơn
                        'rgba(54, 162, 235, 0.5)', // Đã sửa để làm màu đậm hơn
                        'rgba(255, 206, 86, 0.5)', // Đã sửa để làm màu đậm hơn
                        'rgba(75, 192, 192, 0.5)', // Đã sửa để làm màu đậm hơn
                        'rgba(153, 102, 255, 0.5)', // Đã sửa để làm màu đậm hơn
                        'rgba(255, 159, 64, 0.5)', // Đã sử
                        'rgba(255, 0, 0, 0.5)', // Màu mới
                        'rgba(0, 255, 0, 0.5)', // Màu mới
                        'rgba(0, 0, 255, 0.5)', // Màu mới
                        'rgba(128, 0, 128, 0.5)', // Màu mới
                        'rgba(255, 255, 0, 0.5)', // Màu mới
                        'rgba(0, 255, 255, 0.5)', // Màu mới
                        'rgba(128, 128, 0, 0.5)', // Màu mới
                        'rgba(128, 0, 0, 0.5)', // Màu mới
                        'rgba(0, 128, 0, 0.5)', // Màu mới
                        'rgba(0, 0, 128, 0.5)', // Màu mới
                        'rgba(128, 128, 128, 0.5)', // Màu mới
                        'rgba(255, 165, 0, 0.5)', // Màu mới
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)', // Đã sửa để làm màu đậm hơn
                        'rgba(54, 162, 235, 1)', // Đã sửa để làm màu đậm hơn
                        'rgba(255, 206, 86, 1)', // Đã sửa để làm màu đậm hơn
                        'rgba(75, 192, 192, 1)', // Đã sửa để làm màu đậm hơn
                        'rgba(153, 102, 255, 1)', // Đã sửa để làm màu đậm hơn
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 0, 0, 1)', // Màu mới
                        'rgba(0, 255, 0, 1)', // Màu mới
                        'rgba(0, 0, 255, 1)', // Màu mới
                        'rgba(128, 0, 128, 1)', // Màu mới
                        'rgba(255, 255, 0, 1)', // Màu mới
                        'rgba(0, 255, 255, 1)', // Màu mới
                        'rgba(128, 128, 0, 1)', // Màu mới
                        'rgba(128, 0, 0, 1)', // Màu mới
                        'rgba(0, 128, 0, 1)', // Màu mới
                        'rgba(0, 0, 128, 1)', // Màu mới
                        'rgba(128, 128, 128, 1)', // Màu mới
                        'rgba(255, 165, 0, 1)', // Màu mới
                    ],
                    borderWidth: 1,
                },
            ],
        };
        if (totalListProductCategories) {
            totalListProductCategories.map((productCategory, index) => {
                data.labels[index] = productCategory.name;
                data.datasets[0].data[index] = productCategory.total;
                // data.datasets.backgroundColor[index] = 'rgba(255, 99, 132, 0.2)';
                // data.datasets.borderColor[index] = 'rgba(255, 99, 132, 0.2)';
            });
        }
        setData(data);
    }, [totalListProductCategories]);
    return (
        <>
            {dataProductCategories ? (
                <>
                    <Pie data={dataProductCategories} />
                </>
            ) : (
                <></>
            )}
        </>
    );
}

export default TotalProductCategories;
