import { useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Page from '../../../common/components/Page';
import FormProvider from '../../../common/components/hook-form/FormProvider';
import RHFTextField from '../../../common/components/hook-form/RHFTextField';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { axiosInstance } from '@/common/utils/axios';
import { API_TREATMENT_RECORD } from '@/common/constant/common.constant';
import { useDispatch } from '@/common/redux/store';
import useToast from '@/common/hooks/useToast';
import { useParams } from 'react-router-dom';
import { setCountFetchVitalSign } from '@/treatment/common/treatment.slice';

// Define Yup schema
const validationSchema = yup.object().shape({
  weight: yup.number().required('Cân nặng là bắt buộc').typeError('Cân nặng phải là số'),
  height: yup.number().required('Chiều cao là bắt buộc').typeError('Chiều cao phải là số'),
  heartRate: yup.number().required('Nhịp tim là bắt buộc').typeError('Nhịp tim phải là số'),
  respiratoryRate: yup.number().required('Nhịp thở là bắt buộc').typeError('Nhịp thở phải là số'),
  bloodPressure: yup.string().required('Huyết áp là bắt buộc'),
  temperature: yup.number().required('Nhiệt độ là bắt buộc').typeError('Nhiệt độ phải là số'),
  note: yup.string(),
});

const calculateBMI = (weight, height) => {
  if (weight && height) {
    return (weight / (height / 100) ** 2).toFixed(2);
  }
  return '';
};

const VitalSignForm = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      weight: '',
      height: '',
      heartRate: '',
      respiratoryRate: '',
      bloodPressure: '',
      temperature: '',
      bmi: '',
      note: '',
    },
  });
  const { handleSubmit, watch, setValue, register, reset } = methods;

  const weight = watch('weight');
  const height = watch('height');

  const { showToast, Toast } = useToast();

  useEffect(() => {
    const bmi = calculateBMI(weight, height);
    setValue('bmi', parseInt(bmi));
  }, [weight, height, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(
        `${API_TREATMENT_RECORD}/${params?.medicalRecordId}/vital-signs`,
        {
          weight: data?.weight,
          height: data?.height,
          heart_rate: data?.heartRate,
          respiratory_rate: data?.respiratoryRate,
          blood_pressure: data?.bloodPressure,
          temperature: data?.temperature,
          bmi: data?.bmi,
          note: data?.note,
        }
      );
      dispatch(setCountFetchVitalSign());
      showToast('success', 'Submitted successfully!');
      reset();
      console.log('Submitted Data:', response.data);
    } catch (error) {
      showToast('error', 'Error submitting data!');
      console.error('Error submitting data:', error);
    }
  };

  return (
    <Page>
      <div className="p-2">
        <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
          <h3 className="mb-4 fw-bold">Vital sign</h3>

          <Row className="mb-3">
            <Col md={4}>
              <RHFTextField name={'weight'} label="Cân nặng (KG)" placeholder="Cân nặng (KG)" />
            </Col>
            <Col md={4}>
              <RHFTextField name="height" placeholder="Chiều cao" label="Chiều cao" />
            </Col>
            <Col md={4}>
              <RHFTextField name="temperature" placeholder="Nhiệt độ" label="Nhiệt độ (C)" />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <RHFTextField name="heartRate" placeholder="Nhịp tim" label="Nhịp tim" />
            </Col>
            <Col md={4}>
              <RHFTextField name="respiratoryRate" placeholder="Nhịp thở" label="Nhịp thở" />
            </Col>
            <Col md={4}>
              <RHFTextField name="bloodPressure" placeholder="Huyết áp" label="Huyết áp" />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <RHFTextField
                shrink
                name="bmi"
                InputLabelProps={{ shrink: true }}
                placeholder="BMI"
                label="BMI"
                readOnly
              />
            </Col>
          </Row>

          <Form.Group controlId="note">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              {...register('note')}
              as="textarea"
              rows={3}
              name="note"
              placeholder="Ghi chú"
            />
          </Form.Group>

          <div className="mt-4 text-end">
            <Button
              variant="primary"
              type="submit"
              className="fw-bold"
              style={{ minWidth: '150px' }}
            >
              Lưu lại
            </Button>
            <Button
              variant="outline-secondary"
              className="ms-3 fw-bold"
              type="button"
              style={{ minWidth: '100px' }}
            >
              Hủy
            </Button>
          </div>
        </FormProvider>
        <Toast />
      </div>
    </Page>
  );
};

export default VitalSignForm;
