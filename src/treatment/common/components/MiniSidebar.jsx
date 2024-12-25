import { Button } from 'react-bootstrap';
import Page from '../../../common/components/Page';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../common/routes/path';
import { replacePathParams } from '../../../common/utils/common.utils';
import { useCallback, useMemo } from 'react';
import { useSelector } from '@/common/redux/store';

const MiniSidebar = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.user.role);

  const buttons = useMemo(
    () => [
      { label: 'Tổng quan', path: PATH_DASHBOARD.treatment.overview, includes: 'overview' },
      {
        label: 'Lịch sử khám bệnh',
        path: PATH_DASHBOARD.treatment.medicalRecord,
        includes: 'medical-record',
      },
      {
        label: 'Chỉ số sức khỏe',
        path: PATH_DASHBOARD.treatment.vitalSign,
        includes: 'vital-sign',
      },
      {
        label: 'Chẩn đoán bệnh',
        path: PATH_DASHBOARD.treatment.diagnosis,
        includes: 'diagnosis',
      },
      {
        label: 'Đơn thuốc',
        path: PATH_DASHBOARD.treatment.prescription,
        includes: 'prescription',
      },
      ...(role !== 'nurse'
        ? [
            {
              label: 'Kê đơn thuốc',
              path: PATH_DASHBOARD.treatment.prescribe,
              includes: 'prescribe',
            },
          ]
        : []),
    ],
    [role]
  );

  const handleNavigation = useCallback(
    (path) => {
      navigate(
        replacePathParams(path, {
          patientId: params?.patientId,
          medicalRecordId: params?.medicalRecordId,
        })
      );
    },
    [navigate, params?.medicalRecordId, params?.patientId]
  );

  const renderButton = useCallback(
    ({ label, path, includes }) => (
      <Button
        key={label}
        onClick={() => handleNavigation(path)}
        variant={location.pathname.includes(includes) ? 'primary' : 'outline-primary'}
      >
        {label}
      </Button>
    ),
    [handleNavigation, location.pathname]
  );

  return (
    <Page>
      <div className="d-flex flex-column gap-4">{buttons.map(renderButton)}</div>
    </Page>
  );
};

export default MiniSidebar;
