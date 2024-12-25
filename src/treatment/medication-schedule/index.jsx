// src/treatment/medication-schedule/index.jsx
import { useState, useEffect } from 'react';
import { Card, Table, Badge, Row, Col, Button, Form } from 'react-bootstrap';
import { format, isSameDay } from 'date-fns';
import vi from 'date-fns/locale/vi';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaFilePdf, FaBell, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MedicationSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { prescriptionId } = useParams();

  // Fetch medication schedules
  useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);

  const fetchSchedules = async (date) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/medication-schedules`, {
        params: {
          date: format(date, 'yyyy-MM-dd'),
          prescriptionId,
        },
      });
      if (response?.data) {
        console.log('response: ', response);
        setScheduleData(response.data?.metadata);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsTaken = async (scheduleId) => {
    try {
      await axios.patch(`/api/medication-schedules/${scheduleId}`, {
        status: 'completed',
        taken_time: new Date().toISOString(),
      });
      fetchSchedules(selectedDate);
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const handleToggleReminder = async (scheduleId, enabled) => {
    try {
      await axios.patch(`/api/presciption/medication-schedules/${scheduleId}`, {
        reminder_enabled: enabled,
      });
      fetchSchedules(selectedDate);
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: <Badge bg="success">Đã uống</Badge>,
      pending: <Badge bg="warning">Chưa uống</Badge>,
      missed: <Badge bg="danger">Bỏ lỡ</Badge>,
    };
    return badges[status];
  };

  const exportSchedule = async () => {
    try {
      const response = await axios.get('/api/medication-schedules/export', {
        params: {
          date: format(selectedDate, 'yyyy-MM-dd'),
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `medication-schedule-${format(selectedDate, 'dd-MM-yyyy')}.pdf`
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting schedule:', error);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Lịch uống thuốc</h5>
        <Button
          variant="outline-primary"
          onClick={exportSchedule}
          className="d-flex align-items-center gap-2"
        >
          <FaFilePdf />
          Xuất PDF
        </Button>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={4}>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              locale={vi}
              className="w-100 mb-4"
            />
            <Card className="bg-light">
              <Card.Body>
                <h6>Chú thích</h6>
                <div className="d-flex flex-column gap-2">
                  {getStatusBadge('completed')} <small>Đã uống thuốc</small>
                  {getStatusBadge('pending')} <small>Chưa đến giờ uống</small>
                  {getStatusBadge('missed')} <small>Bỏ lỡ thời gian uống</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <h6 className="mb-3">
              Lịch uống thuốc ngày: {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}
            </h6>
            <Table responsive bordered hover>
              <thead>
                <tr className="text-center">
                  <th>Thời gian</th>
                  <th>Tên thuốc</th>
                  <th>Liều lượng</th>
                  <th>Hướng dẫn</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {console.log('sheng', scheduleData)}
                {scheduleData?.map((schedule) => (
                  <tr key={schedule.id} className="text-center">
                    <td>{format(new Date(schedule.schedule_time), 'HH:mm')}</td>
                    <td>{schedule.PrescriptionMedicine.Medicine.name}</td>
                    <td>{`${schedule.PrescriptionMedicine.dosage}`}</td>
                    <td>
                      <small>{schedule.PrescriptionMedicine.instructions || 'N/A'}</small>
                    </td>
                    <td>{getStatusBadge(schedule.status)}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          size="sm"
                          variant={schedule.status === 'completed' ? 'success' : 'outline-primary'}
                          onClick={() => handleMarkAsTaken(schedule.id)}
                          disabled={schedule.status === 'completed'}
                        >
                          <FaCheck className="me-1" />
                          {schedule.status === 'completed' ? 'Đã uống' : 'Đánh dấu đã uống'}
                        </Button>
                        <Form.Check
                          type="switch"
                          id={`reminder-switch-${schedule.id}`}
                          checked={schedule.reminder_enabled}
                          onChange={(e) => handleToggleReminder(schedule.id, e.target.checked)}
                          label={<FaBell />}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default MedicationSchedule;
