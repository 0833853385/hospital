import { useEffect, useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { axiosInstance } from '@/common/utils/axios';
import { API_MEDICAL_RECORDS, API_DOCTOR_SPECIALIZATION } from '@/common/constant/common.constant';
import useToast from '@/common/hooks/useToast';
import { useNavigate, useParams } from 'react-router-dom';
import { STATUSES_TREATMENT } from '@/treatment/common/constant';
import Page from '@/common/components/Page';
import FormProvider from '@/common/components/hook-form/FormProvider';
import RHFSelect from '@/common/components/hook-form/RHFSelect';
import RHFTextField from '@/common/components/hook-form/RHFTextField';
import { MenuItem } from '@mui/material';

// Define Yup schema
const validationSchema = yup.object().shape({
  symptoms: yup.string(),
  status: yup.string().required('Trạng thái là bắt buộc'),
});

const AddMedicalRecordContainer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      symptoms: '',
      status: STATUSES_TREATMENT[0].status,
      specialization: '',
      doctor: '',
      diagnosis: '',
    },
  });
  const { handleSubmit, reset, setValue, watch } = methods;

  const { showToast, Toast } = useToast();

  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const selectedSpecialization = watch('specialization');

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axiosInstance.get(`${API_DOCTOR_SPECIALIZATION}`);
        setSpecializations(response.data.metadata);
      } catch (error) {
        console.error('Error fetching specializations:', error);
      }
    };

    fetchSpecializations();
  }, []);

  useEffect(() => {
    if (selectedSpecialization) {
      const fetchDoctors = async () => {
        try {
          const response = await axiosInstance.get(
            `/doctor/specialization/${selectedSpecialization}`
          );
          setDoctors(response.data.metadata);
        } catch (error) {
          console.error('Error fetching doctors:', error);
        }
      };

      fetchDoctors();
    } else {
      setDoctors([]);
      setValue('doctor', '');
    }
  }, [selectedSpecialization, setValue]);

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(`${API_MEDICAL_RECORDS}`, {
        patient_id: parseInt(params?.patientId),
        doctor_id: parseInt(data?.doctor),
        symptoms: data?.symptoms,
        status: data?.status,
        diagnosis: '',
      });
      showToast('success', 'Submitted successfully!');
      reset();
      navigate(-1);
    } catch (error) {
      showToast('error', 'Error submitting data!');
      console.error('Error submitting data:', error);
    }
  };

  return (
    <Page>
      <div className="p-2">
        <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
          <h3 className="mb-4 fw-bold">Add Medical Record</h3>

          <Row className="mb-3">
            <Col md={6}>
              <RHFSelect SelectProps={{ native: false }} name="specialization" label="Chuyên khoa">
                <MenuItem value="">Chọn chuyên khoa</MenuItem>
                {specializations.map((specialization) => (
                  <MenuItem key={specialization.id} value={specialization.id}>
                    {specialization.specialization_name}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Col>
            <Col md={6}>
              <RHFSelect name="doctor" label="Bác sĩ" SelectProps={{ native: false }}>
                <MenuItem value="">
                  {selectedSpecialization ? 'Chọn bác sĩ' : 'Vui lòng chọn chuyên khoa trước'}
                </MenuItem>
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.first_name} {doctor.last_name}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <RHFTextField name="symptoms" label="Triệu chứng" placeholder="Triệu chứng" />
            </Col>
          </Row>

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

export default AddMedicalRecordContainer;
