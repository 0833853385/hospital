import Page from '../../common/components/Page';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../common/routes/path';
import ListPatientTable from './components/ListPatientTable';
import { Stack } from '@mui/material';

const ListPatientContainer = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <div className="p-4">
        <Stack sx={{ mb: 2 }} direction="row" justifyContent="space-between">
          <h4 className="mb-0">Danh sách bệnh nhân</h4>
          <Button
            onClick={() => {
              navigate(PATH_DASHBOARD.manage_patient.add);
            }}
          >
            Thêm bệnh nhân
          </Button>
        </Stack>
        <ListPatientTable />
      </div>
    </Page>
  );
};

export default ListPatientContainer;
