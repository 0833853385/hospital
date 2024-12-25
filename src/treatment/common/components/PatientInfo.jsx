import Page from '../../../common/components/Page';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../common/utils/axios';
import { API_PATIENT } from '../../../common/constant/common.constant';
import { useParams } from 'react-router-dom';

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const PatientInfo = () => {
  const params = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await axiosInstance.get(`${API_PATIENT}/${params?.patientId}`);
        setPatient(response.data?.metadata);
      } catch (error) {
        console.error('Error fetching patient info:', error);
      }
    };

    fetchPatientInfo();
  }, []);

  return (
    <Page>
      <div className="w-100 justify-content-center align-items-center">
        <div className="d-flex flex-row justify-content-evenly align-items-center">
          <div className="d-flex flex-row gap-4 align-items-center">
            <h6 className="m-0">Mã bệnh nhân:</h6>
            <h6 className="m-0" style={{ color: '#FF4842' }}>
              {patient?.id}
            </h6>
          </div>
          <div className="d-flex flex-row gap-4 align-items-center">
            <h6 className="m-0">Tên bệnh nhân:</h6>
            <h6 className="m-0" style={{ color: '#FF4842' }}>
              {patient?.full_name}
            </h6>
          </div>
          <div className="d-flex flex-row gap-4 align-items-center">
            <h6 className="m-0">Tuổi:</h6>
            <h6 className="m-0" style={{ color: '#FF4842' }}>
              {patient ? calculateAge(patient.dob) : ''}
            </h6>
          </div>
          <div className="d-flex flex-row gap-4 align-items-center">
            <h6 className="m-0">Số điện thoại:</h6>
            <h6 className="m-0" style={{ color: '#FF4842' }}>
              {patient?.phone}
            </h6>
          </div>
          <div
            className=""
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#ccc',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          ></div>
        </div>
      </div>
    </Page>
  );
};

export default PatientInfo;
