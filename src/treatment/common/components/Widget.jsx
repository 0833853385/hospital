import { useDispatch } from '@/common/redux/store';
import { Card } from 'react-bootstrap';
import { setCurrentMedicalRecordStatus } from '../treatment.slice';

const Widget = ({
  title,
  value,
  icon,
  backgroundColor,
  textColor,
  iconColor,
  status,
  isActive,
  activeColor,
}) => {
  const dispatch = useDispatch();
  const handleSelectStatus = () => {
    dispatch(setCurrentMedicalRecordStatus(status));
  };
  return (
    <Card
      onClick={handleSelectStatus}
      style={{ backgroundColor: isActive ? activeColor : backgroundColor, cursor: 'pointer' }}
      className="p-3 text-center h-100"
    >
      <div className="d-flex justify-content-between align-items-center">
        <div className="text-right">
          <h5 style={{ color: textColor }}>{title}</h5>
          <h3 style={{ color: textColor }}>{value}</h3>
        </div>
        <div style={{ color: iconColor, fontSize: '2rem' }}>{icon}</div>
      </div>
    </Card>
  );
};

export default Widget;
