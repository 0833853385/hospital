import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

const VitalSignsChart = ({ patientId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/treatment/patient/${patientId}/vital-signs`
        );
        const vitalSigns = response.data.metadata.map((item) => ({
          date: new Date(item.create_at).toISOString().split('T')[0],
          bloodPressure: parseInt(item.blood_pressure),
          heartRate: item.heart_rate,
          temperature: item.temperature,
        }));
        setData(vitalSigns);
      } catch (error) {
        console.error('Error fetching vital signs data', error);
      }
    };

    fetchData();
  }, [patientId]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="bloodPressure" stroke="#8884d8" />
        <Line type="monotone" dataKey="heartRate" stroke="#82ca9d" />
        <Line type="monotone" dataKey="temperature" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default VitalSignsChart;
