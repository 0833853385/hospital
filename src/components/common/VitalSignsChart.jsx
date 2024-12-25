import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VitalSignsChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="measured_at" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line yAxisId="left" type="monotone" dataKey="heart_rate" stroke="#82ca9d" />
        <Line yAxisId="left" type="monotone" dataKey="respiratory_rate" stroke="#ffc658" />
        <Line yAxisId="right" type="monotone" dataKey="oxygen_saturation" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default VitalSignsChart;