import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider from '../../../common/components/hook-form/FormProvider';
import Page from '../../../common/components/Page';
import { Button, Col, Row, Card, Table, ButtonGroup } from 'react-bootstrap';
import RHFSelect from '../../../common/components/hook-form/RHFSelect';
import { MenuItem } from '@mui/material';
import RHFTextField from '../../../common/components/hook-form/RHFTextField';
import InteractionModal from './InteractionModal';
import { medicineService } from '@/service/medicine';
import Loading from '@/common/components/loading';
import useLoading from '@/hook/useLoading';
import { unitOptions, frequencyOptions, timingOptions, routeOptions, dosageOptions } from '../mock';
import { drugInteractionService } from '@/service/drugInteraction';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import PrescriptionService from '@/service/prescription';
import { FaPlus, FaSave } from 'react-icons/fa';
import RHFDatePicker from '@/common/components/hook-form/RHFDatePicker';
import RHFMultiSelect from '@/common/components/hook-form/RHFMultiSelect';
import { PATH_DASHBOARD } from '@/common/routes/path';
import { replacePathParams } from '@/common/utils/common.utils';

const PrescriptionForm = () => {
  const navigate = useNavigate();
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [drugInteractions, setDrugInteractions] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [medicinesList, setMedicinesList] = useState([]);
  const { isLoading, withLoading } = useLoading();
  const params = useParams();

  // mock data for form prescription
  const [formData, setFormData] = useState({
    medical_record_id: '1',
    doctor_id: '1',
    notes: '',
    medicines: [],
  });

  // validation data
  const PrescriptionSchema = Yup.object().shape({
    drugId: Yup.string().required('Vui lòng chọn thuốc'),
    quantity: Yup.number()
      .required('Vui lòng nhập số lượng')
      .positive('Số lượng phải lớn hơn 0')
      .typeError('Số lượng phải là số'),
    unit: Yup.string().required('Vui lòng chọn đơn vị'),
    dosage: Yup.string().required('Vui lòng chọn liều lượng'),
    frequency: Yup.string().required('Vui lòng chọn tần suất sử dụng'),
    duration: Yup.number()
      .required('Vui lòng nhập thời gian điều trị')
      .positive('Thời gian điều trị phải lớn hơn 0')
      .typeError('Thời gian điều trị phải là số'),
    route: Yup.string().required('Vui lòng chọn đường dùng'),
    timing: Yup.array().min(1, 'Vui lòng chọn it nhất 1 thời điểm dùng'),
    startDate: Yup.date()
      .nullable() // Allow null value
      .transform((curr, orig) => (orig === '' ? null : curr)) // Transform empty string to null
      .min(new Date(), 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại'),
    instructions: Yup.string(),
    notes: Yup.string(),
  });

  //initialize data for form
  const methods = useForm({
    defaultValues: {
      drugId: '',
      quantity: '',
      unit: '',
      dosage: '',
      frequency: '',
      duration: '',
      route: '',
      timing: [],
      startDate: '',
      instructions: '',
      notes: '',
    },
    resolver: yupResolver(PrescriptionSchema),
  });

  //fecth all medicine
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        await withLoading(async () => {
          const response = await medicineService.getAll();
          setMedicinesList(response?.metadata?.data || []);
        });
      } catch (error) {
        console.error('Error fetching patient list:', error);
      }
    };
    fetchMedicines();
  }, []);

  // check interaction of medicine
  const checkDrugInteractions = async (drugId) => {
    try {
      const response = await drugInteractionService.checkDrugInteraction({
        selectedDrugs,
        newDrug: drugId,
      });

      setDrugInteractions(response?.metadata?.data?.interactions);
      if (response.metadata?.hasInteractions) {
        setShowInteractionModal(true);
      }
    } catch (error) {
      console.error('Error checking drug interactions:', error);
    }
  };

  // handle select a new medicine
  const handleDrugSelect = async () => {
    try {
      const isValid = await methods.trigger();
      const values = methods.getValues();
      const errors = methods.formState.errors;

      if (!isValid) {
        Object.values(errors)[0];
        return;
      }

      const selectedDrug = medicinesList.find((drug) => drug.id === values.drugId);
      if (!selectedDrug) {
        alert('Vui lòng chọn một loại thuốc');
        return;
      }

      // Kiểm tra thuốc đã tồn tại
      const isDrugExist = selectedDrugs.some((drug) => drug.id === values.drugId);
      if (isDrugExist) {
        alert('Thuốc đã được thêm vào đơn. Vui lòng chọn thuốc khác hoặc chỉnh sửa thuốc đã có.');
        return;
      }

      // Tạo object thuốc mới
      const newDrug = {
        id: values.drugId,
        name: selectedDrug.name,
        quantity: values.quantity,
        unit: values.unit,
        dosage: values.dosage,
        frequency: values.frequency,
        duration: values.duration,
        route: values.route,
        timing: values.timing,
        instructions: values.instructions || '',
        notes: values.notes || '',
      };

      // Thêm thuốc vào danh sách
      setSelectedDrugs((prev) => [...prev, newDrug]);
      // Reset form sau khi thêm thành công
      methods.reset({
        drugId: '',
        quantity: '',
        unit: '',
        dosage: '',
        frequency: '',
        duration: '',
        route: '',
        timing: [],
        instructions: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding drug:', error);
      alert('Có lỗi xảy ra khi thêm thuốc');
    }
  };

  const onSubmit = async () => {
    try {
      if (selectedDrugs.length === 0) {
        alert('Vui lòng thêm ít nhất một loại thuốc');
        return;
      }

      const prescriptionData = {
        ...formData,
        medicines: selectedDrugs,
      };

      const response = await PrescriptionService.addPescription(prescriptionData);
      setSelectedDrugs([]);
      alert('Thêm đơn thuốc thành công');

      if (response?.data?.metadata?.id) {
        navigate(
          replacePathParams(PATH_DASHBOARD.treatment.detailPrescription, {
            patientId: params.patientId,
            prescriptionId: response?.data?.metadata?.id,
            medicalRecordId: params.medicalRecordId,
          })
        );
      } else {
        navigate('/prescriptions'); // Fallback nếu không có ID cụ thể
      }
    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('Có lỗi xảy ra khi lưu đơn thuốc');
    }
  };

  const handleEditDrug = (index) => {
    const drugToEdit = selectedDrugs[index];
    methods.reset(drugToEdit);
    const newSelectedDrugs = [...selectedDrugs];
    newSelectedDrugs.splice(index, 1);
    setSelectedDrugs(newSelectedDrugs);
  };

  const handleDeleteDrug = (index) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
      const newSelectedDrugs = [...selectedDrugs];
      newSelectedDrugs.splice(index, 1);
      setSelectedDrugs(newSelectedDrugs);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy kê đơn?')) {
      methods.reset();
      setSelectedDrugs([]);
      navigate(-1);
    }
  };

  return (
    <Page>
      {isLoading && <Loading variant="medical" text="Đang tải dữ liệu..." />}
      <div className="p-4">
        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Kê đơn thuốc</h4>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col md={12}>
                  <RHFSelect
                    name="drugId"
                    label="Tên thuốc *"
                    SelectProps={{
                      native: false,
                      onChange: (e) => {
                        const value = e.target.value;
                        methods.setValue('drugId', value);
                        checkDrugInteractions(value);
                      },
                    }}
                  >
                    <MenuItem value="">Chọn thuốc</MenuItem>
                    {medicinesList.map((drug) => (
                      <MenuItem key={drug.id} value={drug.id}>
                        {drug.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={4}>
                  <RHFTextField
                    name="quantity"
                    label="Số lượng *"
                    type="number"
                    placeholder="Nhập số lượng"
                    error={Boolean(methods.formState.errors.quantity)}
                    helperText={methods.formState.errors.quantity?.message}
                  />
                </Col>
                <Col md={4}>
                  <RHFSelect
                    name="unit"
                    label="Đơn vị *"
                    SelectProps={{ native: false }}
                    error={Boolean(methods.formState.errors.unit)}
                    helperText={methods.formState.errors.unit?.message}
                  >
                    {unitOptions.map((option) => (
                      <MenuItem key={option.value} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Col>
                <Col md={4}>
                  <RHFSelect name="dosage" label="Liều lượng *" SelectProps={{ native: false }}>
                    {dosageOptions.map((option) => (
                      <MenuItem key={option.value} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <RHFSelect
                    name="frequency"
                    label="Tần suất sử dụng *"
                    SelectProps={{ native: false }}
                  >
                    {frequencyOptions.map((option) => (
                      <MenuItem key={option.value} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Col>
                <Col md={6}>
                  <RHFMultiSelect name="timing" label="Thời điểm dùng *" options={timingOptions} />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={4}>
                  <RHFTextField
                    name="duration"
                    label="Thời gian điều trị *"
                    type="number"
                    placeholder="Nhập số ngày"
                  />
                </Col>

                <Col md={2}>
                  <RHFTextField name="startDate" type="date" placeholder="Ngày bắt đầu" />
                </Col>
                <Col md={6}>
                  <RHFSelect name="route" label="Đường dùng *" SelectProps={{ native: false }}>
                    {routeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={12}>
                  <RHFTextField
                    name="instructions"
                    label="Hướng dẫn sử dụng"
                    multiline
                    rows={2}
                    placeholder="VD: Uống sau khi ăn, không nhai..."
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={12}>
                  <RHFTextField
                    name="notes"
                    label="Ghi chú"
                    multiline
                    rows={2}
                    placeholder="Ghi chú thêm về đơn thuốc"
                  />
                </Col>
              </Row>

              {selectedDrugs.length > 0 && (
                <div className="mb-4">
                  <h5 className="mb-3">Thuốc đã kê ({selectedDrugs.length})</h5>
                  <Table responsive bordered hover>
                    <thead>
                      <tr className="text-center">
                        <th>Tên thuốc</th>
                        <th>Số lượng</th>
                        <th>Tần suất</th>
                        <th>Thời gian</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDrugs?.map((drug, index) => (
                        <tr key={index} className="text-center">
                          <td>{drug.name}</td>
                          <td>{`${drug.quantity} ${drug.unit}`}</td>
                          <td>{drug.frequency}</td>
                          <td>{`${drug.duration} ngày`}</td>
                          <td>
                            <ButtonGroup size="sm">
                              <Button
                                variant="outline-primary"
                                onClick={() => handleEditDrug(index)}
                              >
                                <i className="fas fa-edit">Sửa</i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                onClick={() => handleDeleteDrug(index)}
                              >
                                <i className="fas fa-trash">Xóa</i>
                              </Button>
                            </ButtonGroup>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleDrugSelect}
                  disabled={isLoading}
                  className="d-flex align-items-center gap-1"
                >
                  <FaPlus />
                  Thêm thuốc
                </Button>

                <Button
                  variant="outline-primary"
                  onClick={onSubmit}
                  disabled={isLoading || selectedDrugs.length === 0}
                  className="d-flex align-items-center gap-1"
                >
                  <FaSave />
                  {isLoading ? 'Đang lưu...' : 'Lưu đơn thuốc'}
                </Button>

                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
              </div>
            </Card.Body>
          </Card>
        </FormProvider>

        {/* {selectedDrugs.length > 0 && <MedicationSchedule selectedDrugs={selectedDrugs} />} */}

        <InteractionModal
          showInteractionModal={showInteractionModal}
          setShowInteractionModal={setShowInteractionModal}
          drugInteractions={drugInteractions}
        />
      </div>
    </Page>
  );
};

export default PrescriptionForm;
