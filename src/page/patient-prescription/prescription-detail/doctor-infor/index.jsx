import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

const DoctorInfor = ({ doctor }) => {
  const [doctorData, setDoctorData] = useState(null);

  const formatDoctorInfor = (doctor) => {
    if (!doctor) return null;

    return {
      id: doctor.id,
      name: `${doctor.first_name} ${doctor.last_name}`,
      specializations:
        doctor.Specializations?.map((specialization) => specialization.specialization_name).join(
          ', '
        ) || 'Bác sĩ đa khoa',
      phone_number: doctor.phone_number,
    };
  };
  useEffect(() => {
    const result = formatDoctorInfor(doctor);
    if (result) {
      setDoctorData(result);
    }
  }, [doctor]);

  return (
    <Row className="mb-4">
      <Col>
        <Card className="border h-100">
          <Card.Body>
            <h5 className="card-title mb-3">Thông tin bác sĩ</h5>
            <div className="info-group mb-2">
              <label className="text-muted">Bác sĩ kê đơn</label>
              <p className="mb-1 fw-bold">{doctorData?.name}</p>
            </div>
            <div className="info-group mb-2">
              <label className="text-muted">Khoa</label>
              <p className="mb-1">{doctorData?.specializations}</p>
            </div>
            <div className="info-group">
              <label className="text-muted">Mã số bác sĩ</label>
              <p className="mb-0">{doctorData?.id}</p>
            </div>
            <div className="info-group">
              <label className="text-muted">Số điện thoại</label>
              <p className="mb-0">{doctorData?.phone_number}</p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default DoctorInfor;
