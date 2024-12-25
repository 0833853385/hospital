import { Modal, Box, Button, TextField, Typography, Grid2 } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';

// Define Yup schema
const validationSchema = yup.object().shape({
  searchTerm: yup.string().required('Tên bệnh là bắt buộc'),
  note: yup.string().required('Ghi chú là bắt buộc'),
  icd10: yup.string().required('Mã ICD-10 là bắt buộc'),
  treatmentPlan: yup.string().required('Kế hoạch điều trị là bắt buộc'),
  symptoms: yup.string().required('Triệu chứng là bắt buộc'),
  takeTime: yup.string().required('Thời gian chẩn đoán là bắt buộc'),
});

const ModalEditDiagnosis = ({ disease, onClose, onUpdateDisease }) => {
  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      icd10: disease.icd10,
      searchTerm: disease.searchTerm,
      note: disease.note,
      treatmentPlan: disease.treatmentPlan,
      symptoms: disease.symptoms,
      takeTime: disease.takeTime,
    },
  });

  useEffect(() => {
    setValue('icd10', disease.icd10);
    setValue('searchTerm', disease.searchTerm);
    setValue('note', disease.note);
    setValue('treatmentPlan', disease.treatmentPlan);
    setValue('symptoms', disease.symptoms);
    setValue('takeTime', disease.takeTime);
  }, [disease, setValue]);

  const onSubmit = (data) => {
    const updatedDisease = { ...disease, ...data };
    onUpdateDisease(updatedDisease);
    onClose();
  };

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Chỉnh sửa bệnh
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12}>
              <Controller
                name="icd10"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Mã ICD-10"
                    InputProps={{ readOnly: true }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <Controller
                name="searchTerm"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Tên bệnh"
                    InputProps={{ readOnly: true }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <Controller
                name="disease_description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Mô tả bệnh"
                    InputProps={{ readOnly: true }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Ghi chú" multiline rows={3} />
                )}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <Controller
                name="treatmentPlan"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label="Kế hoạch điều trị" />}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <Controller
                name="symptoms"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label="Triệu chứng" />}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <Controller
                name="takeTime"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Thời gian chẩn đoán" />
                )}
              />
            </Grid2>
          </Grid2>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="secondary" onClick={onClose} sx={{ mr: 2 }}>
              Đóng
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Lưu thay đổi
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalEditDiagnosis;
