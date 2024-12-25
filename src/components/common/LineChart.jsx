import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', bloodPressure: 120, heartRate: 70 },
  { name: 'Feb', bloodPressure: 125, heartRate: 72 },
  { name: 'Mar', bloodPressure: 130, heartRate: 75 },
  // Thêm dữ liệu khác
];

const HealthLineChart = () => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="bloodPressure" stroke="#8884d8" />
      <Line type="monotone" dataKey="heartRate" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
);

export default HealthLineChart;
