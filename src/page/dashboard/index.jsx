import { axiosInstance } from '@/common/utils/axios';
import ReportService from '@/service/report';
import { API_URL } from '@/treatment/common/constant';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [visitDatas, setVisitData] = useState([]);
  const [statistics, setStatistics] = useState({
    totalPatient: 0,
    todayAppointments: 0,
    totalDoctor: 0,
    totalNurse: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await ReportService.getStatistics();

        const { metadata } = response || {};
        if (metadata) {
          const {
            totalPatient = 0,
            totalAppointmentToday = 0,
            totalDoctor = 0,
            totalNurse = 0,
          } = metadata;

          setStatistics({
            totalPatient,
            totalAppointmentToday,
            totalDoctor,
            totalNurse,
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchVisitData();
  }, []);

  const fetchVisitData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/report/statistics/monthly-visits`);
      setVisitData(response.data);
    } catch (error) {
      console.error('Error fetching monthly visit data:', error);
    }
  };

  // Mock data for charts
  const visitData = [
    { month: 'T1', visits: 320 },
    { month: 'T2', visits: 280 },
    { month: 'T3', visits: 450 },
    { month: 'T4', visits: 400 },
    { month: 'T5', visits: 380 },
    { month: 'T6', visits: 520 },
  ];

  const departmentData = [
    { name: 'Nội khoa', value: 35 },
    { name: 'Nhi khoa', value: 25 },
    { name: 'Da liễu', value: 20 },
    { name: 'Răng hàm mặt', value: 15 },
    { name: 'Tai mũi họng', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const recentAppointments = [
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      time: '09:00',
      department: 'Nội khoa',
      status: 'waiting',
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      time: '09:30',
      department: 'Nhi khoa',
      status: 'in-progress',
    },
    {
      id: 3,
      patientName: 'Lê Văn C',
      time: '10:00',
      department: 'Da liễu',
      status: 'completed',
    },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      waiting: { variant: 'warning', text: 'Đang chờ' },
      'in-progress': { variant: 'primary', text: 'Đang khám' },
      completed: { variant: 'success', text: 'Hoàn thành' },
      cancelled: { variant: 'danger', text: 'Đã hủy' },
    };
    return statusMap[status] || { variant: 'secondary', text: 'Không xác định' };
  };

  return (
    <Container fluid className="p-4">
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-4 mb-lg-0">
          <Card className="h-100 border-left-primary">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Tổng số bệnh nhân
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {statistics.totalPatient?.toLocaleString()}
                  </div>
                </div>
                <div className="fa-2x text-gray-300">
                  <i className="fas fa-users"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-4 mb-lg-0">
          <Card className="h-100 border-left-success">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Lịch hẹn hôm nay
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {statistics.totalAppointmentToday}
                  </div>
                </div>
                <div className="fa-2x text-gray-300">
                  <i className="fas fa-calendar-check"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-4 mb-lg-0">
          <Card className="h-100 border-left-info">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Tổng số bác sĩ
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {statistics.totalDoctor}
                  </div>
                </div>
                <div className="fa-2x text-gray-300">
                  <i className="fas fa-prescription"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="h-100 border-left-warning">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Tổng số nhân viên y tế
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {statistics.totalNurse.toLocaleString()}
                  </div>
                </div>
                <div className="fa-2x text-gray-300">
                  <i className="fas fa-dollar-sign"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card>
            <Card.Header className="py-3 d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">Thống kê lượt khám theo tháng</h6>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={visitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="#0088FE" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-primary">Phân bố theo khoa</h6>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Appointments */}
      <Row>
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-primary">Lịch hẹn gần đây</h6>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Bệnh nhân</th>
                    <th>Thời gian</th>
                    <th>Khoa</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.patientName}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.department}</td>
                      <td>
                        <Badge bg={getStatusBadge(appointment.status).variant}>
                          {getStatusBadge(appointment.status).text}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          <i className="fas fa-eye"></i>
                        </Button>
                        <Button variant="outline-success" size="sm">
                          <i className="fas fa-check"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="text-center mt-3">
                <Button variant="outline-primary">Xem tất cả lịch hẹn</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-primary">Thông báo mới</h6>
            </Card.Header>
            <Card.Body>
              <div className="notification-item p-2 border-bottom">
                <div className="d-flex align-items-center mb-1">
                  <Badge bg="info" className="me-2">
                    Mới
                  </Badge>
                  <small className="text-muted">10 phút trước</small>
                </div>
                <p className="mb-0">Bệnh nhân Nguyễn Văn A đã đặt lịch khám</p>
              </div>
              <div className="notification-item p-2 border-bottom">
                <div className="d-flex align-items-center mb-1">
                  <small className="text-muted">30 phút trước</small>
                </div>
                <p className="mb-0">Cập nhật kết quả xét nghiệm cho bệnh nhân Trần B</p>
              </div>
              <div className="text-center mt-3">
                <Button variant="outline-primary">Xem tất cả thông báo</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
