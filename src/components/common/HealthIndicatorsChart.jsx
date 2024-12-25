import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HealthIndicatorsChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date_joined),
    datasets: [
      {
        label: 'Blood Pressure',
        data: data.map(item => item.full_name),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Heart Rate',
        data: data.map(item => item.phone),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
      // Thêm các chỉ số khác nếu cần
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Health Indicators Over Time',
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default HealthIndicatorsChart;
