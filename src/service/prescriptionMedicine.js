import axios from 'axios';
import { API_URL } from '../treatment/common/constant';

const PrescriptionMedicineService = {
  getPrescriptionMedicine: async (presciptionId) => {
    const response =  await axios.get(`${API_URL}/api/prescriptionMedicine/get`, {
      params: { presciptionId },
    });
    return response.data
  },
};

export default PrescriptionMedicineService;
