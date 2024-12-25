import { useParams } from 'react-router-dom';
import VitalSignForm from './components/VitalSignForm';
import PatientInfo from '../common/components/PatientInfo';
import MiniSidebar from '../common/components/MiniSidebar';
import VitalSignList from './components/VitalSignList'; // Import the new component

const VitalSignContainer = () => {
  const params = useParams();
  console.log('vital sign id: ', params.patientId);
  return (
    <div className="w-100 h-100 d-flex flex-row gap-3 ">
      <div className="" style={{ width: '20%' }}>
        <MiniSidebar />
      </div>
      <div className="w-100 d-flex gap-4 flex-column" style={{ marginBottom: '100px' }}>
        <PatientInfo id={params.patientId} />
        <VitalSignForm />
        <VitalSignList patientId={params?.medicalRecordId} />
      </div>
    </div>
  );
};

export default VitalSignContainer;
