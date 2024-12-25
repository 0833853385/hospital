import { useEffect, useState } from "react";
import axios from "axios";
import HealthIndicatorsChart from "../../common/HealthIndicatorsChart";

const Chart = () => {
  const [healthData, setHealthData] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/patient/health-indicators`
        );
        setHealthData(response.data);
      } catch (error) {
        console.error("Error fetching health data", error);
      }
    };

    fetchHealthData();
  }, []);

  return (
    <div className="chart p-5">
      <h1 className="fw-900 mt-5">Patient Health Indicators</h1>
      <div className=""></div>
      <div className="w-100 mt-5">
        <HealthIndicatorsChart data={healthData} />
      </div>{" "}
    </div>
  );
};

export default Chart;
