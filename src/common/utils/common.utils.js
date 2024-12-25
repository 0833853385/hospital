import { format, isValid } from 'date-fns';
import { MEDICAL_RECORD_STATUS } from '../constant/treatment.constant';

export function replacePathParams(path, newData) {
  let newPath = path;
  Object.keys(newData).forEach((it) => {
    newPath = newPath.replace(`:${it}`, newData[it]);
  });
  return newPath;
}

export const getStatusColor = (status) => {
  switch (status) {
    case MEDICAL_RECORD_STATUS.CREATED:
      return 'primary';
    case MEDICAL_RECORD_STATUS.REGISTERED:
      return 'success';
    case MEDICAL_RECORD_STATUS.NURSE_RECEIVED:
      return 'warning';
    case MEDICAL_RECORD_STATUS.DOCTOR_RECEIVED:
      return 'info';
    case MEDICAL_RECORD_STATUS.WAITING_LAB:
      return 'secondary';
    case MEDICAL_RECORD_STATUS.WAITING_PAYMENT:
      return 'error';
    case MEDICAL_RECORD_STATUS.COMPLETED:
      return 'success';
    default:
      return 'default';
  }
};

export const translateStatus = (status) => {
  switch (status) {
    case MEDICAL_RECORD_STATUS.CREATED:
      return 'Đăng ký khám';
    case MEDICAL_RECORD_STATUS.REGISTERED:
      return 'Đã đăng ký';
    case MEDICAL_RECORD_STATUS.NURSE_RECEIVED:
      return 'Y tá tiếp nhận';
    case MEDICAL_RECORD_STATUS.DOCTOR_RECEIVED:
      return 'Bác sĩ tiếp nhận';
    case MEDICAL_RECORD_STATUS.WAITING_LAB:
      return 'Chờ làm xét nghiệm';
    case MEDICAL_RECORD_STATUS.WAITING_PAYMENT:
      return 'Chờ thanh toán';
    case MEDICAL_RECORD_STATUS.COMPLETED:
      return 'Hoàn thành';
    default:
      return 'Không xác định';
  }
};

export const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  if (!isValid(date)) {
    return 'Invalid date';
  }
  return format(date, 'yyyy-MM-dd');
};

export const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  if (!isValid(date)) {
    return 'Invalid date';
  }
  return format(date, 'dd-MM-yyyy HH:mm:ss');
};


export const getPrescriptionStatusStyle = (status) => {
  switch (status) {
    case 'active': return 'text-primary';
    case 'completed': return 'text-success';
    case 'cancelled': return 'text-danger';
    default: return 'text-default';
  }
};