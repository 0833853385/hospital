import Page from '../../../common/components/Page';
import TableContainer from '../../../common/components/table/TableContainer';
import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { getPrescriptionStatusStyle, replacePathParams } from '../../../common/utils/common.utils';
import { PATH_DASHBOARD } from '../../../common/routes/path';
import Pagination from '../../../common/components/Pagination';
import { axiosInstance } from '@/common/utils/axios';
import { API_PRESCRIPTION_LIST } from '@/common/constant/common.constant';
import { useSelector } from '@/common/redux/store';

const TablePrescription = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const presciptionPerPage = 5;
  const [totalPages, setTotalPages] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const { patientId } = params;
  const [isLoading, setIsLoading] = useState(true);
  const role = useSelector((state) => state.auth.user.role);

  useEffect(() => {
    const fetchPrescriptionsByPatient = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`${API_PRESCRIPTION_LIST}/${patientId}`);
        if (response?.data?.status == 200) {
          console.log(response);
          setPrescriptions(response.data.metadata || []);
          setTotalPages(Math.ceil(response.data.total / presciptionPerPage));
        }
      } catch (error) {
        console.error('Error fetching presciption list:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrescriptionsByPatient(patientId);
  }, [patientId]);

  const header = [
    'id',
    'medical_record_id',
    'doctor_name',
    'prescribed_at',
    'notes',
    'status',
    'updated_at',
  ];

  const formatPrescriptionData = (prescriptions) => {
    return prescriptions.map((prescription) => ({
      id: prescription.id,
      medical_record_id: prescription.medical_record_id,
      doctor_name: `${prescription.Doctor?.first_name} ${prescription.Doctor?.last_name}`,
      prescribed_at: new Date(prescription.prescribed_at).toLocaleDateString('vi-VN'),
      notes: prescription.notes || 'N/A',
      status: (
        <span className={getPrescriptionStatusStyle(prescription.status)}>
          {prescription.status.toUpperCase()}
        </span>
      ),
      updated_at: new Date(prescription.updated_at).toLocaleDateString('vi-VN'),
    }));
  };

  const filteredPrescriptions = prescriptions
    ? formatPrescriptionData(prescriptions).filter(
        (prescription) =>
          prescription.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prescription.notes.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const indexOfLastPrescription = currentPage * presciptionPerPage;
  const indexOfFirstPrescription = indexOfLastPrescription - presciptionPerPage;
  const currentPresciption = filteredPrescriptions.slice(
    indexOfFirstPrescription,
    indexOfLastPrescription
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (id) => {
    navigate(
      replacePathParams(PATH_DASHBOARD.treatment.detailPrescription, {
        patientId: params.patientId,
        prescriptionId: id,
        medicalRecordId: params.medicalRecordId,
      })
    );
  };

  const headerMapping = {
    id: '#',
    medical_record_id: 'Mã bệnh án',
    doctor_name: 'Bác sĩ',
    prescribed_at: 'Ngày kê đơn',
    notes: 'Ghi chú',
    status: 'Trạng thái',
    updated_at: 'Ngày cập nhật',
  };

  return (
    <Page>
      <div className="prescription-page">
        <Card className="outline-0 border-0">
          <Card.Body>
            <Row className="justify-content-between p-3">
              <Col xs={12} sm={12} md={4} lg={4}>
                <h4 className="mb-0 text-primary">Danh sách đơn thuốc</h4>
              </Col>
              <Col xs={12} sm={12} md={4} lg={4}>
                <InputGroup>
                  <InputGroup.Text className="bg-light">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Tìm kiếm theo bác sĩ hoặc ghi chú..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-left-0"
                  />
                </InputGroup>
              </Col>
            </Row>
            {console.log('currentPresciption: ', currentPresciption)}
            <div className="table-container">
              <TableContainer
                headerMapping={headerMapping}
                header={header}
                data={currentPresciption}
                isActionButton={!(role === 'nurse')}
                className="table-hover"
                onRowClick={handleRowClick}
                buttonTitle="Thêm đơn thuốc mới"
                onHandleAdd={() => {
                  navigate(
                    replacePathParams(PATH_DASHBOARD.treatment.prescribe, {
                      patientId: params?.patientId,
                      medicalRecordId: params?.medicalRecordId,
                    })
                  );
                }}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Card.Body>
        </Card>
      </div>
    </Page>
  );
};

export default TablePrescription;
