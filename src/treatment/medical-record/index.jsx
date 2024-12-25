import { useSelector } from '@/common/redux/store';
import MiniSidebar from '../common/components/MiniSidebar';
import PatientInfo from '../common/components/PatientInfo';
import MedicalRecordTable from './components/medicalRecordTable';
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/common/utils/axios';
import { API_TREATMENT_RECORD_BY_PATIENT } from '@/common/constant/common.constant';
import { useParams } from 'react-router-dom';

const MedicalRecord = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const getMedicalRecords = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await axiosInstance.get(
        `${API_TREATMENT_RECORD_BY_PATIENT}/${params?.patientId}`
      );
      const records = response.data.metadata;
      setData(
        records?.data?.map((record) => ({
          id: record.id,
          date: new Date(record.created_at).toLocaleDateString(),
          diagnosis: record.diagnosis,
          treatment: record.treatment_plan,
          doctor: `${record.Doctor.first_name} ${record.Doctor.last_name}`,
        }))
      );
    } catch (error) {
      console.error('Error fetching medical records:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params?.patientId) {
      getMedicalRecords();
    }
  }, []);

  const columns = [
    { id: 'date', label: 'Ngày', align: 'center' },
    { id: 'diagnosis', label: 'Chẩn đoán', align: 'center' },
    { id: 'treatment', label: 'Điều trị', align: 'center' },
    { id: 'doctor', label: 'Bác sĩ', align: 'center' },
  ];

  return (
    <div className="w-100 h-100 d-flex flex-row gap-3 ">
      <div className="" style={{ width: '20%' }}>
        <MiniSidebar />
      </div>
      <div className="w-100 d-flex gap-4 flex-column" style={{ marginBottom: '100px' }}>
        <PatientInfo />
        <MedicalRecordTable data={data} columns={columns} isLoading={isLoading} isError={isError} />
      </div>
    </div>
  );
};

export default MedicalRecord;
