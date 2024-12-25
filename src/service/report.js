import axios from 'axios';
import { API_URL } from '@App/treatment/common/constant';

const ReportService = {
    getStatistics: async () => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const response = await axios.get(`${API_URL}/api/report/statistics`, {
          params: {
            appointment_date: formattedDate,
          },
        });
        return response.data;
      },
};

export default ReportService;