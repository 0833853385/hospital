import { TableRow, TableCell, Box, MenuItem } from '@mui/material';
import { useState } from 'react';
import TableMoreMenu from '../../../common/components/mui-table/TableMoreMenu';
import Iconify from '../../../common/components/Iconify';
import { calculateAge, replacePathParams } from '../../../common/utils/common.utils';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '@/common/routes/path';

const ListPatientTableRow = ({ patient, onDeleteRow, onEditRow }) => {
  const [openMenu, setOpenMenuActions] = useState(null);
  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <>
      <TableRow>
        <TableCell align="center">{patient?.id}</TableCell>
        <TableCell align="center">{patient?.full_name}</TableCell>
        <TableCell align="center">{patient?.dob ? calculateAge(patient?.dob) : ''}</TableCell>
        <TableCell align="center">{patient?.phone}</TableCell>
        <TableCell align="center">{patient?.email}</TableCell>
        <TableCell align="center">{new Date(patient?.created_at).toLocaleString()}</TableCell>
        <TableCell align="center">{new Date(patient?.updated_at).toLocaleString()}</TableCell>
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
                    navigate(
                      replacePathParams(PATH_DASHBOARD.manage_patient.edit, {
                        id: patient?.id || 0,
                      })
                    );
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  Chỉnh sửa
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate(
                      replacePathParams(PATH_DASHBOARD.manage_patient.newMedicalRecord, {
                        patientId: patient?.id || 0,
                      })
                    );
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:plus-circle-outline'} />
                  Tạo hồ sơ y tế
                </MenuItem>
              </Box>
            }
          ></TableMoreMenu>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ListPatientTableRow;
