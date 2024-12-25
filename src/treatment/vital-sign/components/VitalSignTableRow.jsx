import { TableCell, TableRow, Box, MenuItem } from '@mui/material';
import { useState } from 'react';
import TableMoreMenu from '../../../common/components/mui-table/TableMoreMenu';
import Iconify from '../../../common/components/Iconify';
import { axiosInstance } from '@/common/utils/axios';
import { API_TREATMENT, API_TREATMENT_RECORD } from '@/common/constant/common.constant';
import useToast from '@/common/hooks/useToast';
import { useParams } from 'react-router-dom';

const VitalSignTableRow = ({ row, index, onDeleteRow, onEditRow }) => {
  const [openMenu, setOpenMenuActions] = useState(null);
  const params = useParams();
  const { showToast, Toast } = useToast();
  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleDeleteRow = async () => {
    try {
      await axiosInstance.delete(`${API_TREATMENT}/vital-signs/${row.id}`);
      onDeleteRow();
      showToast('Xóa thành công', 'success');
    } catch (error) {
      console.error('Failed to delete vital sign:', error);
      showToast('Xóa thất bại', 'error');
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell align="center">{index + 1}</TableCell>
        <TableCell align="center">{row.date}</TableCell>
        <TableCell align="center">{row.temperature}</TableCell>
        <TableCell align="center">{row.heartRate}</TableCell>
        <TableCell align="center">{row.bloodPressure}</TableCell>
        <TableCell align="center">{row.respiratoryRate}</TableCell>
        <TableCell align="center">{row.weight}</TableCell>
        <TableCell align="center">{row.height}</TableCell>
        <TableCell align="center">{row.bmi}</TableCell>
        <TableCell align="center">{row.note}</TableCell>
        <TableCell align="center">
          <TableMoreMenu
            open={openMenu}
            onClose={handleCloseMenu}
            onOpen={handleOpenMenu}
            actions={
              <Box width={'500px'} height={''}>
                <MenuItem
                  onClick={() => {
                    handleDeleteRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:trash-2-outline'} />
                  Xóa
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onEditRow();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  Chỉnh sửa
                </MenuItem>
              </Box>
            }
          ></TableMoreMenu>
        </TableCell>
      </TableRow>
      <Toast />
    </>
  );
};

export default VitalSignTableRow;
