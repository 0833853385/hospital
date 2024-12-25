import { useParams, useNavigate } from 'react-router-dom';
import Page from '../../../common/components/Page';
import { Card, Button, Row, Col, Badge, Table } from 'react-bootstrap';
import { FaArrowLeft, FaPrint, FaEdit } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import PrescriptionMedicineService from '../../../service/prescriptionMedicine';
import PrescriptionService from '../../../service/prescription';
import DoctorInfor from './doctor-infor';
import PrescriptionMedicine from './prescription-medicine';

const PrescriptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presciption, setPrescription] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPrescriptionById = async (id) => {
    setIsLoading(true);
    try {
      const response = await PrescriptionService.getById(id);
      if (response?.data) {
        setPrescription(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching prescription', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getPrescriptionById(id);
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading prescription...</div>;
  }

  const prescriptionData = {
    id: id,
    patientInfo: {
      name: 'Nguyễn Văn A',
      age: 35,
      gender: 'Nam',
      medicalRecordId: 'BN001',
      diagnosis: 'Viêm họng cấp',
    },
    doctorInfo: {
      name: 'Bs. Nguyễn Văn An',
      department: 'Khoa Nội',
      licenseNumber: 'CMD001',
    },
    prescriptionInfo: {
      date: '2024-03-15 09:30:00',
      status: 'Đã kê đơn',
      note: 'Uống thuốc sau bữa ăn, mỗi ngày 3 lần',
    },
    medications: [
      {
        id: 1,
        name: 'Paracetamol',
        dosage: '500mg',
        quantity: 20,
        frequency: '3 lần/ngày',
        duration: '7 ngày',
        instructions: 'Uống sau ăn',
      },
      {
        id: 2,
        name: 'Amoxicillin',
        dosage: '500mg',
        quantity: 30,
        frequency: '2 lần/ngày',
        duration: '10 ngày',
        instructions: 'Uống trước ăn 30 phút',
      },
    ],
  };

  return (
    <Page>
      <div className="prescription-detail">
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <Button
                  variant="link"
                  className="p-0 me-3"
                  onClick={() => navigate('/dashboard/prescription/list')}
                >
                  <FaArrowLeft className="text-primary" />
                </Button>
                <h4 className="mb-0 text-primary">Đơn thuốc #{id}</h4>
              </div>
              <Button variant="outline-primary" className="me-2">
                <FaPrint className="me-2" />
                In đơn thuốc
              </Button>
            </div>

            <div className="mb-4">
              <Badge bg="success" className="me-2">
                {presciption?.status?.toUpperCase()}
              </Badge>
              <span className="text-muted">
                Ngày kê đơn: {new Date(presciption.prescribed_at).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <DoctorInfor doctor={presciption?.doctor} />
            <Card className="border">
              <Card.Body>
                <h5 className="card-title mb-3">Chi tiết đơn thuốc</h5>
                <PrescriptionMedicine presciptionId={id} />
                <div className="mt-4">
                  <h6 className="text-muted mb-2">Ghi chú</h6>
                  <p className="mb-0">{presciption?.notes}</p>
                </div>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </div>
    </Page>
  );
};

export default PrescriptionDetail;
