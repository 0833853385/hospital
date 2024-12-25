import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Row, Col, Button } from 'react-bootstrap';
import FormProvider from '../../common/components/hook-form/FormProvider';
import RHFTextField from '../../common/components/hook-form/RHFTextField';
import RHFDatePicker from '../../common/components/hook-form/RHFDatePicker';
import Page from '../../common/components/Page';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { MenuItem } from '@mui/material';
import RHFSelect from '@/common/components/hook-form/RHFSelect';
import { axiosInstance } from '@/common/utils/axios';
import { API_PATIENT } from '@/common/constant/common.constant';
import { PATH_DASHBOARD } from '@/common/routes/path';
import { useEffect, useState } from 'react';

const EditPatientContainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Vui lòng nhập họ tên'),
    dateOfBirth: Yup.date().required('Vui lòng chọn ngày sinh'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số')
      .min(10, 'Số điện thoại phải có ít nhất 10 số')
      .required('Vui lòng nhập số điện thoại'),
    email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
    gender: Yup.string().required('Vui lòng chọn giới tính'),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      fullName: '',
      dateOfBirth: null,
      phone: '',
      email: '',
      gender: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axiosInstance.get(`${API_PATIENT}/${id}`);
        const { full_name, dob, phone, email, gender } = response.data.metadata;
        console.log(response.data);
        reset({
          fullName: full_name,
          dateOfBirth: dob,
          phone: phone,
          email: email,
          gender: gender,
        });
        setLoading(false);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tải thông tin bệnh nhân');
        navigate(PATH_DASHBOARD.manage_patient.list);
      }
    };

    fetchPatientData();
  }, [id, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      await axiosInstance.patch(`${API_PATIENT}/${id}`, {
        full_name: data.fullName,
        dob: data.dateOfBirth,
        phone: data.phone,
        email: data.email,
        gender: data.gender,
      });
      toast.success('Cập nhật thông tin bệnh nhân thành công');
      navigate(PATH_DASHBOARD.manage_patient.list);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Page title="Chỉnh Sửa Thông Tin Bệnh Nhân">
      <div className="p-4">
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <h3 className="mb-0 fw-bold mb-4">Chỉnh Sửa Thông Tin Bệnh Nhân</h3>
          <Row className="mb-4">
            <Col md={6}>
              <RHFTextField name="fullName" label="Họ và tên *" placeholder="Nhập họ và tên" />
            </Col>
            <Col md={6}>
              <RHFDatePicker name="dateOfBirth" label="Ngày sinh *" placeholder="DD/MM/YYYY" />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <RHFTextField name="phone" label="Số điện thoại *" placeholder="Nhập số điện thoại" />
            </Col>
            <Col md={6}>
              <RHFTextField name="email" label="Email *" placeholder="Nhập địa chỉ email" />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <RHFSelect name="gender" label="Giới tính *" SelectProps={{ native: false }}>
                <MenuItem value="">Chọn giới tính</MenuItem>
                <MenuItem value="male">Nam</MenuItem>
                <MenuItem value="female">Nữ</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </RHFSelect>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="primary" type="submit" disabled={isSubmitting} className="px-4">
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Đang lưu...
                </>
              ) : (
                'Lưu thông tin'
              )}
            </Button>
            <Button
              variant="outline-secondary"
              type="button"
              className="px-4"
              onClick={() => {
                navigate(-1);
              }}
            >
              Hủy
            </Button>
          </div>
        </FormProvider>
      </div>
    </Page>
  );
};

export default EditPatientContainer;
