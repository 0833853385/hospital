import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Page from '../../../common/components/Page';
import FormProvider from '../../../common/components/hook-form/FormProvider';
import RHFTextField from '../../../common/components/hook-form/RHFTextField';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { axiosInstance } from '@/common/utils/axios';
import { API_MEDICAL_RECORDS, API_SEARCH_DISEASE } from '@/common/constant/common.constant';
import useToast from '@/common/hooks/useToast';
import { Autocomplete, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';

// Define Yup schema
const validationSchema = yup.object().shape({
  searchTerm: yup.string().required('Search term is required'),
  note: yup.string().required('Note is required'),
  icd10: yup.string().required('ICD-10 code is required'),
  treatmentPlan: yup.string().required('Treatment plan is required'),
  symptoms: yup.string().required('Symptoms are required'),
});

const DiagnosisForm = ({ setIsFetching }) => {
  const { medicalRecordId } = useParams();
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      searchTerm: '',
      note: '',
      icd10: '',
      treatmentPlan: '',
      symptoms: '',
    },
  });
  const { handleSubmit, setValue, reset } = methods;
  const [diseases, setDiseases] = useState([]);
  const { showToast, Toast } = useToast();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (inputValue) {
        handleSearch(inputValue);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  const handleSearch = async (query) => {
    try {
      const response = await axiosInstance.get(`${API_SEARCH_DISEASE}?query=${query}`);
      const diseasesData = response.data.metadata.data.map((disease) => [
        disease.code,
        disease.name,
        disease.description,
      ]);
      setDiseases(diseasesData);
    } catch (error) {
      showToast('error', 'Error fetching diseases!');
      console.error('Error fetching diseases:', error);
    }
  };

  const handleSelectDisease = (event, newValue) => {
    const selectedDisease = diseases.find(
      (disease) => `${disease[0]} - ${disease[1]}` === newValue
    );
    if (selectedDisease) {
      setValue('icd10', selectedDisease[0]);
      setValue('disease_description', selectedDisease[2]);
      setValue('searchTerm', newValue);
    }
  };

  const onSubmit = async (data) => {
    const currentDateTime = new Date().toISOString();
    const diseaseData = {
      doctor_id: 1, // Replace with actual doctor ID if available
      disease_name: data.searchTerm,
      icd10_code: data.icd10,
      treatment_plan: data.treatmentPlan,
      symptoms: data.symptoms,
      taken_time: currentDateTime,
      note: data.note,
    };
    try {
      await axiosInstance.post(`${API_MEDICAL_RECORDS}/${medicalRecordId}/diagnoses`, diseaseData);
      setInputValue('');
      reset();
      showToast('success', 'Disease added successfully!');
      setIsFetching(true); // Trigger API recall
    } catch (error) {
      showToast('error', 'Error adding disease!');
      console.error('Error adding disease:', error);
    }
  };

  return (
    <Page>
      <div className="p-2">
        <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
          <h3 className="mb-4 fw-bold">Biểu mẫu chẩn đoán</h3>

          <Row className="mb-3">
            <Col md={12}>
              <Autocomplete
                options={diseases.map((disease) => `${disease[0]} - ${disease[1]}`)}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                onChange={handleSelectDisease}
                filterOptions={(x) => x}
                clearOnBlur={false}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tìm kiếm bệnh"
                    placeholder="Nhập tên bệnh"
                    variant="outlined"
                  />
                )}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <RHFTextField
                InputLabelProps={{ shrink: true }}
                name="icd10"
                placeholder="ICD-10 Code"
                label="Mã ICD-10"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            </Col>
            <Col md={8}>
              <RHFTextField
                InputLabelProps={{ shrink: true }}
                name="disease_description"
                placeholder="description description"
                label="Mô tả bệnh"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <RHFTextField
                name="treatmentPlan"
                placeholder="Treatment Plan"
                label="Kế hoạch điều trị"
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <RHFTextField name="symptoms" placeholder="Symptoms" label="Triệu chứng" />
            </Col>
          </Row>

          <Form.Group controlId="note">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              {...methods.register('note')}
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
          </div>
        </FormProvider>
        <Toast />
      </div>
    </Page>
  );
};

export default DiagnosisForm;
