import { DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormProvider from '@/common/components/hook-form/FormProvider';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '@/common/utils/axios';
import { closeModal } from '../calendarSlice';
import { API_DOCTOR_AVAILABILITY } from '@/common/constant/common.constant';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Define Yup schema
const validationSchema = yup.object().shape({
  start: yup.date().required('Bắt đầu là bắt buộc').typeError('Bắt đầu phải là ngày giờ hợp lệ'),
  end: yup.date().required('Kết thúc là bắt buộc').typeError('Kết thúc phải là ngày giờ hợp lệ'),
});

const getInitialValues = (event, range) => {
  const _event = {
    textColor: '#1890FF',
    allDay: false,
    start: range ? dayjs(range?.start) : dayjs(),
    end: range ? dayjs(range?.end) : dayjs(),
  };

  // if (event || range) {
  //   return merge({}, _event, event);
  // }

  return _event;
};

const CalendarForm = ({ event, range, onCancel, onRefresh }) => {
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: getInitialValues(event, range),
  });

  const { handleSubmit, reset, control } = methods;

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(API_DOCTOR_AVAILABILITY, {
        doctor_id: 1,
        day_of_week: data.start,
        start_time: data.start,
        end_time: data.end,
        is_available: true,
      });
      dispatch(closeModal());
      reset();
      onRefresh();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack gap={3}>
            <Controller
              name="start"
              control={control}
              render={({ field }) => (
                <MobileDateTimePicker
                  {...field}
                  label="Start date"
                  inputFormat="dd/MM/yyyy hh:mm a"
                  renderInput={(params) => (
                    <TextField sx={{ minWidth: '300px' }} {...params} fullWidth />
                  )}
                />
              )}
            />
            <Controller
              name="end"
              control={control}
              render={({ field }) => (
                <MobileDateTimePicker
                  {...field}
                  label="End date"
                  inputFormat="dd/MM/yyyy hh:mm a"
                  renderInput={(params) => (
                    <TextField
                      sx={{ minWidth: '300px' }}
                      {...params}
                      fullWidth
                      error={!!isDateError}
                      helperText={isDateError && 'End date must be later than start date'}
                    />
                  )}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </FormProvider>
  );
};

export default CalendarForm;
