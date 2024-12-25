import { useParams } from 'react-router-dom';
import PatientInfo from '../common/components/PatientInfo';
import TablePrescription from './components/TablePrescription';
import MiniSidebar from '../common/components/MiniSidebar';

const PrescriptionContainer = () => {
  const params = useParams();
  return (
    <div className="w-100 h-100 d-flex flex-row gap-3 ">
      <div className="" style={{ width: '20%' }}>
        <MiniSidebar />
      </div>
      <div className="w-100 d-flex gap-4 flex-column" style={{ marginBottom: '100px' }}>
        <PatientInfo id={params.patientId} />
        <TablePrescription />
      </div>
    </div>
  );
};

export default PrescriptionContainer;
