import { useNavigate, useParams } from 'react-router-dom';
import Page from '../../common/components/Page';
import { Badge, Button, Card, Col, Row, Table } from 'react-bootstrap';
import { FaArrowLeft, FaCalendar, FaEdit, FaPrint } from 'react-icons/fa';
import MiniSidebar from '../common/components/MiniSidebar';
import { PATH_DASHBOARD } from '@/common/routes/path';
import { axiosInstance } from '@/common/utils/axios';
import { API_PRESCRIPTION } from '@/common/constant/common.constant';
import { useEffect, useState } from 'react';
import { replacePathParams } from '@/common/utils/common.utils';

const PrescriptionDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [patientInfor, setPatientInfor] = useState(null);
  const [doctorInfor, setDoctorInfor] = useState(null);

  useEffect(() => {
    const fetchPresciptionDetail = async () => {
      try {
        const response = await axiosInstance.get(`${API_PRESCRIPTION}/${params?.prescriptionId}`);
        const presciptionDetail = response?.data?.metadata;
        if (presciptionDetail) {
          setPrescriptionData(presciptionDetail);
          setPatientInfor(presciptionDetail.MedicalRecord?.Patient);
          setDoctorInfor(presciptionDetail.Doctor);
        }
        console.log('response:', response);
      } catch (error) {
        console.error('Error fetching presciption detail:', error);
      }
    };
    fetchPresciptionDetail();
  }, [params?.prescriptionId]);

  return (
    <div className="w-100 h-100 d-flex flex-row gap-3 ">
      <div className="" style={{ width: '20%' }}>
        <MiniSidebar />
      </div>
      <Page>
        <div className="w-100 d-flex gap-4 flex-column">
          <Card className="outline-0 border-0 mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <Button variant="link" className="p-0 me-3" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="text-primary" />
                  </Button>
                  <h4 className="mb-0 text-primary">Đơn thuốc #{params?.prescriptionId}</h4>
                </div>
                <div>
                  <Button
                    variant="outline-success"
                    className="me-2"
                    onClick={() => {
                      navigate(
                        replacePathParams(PATH_DASHBOARD.treatment.scheduleMedicine, {
                          patientId: params?.patientId,
                          medicalRecordId: params?.medicalRecordId,
                          prescriptionId: params?.prescriptionId,
                        })
                      );
                    }}
                  >
                    <FaCalendar className="me-2" />
                    Lịch uống thuốc
                  </Button>
                  <Button variant="outline-warning" className="me-2">
                    <FaPrint className="me-2" />
                    In đơn thuốc
                  </Button>
                  <Button variant="primary">
                    <FaEdit className="me-2" />
                    Chỉnh sửa
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <Badge bg="success" className="me-2">
                  {prescriptionData?.status}
                </Badge>
                <span className="text-muted">Ngày kê đơn: {prescriptionData?.prescribed_at}</span>
              </div>

              <Row className="mb-4">
                <Col md={6}>
                  <Card className="border h-100">
                    <Card.Body>
                      <h5 className="card-title mb-3">Thông tin bệnh nhân</h5>
                      <div className="info-group mb-2">
                        <label className="text-muted">Họ và tên</label>
                        <p className="mb-1 fw-bold">{patientInfor?.full_name}</p>
                      </div>
                      <div className="info-group mb-2">
                        <label className="text-muted">Ngày sinh</label>
                        <p className="mb-1">{patientInfor?.dob}</p>
                      </div>
                      <div className="info-group mb-2">
                        <label className="text-muted">Giới tính</label>
                        <p className="mb-1">Nam</p>
                      </div>
                      <div className="info-group mb-2">
                        <label className="text-muted">Mã bệnh án</label>
                        <p className="mb-1">{prescriptionData?.MedicalRecord?.id}</p>
                      </div>
                      <div className="info-group">
                        <label className="text-muted">Chẩn đoán</label>
                        <p className="mb-0">Bệnh nặng</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border h-100">
                    <Card.Body>
                      <h5 className="card-title mb-3">Thông tin bác sĩ</h5>
                      <div className="info-group mb-2">
                        <label className="text-muted">Bác sĩ kê đơn</label>
                        <p className="mb-1 fw-bold">
                          {doctorInfor?.last_name} {doctorInfor?.first_name}
                        </p>
                      </div>
                      <div className="info-group mb-2">
                        <label className="text-muted">Khoa</label>
                        <p className="mb-1">{doctorInfor?.Specializations?.name}</p>
                      </div>
                      <div className="info-group">
                        <label className="text-muted">Mã số bác sĩ</label>
                        <p className="mb-0">{doctorInfor?.id}</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="border">
                <Card.Body>
                  <h5 className="card-title mb-3">Chi tiết đơn thuốc</h5>
                  <Table responsive className="table-hover">
                    <thead className="bg-light">
                      <tr>
                        <th>STT</th>
                        <th>Tên thuốc</th>
                        <th>Liều lượng</th>
                        <th>Số lượng</th>
                        <th>Tần suất</th>
                        <th>Thời gian</th>
                        <th>Hướng dẫn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptionData?.PrescriptionMedicines?.map((med, index) => (
                        <tr key={med.id}>
                          <td>{index + 1}</td>
                          <td>{med.Medicine?.name}</td>
                          <td>{med.dosage}/lần</td>
                          <td>{med.quantity} vĩ</td>
                          <td>{med.frequency}</td>
                          <td>{med.duration} ngày</td>
                          <td>{med.instructions || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="mt-4">
                    <h6 className="text-muted mb-2">Ghi chú</h6>
                    <p className="mb-0">{prescriptionData?.notes}</p>
                  </div>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </div>
      </Page>
    </div>
  );
};

export default PrescriptionDetail;
