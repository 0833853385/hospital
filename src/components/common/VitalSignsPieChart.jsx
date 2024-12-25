import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const VitalSignsPieChart = ({ data }) => {
  // Chúng ta sẽ sử dụng bản ghi mới nhất cho biểu đồ tròn
  const latestData = data[data.length - 1];

  const pieData = [
    { name: 'Nhiệt độ', value: latestData.temperature },
    { name: 'Nhịp tim', value: latestData.heart_rate },
    { name: 'Tần số hô hấp', value: latestData.respiratory_rate },
    { name: 'Độ bão hòa oxy', value: latestData.oxygen_saturation }
  ];

  return (
    <div>
      <h2>Biểu đồ Tròn Vital Signs (Thời điểm: {new Date(latestData.measured_at).toLocaleString()})</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalSignsPieChart;