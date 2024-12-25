import Page from '../../common/components/Page';
import '../add/index.css';
import FormProvider from '../../common/components/hook-form/FormProvider';
import RHFTextField from '../../common/components/hook-form/RHFTextField';
import RHFSelect from '../../common/components/hook-form/RHFSelect';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Row, Col } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { Box, FormControlLabel, MenuItem, Radio, RadioGroup, Stack } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'; // Import Day.js
import { useEffect, useState } from 'react';
import TimeItem from './components/TimeItem';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { axiosInstance } from '@/common/utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { PATH_HOME } from '@/common/routes/path';

function generateTimeSlots() {
  const times = [];

  const addTimeSlots = (startHour, startMinute, endHour, endMinute) => {
    let start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    while (start <= end) {
      const hours = Math.floor(start / 60);
      const minutes = start % 60;
      const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      times.push(timeString);
      start += 30;
    }
  };

  addTimeSlots(7, 30, 10, 30);
  addTimeSlots(13, 0, 16, 30);

  return times;
}

const AppointmentAdd = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const times = generateTimeSlots();

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);

  const validationSchema = Yup.object().shape({
    hoten: Yup.string()
      .required('Vui lòng nhập họ và tên')
      .matches(
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớ���ởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/,
        'Họ tên không được chứa ký tự đặc biệt hoặc số'
      ),
    email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số')
      .min(10, 'Số điện thoại phải có ít nhất 10 số')
      .required('Vui lòng nhập số điện thoại'),
    location: Yup.string().required('Vui lòng nhập địa chỉ'),
    bacsi: Yup.string().required('Vui lòng chọn bác sĩ'),
    chuyenkhoa: Yup.string().required('Vui lòng chọn chuyên khoa'),
    date: Yup.date().required('Vui lòng chọn ngày hẹn'),
    time: Yup.string().required('Vui lòng chọn giờ hẹn'),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      hoten: '',
      email: '',
      phone: '',
      location: '',
      phongkham: '',
      bacsi: '',
      chuyenkhoa: '',
      date: null,
      time: null,
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = methods;

  const selectedSpecialization = watch('chuyenkhoa');
  const selectedDoctor = watch('bacsi');
  const selectedDate = watch('date');

  const fetchDoctorAvailability = async (doctorId, date) => {
    const startTime = date.startOf('day').toISOString();
    const endTime = date.endOf('day').toISOString();

    try {
      const response = await axiosInstance.get(
        `/doctor/${doctorId}/availability/between?start_time=${startTime}&end_time=${endTime}`
      );
      const availability = response.data.metadata;
      const availableSlots = [];

      availability.forEach((slot) => {
        let start = dayjs(slot.start_time);
        const end = dayjs(slot.end_time);

        while (start.isBefore(end)) {
          availableSlots.push(start.format('HH:mm'));
          start = start.add(30, 'minute');
        }
      });

      // Fetch scheduled appointments for the day
      const appointmentsResponse = await axiosInstance.get(
        `/appointment/doctor/${doctorId}?date=${date.format('YYYY-MM-DD')}`
      );
      const appointments = appointmentsResponse.data.metadata;

      // Filter out the times that are already booked
      const bookedTimes = appointments.map((appointment) =>
        dayjs(appointment.actual_start_time).format('HH:mm')
      );
      const filteredSlots = availableSlots.filter((slot) => !bookedTimes.includes(slot));

      setAvailableTimes(filteredSlots);
    } catch (error) {
      console.error('Failed to fetch doctor availability:', error);
    }
  };

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchDoctorAvailability(selectedDoctor, selectedDate);
    }
  }, [selectedDoctor, selectedDate]);

  const handleTimeSlotSelect = (value) => {
    setSelectedTimeSlot(value);
    setValue('time', value, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      console.log('Form data:', data);

      const appointmentDateTime = dayjs(data.date)
        .hour(parseInt(selectedTimeSlot.split(':')[0]))
        .minute(parseInt(selectedTimeSlot.split(':')[1]));

      const appointmentData = {
        patient_id: parseInt(patientId),
        doctor_id: parseInt(data.bacsi),
        appointment_taken_date: appointmentDateTime.toISOString(),
        actual_start_time: appointmentDateTime.toISOString(),
        reason_for_visit: data.note,
        status: 'pending',
      };

      await axiosInstance.post('/appointment', appointmentData);

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Đặt lịch thành công!',
        text: 'Thông tin lịch hẹn của bạn đã được ghi nhận',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate(PATH_HOME.appointment.calendar); // Replace with your desired path
      });
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error('Có lỗi xảy ra khi lưu thông tin');

      // Show error message
      await Swal.fire({
        icon: 'error',
        title: 'Đặt lịch thất bại!',
        text: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#d33',
      });
    }
  };

  const [specializations, setSpecializations] = useState([]);
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    if (!selectedSpecialization) {
      setStaffList([]);
      setValue('bacsi', '');
      return;
    }

    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get(
          `/doctor/specialization/${selectedSpecialization}`,
          {}
        );
        setStaffList(response.data.metadata);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchDoctors();
  }, [selectedSpecialization, setValue]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axiosInstance.get(`/specialization/get`);
        setSpecializations(response.data.metadata);
      } catch (error) {
        console.error('Failed to fetch specializations:', error);
      }
    };

    fetchSpecializations();
  }, []);

  console.log('errors', errors);

  return (
    <Page>
      <div className="p-2">
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <h3 className="mb-4 fw-bold">Đăng ký lịch hẹn khám</h3>
          <Row className="mb-3">
            <h4 className="mb-4 fw-bold"> Chọn</h4>
            <Col md={4}>
              <Stack gap={5}>
                <RHFSelect name="chuyenkhoa" label="Chuyên khoa" SelectProps={{ native: false }}>
                  <MenuItem value="" disabled />
                  {specializations?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.specialization_name}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect name="bacsi" label="Bác sĩ" SelectProps={{ native: false }}>
                  {staffList?.length === 0 ? (
                    <MenuItem value="" disabled>
                      {selectedSpecialization
                        ? 'Không có bác sĩ cho chuyên khoa này'
                        : 'Vui lòng chọn chuyên khoa'}
                    </MenuItem>
                  ) : (
                    staffList?.map((staff) => (
                      <MenuItem key={staff.id} value={staff.id}>
                        {staff.first_name} {staff.last_name}
                      </MenuItem>
                    ))
                  )}
                </RHFSelect>
              </Stack>
            </Col>
            <Col md={6}>
              <Stack gap={5} mb={'20px'}>
                <Controller
                  name="date"
                  control={methods.control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        {...field}
                        label="Chọn ngày"
                        minDate={dayjs()}
                        maxDate={dayjs(`${currentYear}-12-31`)}
                        openTo="year"
                        views={['year', 'month', 'day']}
                        sx={{
                          width: '400px',
                        }}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
                {errors.date && <div className="text-danger">{errors.date.message}</div>}
              </Stack>
              <Stack direction={'row'} gap={'15px'} flexWrap={'wrap'}>
                {availableTimes.map((value) => {
                  return (
                    <Box key={value} onClick={() => handleTimeSlotSelect(value)}>
                      <TimeItem isActive={selectedTimeSlot === value} value={value} />
                    </Box>
                  );
                })}
                {errors.time && <div className="text-danger">{errors.time.message}</div>}
              </Stack>
            </Col>
          </Row>

          <Row className="mb-5">
            <h4 className="mb-4 fw-bold"> Thông tin cá nhân</h4>
            <Col md={6}>
              <RHFTextField name="hoten" label={'Họ và tên'} />
              {errors.hoten && <span className="text-danger"></span>}
            </Col>

            <Col md={6}>
              <RHFTextField name="email" label={'Email'} />
              {errors.email && <span className="text-danger"></span>}
            </Col>
            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="gender">
              <FormControlLabel value="female" control={<Radio />} label="Nam" />
              <FormControlLabel value="male" control={<Radio />} label="Nữ" />
              <FormControlLabel value="other" control={<Radio />} label="Khác" />
            </RadioGroup>
          </Row>

          <Row className="mb-5">
            <Col md={6}>
              <RHFTextField name="phone" label={'Số điện thoại'} />
              {errors.phone && <span className="text-danger"></span>}
            </Col>
            <Col md={6}>
              <RHFTextField name="location" label={'Địa chỉ'} />
              {errors.location && <span className="text-danger"></span>}
            </Col>
          </Row>

          <Row className="mb-5">
            <Col md={12}>
              <h5> Lý do đặt lịch hẹn/ khám chữa bệnh</h5>
              <RHFTextField
                name={'note'}
                fullWidth
                multiline
                rows={12}
                placeholder="Nhập ghi chú cho lịch hẹn của bạn"
                variant="outlined"
              />
            </Col>
          </Row>
          <Row className="justify-content-center mb-5">
            <Col md={6} className="text-center">
              <Button type="submit" disabled={isSubmitting} variant="primary">
                Gửi thông tin
              </Button>
            </Col>
          </Row>
        </FormProvider>
      </div>
    </Page>
  );
};

export default AppointmentAdd;
