import { MEDICAL_RECORD_STATUS } from '@/common/constant/treatment.constant';

export const API_URL = import.meta.env.VITE_API_URL;

export const STATUSES_TREATMENT = [
  { status: MEDICAL_RECORD_STATUS.CREATED, label: 'Đăng ký khám' },
  { status: MEDICAL_RECORD_STATUS.NURSE_RECEIVED, label: 'Y tá tiếp nhận' },
  { status: MEDICAL_RECORD_STATUS.DOCTOR_RECEIVED, label: 'Bác sĩ tiếp nhận' },
  { status: MEDICAL_RECORD_STATUS.WAITING_LAB, label: 'Chờ làm xét nghiệm' },
  { status: MEDICAL_RECORD_STATUS.WAITING_PAYMENT, label: 'Làm thủ tục thanh toán' },
  { status: MEDICAL_RECORD_STATUS.COMPLETED, label: 'Hoàn thành khám' },
];

export const HEAD_TABLE_PROPS = [
  {
    id: 'id',
    label: 'STT',
    align: 'center',
  },
  {
    id: 'medicalRecordId',
    label: 'Mã bệnh án',
    align: 'center',
  },
  { id: 'patientId', label: 'Mã bệnh nhân', align: 'center' },
  { id: 'name', label: 'Họ và tên', align: 'center' },
  { id: 'age', label: 'Tuổi', align: 'center' },
  { id: 'checkInTime', label: 'SDT', align: 'center' },
  { id: 'status', label: 'Trạng thái', align: 'center' },
  { id: 'action', label: 'Hành động', align: 'center' },
];
