import { useParams } from 'react-router-dom';
import { Grid, Paper, Typography, Box } from '@mui/material';
import MiniSidebar from '../common/components/MiniSidebar';
import PatientInfo from '../common/components/PatientInfo';
import VitalSignsChart from './components/VitalSignsChart';
import RecentMedicalRecords from './components/RecentMedicalRecords';
import LatestPrescriptions from './components/LatestPrescriptions';

const Overview = () => {
  const { patientId } = useParams();

  return (
    <Box className="w-100 h-100 d-flex flex-row gap-3">
      <Box style={{ width: '20%' }}>
        <MiniSidebar />
      </Box>
      <Box className="w-100 d-flex flex-column gap-4" style={{ marginBottom: '100px' }}>
        <PatientInfo id={patientId} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Chỉ số sức khỏe
              </Typography>
              <VitalSignsChart patientId={patientId} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Bệnh án gần đây
              </Typography>
              <RecentMedicalRecords patientId={patientId} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Đơn thuốc mới nhất
              </Typography>
              <LatestPrescriptions patientId={patientId} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Overview;
