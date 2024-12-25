import Page from '../../common/components/Page';
import '../add/index.css';
import FormProvider from '../../common/components/hook-form/FormProvider';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

const DoctorAvailability = () => {
  const methods = useForm({
    defaultValues: {
      scheduleDate: '',
      startTime: '',
      endTime: '',
      reason: ''
    }
  });
  const [registeredSlots, setRegisteredSlots] = useState([]);

  // Tạo danh sách các option cho giờ và phút
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      timeOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  const handleSubmit = (data) => {
    console.log('Schedule Submitted:', data);
    setRegisteredSlots([...registeredSlots, data]);
  };

  return (
    <Page>
      <div className="p-2">
        <div className="container mt-5" style={{ maxWidth: '800px' }}>
          <FormProvider {...methods}>
            <div onSubmit={methods.handleSubmit(handleSubmit)}>
              <h2 className="mb-4 text-center" >Đăng ký lịch làm việc</h2>

              <div className="mb-3">
                <label htmlFor="scheduleDate" className="form-label">
                  Chọn ngày:
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="scheduleDate"
                  {...methods.register('scheduleDate')}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="startTime" className="form-label">
                  Giờ bắt đầu:
                </label>
                <select
                  className="form-select"
                  id="startTime"
                  {...methods.register('startTime')}
                >
                  <option value="">Select start time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="endTime" className="form-label">
                  Giờ kết thúc:
                </label>
                <select
                  className="form-select"
                  id="endTime"
                  {...methods.register('endTime')}
                >
                  <option value="">Select end time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="reason" className="form-label">
                  Ghi chú
                </label>
                <textarea
                  className="form-control"
                  id="reason"
                  rows="3"
                  {...methods.register('reason')}
                />
              </div>

              <div className="mb-3">
              </div>

              {/* Thêm div để căn giữa button */}
              <div className="d-flex justify-content-center mb-3">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  style={{ width: '200px' }}
                  onClick={methods.handleSubmit(handleSubmit)}
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </FormProvider>

          <div className="mt-5">
            <h3 className="mb-4 text-center">Lịch làm việc đã đăng ký</h3>
            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="schedule table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: '600',
                        color: '#2c3e50',
                        fontSize: '0.95rem',
                        padding: '16px'
                      }}
                    >
                      Ngày
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: '600',
                        color: '#2c3e50',
                        fontSize: '0.95rem',
                        padding: '16px'
                      }}
                    >
                      Thời gian
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: '600',
                        color: '#2c3e50',
                        fontSize: '0.95rem',
                        padding: '16px'
                      }}
                    >
                      Ghi chú
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontWeight: '600',
                        color: '#2c3e50',
                        fontSize: '0.95rem',
                        padding: '16px'
                      }}
                    >
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registeredSlots.map((slot, index) => (
                    <TableRow
                      key={index}
                      sx={{ 
                        '&:nth-of-type(odd)': { 
                          backgroundColor: '#fafafa' 
                        },
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          transition: 'background-color 0.2s ease'
                        }
                      }}
                    >
                      <TableCell align="center" sx={{ padding: '16px' }}>
                        {slot.scheduleDate}
                      </TableCell>
                      <TableCell align="center" sx={{ padding: '16px' }}>
                        {`${slot.startTime} - ${slot.endTime}`}
                      </TableCell>
                      <TableCell align="center" sx={{ padding: '16px' }}>
                        {slot.reason}
                      </TableCell>
                      <TableCell align="center" sx={{ padding: '16px' }}>
                        {/* <button 
                          className="btn btn-sm"
                          style={{
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            padding: '6px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                          }}
                          onClick={() => {
                            const newSlots = registeredSlots.filter((_, i) => i !== index);
                            setRegisteredSlots(newSlots);
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
                        >
                          Xóa
                        </button> */}
                      </TableCell>
                    </TableRow>
                  ))}
                  {registeredSlots.length === 0 && (
                    <TableRow>
                      <TableCell 
                        colSpan={4} 
                        align="center"
                        sx={{ 
                          padding: '32px',
                          color: '#7f8c8d',
                          fontSize: '0.95rem'
                        }}
                      >
                        Chưa có lịch làm việc nào được đăng ký
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default DoctorAvailability;
