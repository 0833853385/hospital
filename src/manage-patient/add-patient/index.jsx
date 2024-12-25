import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Row, Col, Button } from 'react-bootstrap';
import FormProvider from '../../common/components/hook-form/FormProvider';
import RHFTextField from '../../common/components/hook-form/RHFTextField';
import RHFDatePicker from '../../common/components/hook-form/RHFDatePicker';
import Page from '../../common/components/Page';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '@mui/material';
import RHFSelect from '@/common/components/hook-form/RHFSelect';
import { axiosInstance } from '@/common/utils/axios';
import { API_PATIENT } from '@/common/constant/common.constant';
import { PATH_DASHBOARD } from '@/common/routes/path';

const PatientForm = () => {
  const navigate = useNavigate();

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
  } = methods;

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(API_PATIENT, {
        full_name: data.fullName,
        dob: data.dateOfBirth,
        phone: data.phone,
        email: data.email,
        gender: data.gender,
      });
      toast.success('Thêm bệnh nhân thành công');
      navigate(PATH_DASHBOARD.manage_patient.list);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu thông tin');
    }
  };

  return (
    <Page title="Thêm Bệnh Nhân Mới">
      <div className="p-4">
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <h3 className="mb-0 fw-bold mb-4">Thêm Bệnh Nhân Mới</h3>
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

export default PatientForm;
