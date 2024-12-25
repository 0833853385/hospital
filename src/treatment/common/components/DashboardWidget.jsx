import { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Widget from './Widget';
import {
  FaUserPlus,
  FaUserNurse,
  FaUserMd,
  FaVials,
  FaFileInvoiceDollar,
  FaCheck,
} from 'react-icons/fa';
import { axiosInstance } from '@/common/utils/axios';
import { API_MEDICAL_RECORDS_STATUSES_COUNT } from '@/common/constant/common.constant';
import { useSelector } from '@/common/redux/store';
import { STATUSES_TREATMENT } from '../constant';

const DashboardWidgets = () => {
  const [data, setData] = useState({
    registeredPatients: 0,
    nursesHandling: 0,
    doctorsHandling: 0,
    patientsWaitingForTests: 0,
    patientsBilling: 0,
    completedPatients: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(API_MEDICAL_RECORDS_STATUSES_COUNT);
        const { metadata } = response.data;
        setData({
          registeredPatients: metadata.created || 0,
          nursesHandling: metadata.nurse_received || 0,
          doctorsHandling: metadata.doctor_received || 0,
          patientsWaitingForTests: metadata.waiting_lab || 0,
          patientsBilling: metadata.waiting_payment || 0,
          completedPatients: metadata.completed || 0,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const widgets = [
    {
      title: 'Bệnh nhân đăng ký khám',
      status: STATUSES_TREATMENT[0].status,
      value: data.registeredPatients,
      icon: <FaUserPlus />,
      backgroundColor: '#E8F5E9',
      textColor: '#2E7D32',
      iconColor: '#66BB6A',
      activeColor: '#A5D6A7',
    },
    {
      title: 'Y tá tiếp nhận bệnh nhân',
      status: STATUSES_TREATMENT[1].status,
      value: data.nursesHandling,
      icon: <FaUserNurse />,
      backgroundColor: '#FFF8E1',
      textColor: '#F9A825',
      iconColor: '#FFD54F',
      activeColor: '#FFE082',
    },
    {
      title: 'Bác sĩ tiếp nhận bệnh nhân',
      status: STATUSES_TREATMENT[2].status,
      value: data.doctorsHandling,
      icon: <FaUserMd />,
      backgroundColor: '#E3F2FD',
      textColor: '#1565C0',
      iconColor: '#42A5F5',
      activeColor: '#90CAF9',
    },
    {
      title: 'Bệnh nhân chờ làm xét nghiệm',
      status: STATUSES_TREATMENT[3].status,
      value: data.patientsWaitingForTests,
      icon: <FaVials />,
      backgroundColor: '#F3E5F5',
      textColor: '#6A1B9A',
      iconColor: '#AB47BC',
      activeColor: '#CE93D8',
    },
    {
      title: 'Bệnh nhân làm thủ tục thanh toán',
      status: STATUSES_TREATMENT[4].status,
      value: data.patientsBilling,
      icon: <FaFileInvoiceDollar />,
      backgroundColor: '#FFEBEE',
      textColor: '#C62828',
      iconColor: '#EF5350',
      activeColor: '#EF9A9A',
    },
    {
      title: 'Bệnh nhân hoàn thành khám',
      status: STATUSES_TREATMENT[5].status,
      value: data.completedPatients,
      icon: <FaCheck />,
      backgroundColor: '#E3F2FD',
      textColor: '#1565C0',
      iconColor: '#42A5F5',
      activeColor: '#90CAF9',
    },
  ];

  const currentMedicalRecordStatus = useSelector(
    (state) => state.treatment?.currentMedicalRecordStatus
  );

  return (
    <Row className="p-1">
      {widgets.map((widget, index) => (
        <Col key={index} md={6} lg={4} className="mb-4">
          <Widget
            title={widget.title}
            value={widget.value}
            icon={widget.icon}
            backgroundColor={widget.backgroundColor}
            textColor={widget.textColor}
            iconColor={widget.iconColor}
            activeColor={widget.activeColor}
            status={widget.status}
            isActive={widget.status === currentMedicalRecordStatus}
          />
        </Col>
      ))}
    </Row>
  );
};

export default DashboardWidgets;
