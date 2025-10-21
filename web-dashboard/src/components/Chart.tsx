'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
};

const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const data = {
  labels,
  datasets: [
    {
      label: 'Reports',
      data: [12, 19, 3, 5, 2, 3, 9],
      borderColor: '#ff6600',
      backgroundColor: 'rgba(255, 102, 0, 0.5)',
    },
  ],
};

const Chart = () => {
  return <Line options={options} data={data} />;
};

export default Chart;
