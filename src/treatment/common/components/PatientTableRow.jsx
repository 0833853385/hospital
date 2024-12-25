import { MenuItem, TableCell, TableRow, Box, Chip } from '@mui/material';
import { useState } from 'react';
import TableMoreMenu from '../../../common/components/mui-table/TableMoreMenu';
import Iconify from '../../../common/components/Iconify';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../common/routes/path';
import {
  getStatusColor,
  replacePathParams,
  calculateAge,
  translateStatus,
} from '../../../common/utils/common.utils';
import { useDispatch } from '@/common/redux/store';
import { setCurrentMedicalRecordId, setPatientId } from '../treatment.slice';

const PatientTableRow = (props) => {
  const { row, index, onDeleteRow, onEditRow } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover>
      <TableCell align="center">{index + 1}</TableCell>
      <TableCell align="center">{row?.id}</TableCell>
      <TableCell align="center">{row.Patient?.id}</TableCell>
      <TableCell align="left">{row?.Patient?.full_name}</TableCell>
      <TableCell align="center">{calculateAge(row?.Patient?.dob)}</TableCell>
      <TableCell align="center">{row?.Patient?.phone}</TableCell>
      <TableCell align="center">
        <Chip
          label={translateStatus(row?.status)}
          sx={{ fontWeight: 800, fontSize: '16px' }}
          color={getStatusColor(row?.status)}
        ></Chip>
      </TableCell>
      <TableCell align="center">
        <TableMoreMenu
          open={openMenu}
          onClose={handleCloseMenu}
          onOpen={handleOpenMenu}
          actions={
            <Box width={'500px'} height={''}>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Xóa
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch(setPatientId(row?.Patient?.id));
                  dispatch(setCurrentMedicalRecordId(row?.id));
                  navigate(
                    replacePathParams(PATH_DASHBOARD.treatment.overview, {
                      patientId: row?.Patient?.id,
                      medicalRecordId: row?.id,
                    })
                  );
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Tiếp nhận bệnh nhân
              </MenuItem>
            </Box>
          }
        ></TableMoreMenu>
      </TableCell>
    </TableRow>
  );
};

export default PatientTableRow;
