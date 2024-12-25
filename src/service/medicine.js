import {API_URL} from '@App/treatment/common/constant'
import axios from 'axios'
export const medicineService = {
    getAll: async()=>{
        const response = await axios.get(`${API_URL}/api/medicine/get`)
        return response.data
    }
}