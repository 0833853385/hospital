import { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { HEAD_TABLE_PROPS } from '../constant';
import TableHeadCustom from '../../../common/components/mui-table/TableHeadCustom';
import PatientTableRow from './PatientTableRow';
import TableSkeleton from '../../../common/components/mui-table/TableSkeleton';
import TableNoData from '../../../common/components/mui-table/TableNoData';
import { useNavigate } from 'react-router-dom';
import { replacePathParams } from '../../../common/utils/common.utils';
import { PATH_DASHBOARD } from '../../../common/routes/path';

const PatientTable = ({ patients, isLoading, isError }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(patients?.meta?.itemPerPage || 5);
  const [dense, setDense] = useState(false);

  const patientList = patients?.data || [];

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle dense toggle
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleOnEditRow = ({ patientId, recordId }) => {
    navigate(
      replacePathParams(PATH_DASHBOARD.treatment.vitalSign, {
        patientId,
        medicalRecordId: recordId,
      })
    );
  };

  return (
    <>
      <TableContainer sx={{ position: 'relative' }}>
        <Table size={dense ? 'small' : 'medium'}>
          <TableHeadCustom headLabel={HEAD_TABLE_PROPS} rowCount={patientList?.length} />
          <TableBody>
            {patientList?.map((row, index) => (
              <PatientTableRow
                key={row?.id}
                row={row}
                index={index}
                onEditRow={handleOnEditRow}
                onDeleteRow={() => {}}
                onSelectRow={() => {}}
              />
            ))}
            {isLoading && <TableSkeleton isLoading={isLoading} row={rowsPerPage} />}
            {patientList?.length === 0 && <TableNoData isNotFound={isError} />}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ position: 'relative', mt: '20px' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={patients?.meta?.totalItems || 5}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Thu gọn"
          sx={{
            px: 3,
            py: 1.5,
            top: 0,
            position: { md: 'absolute' },
          }}
        />
      </Box>
    </>
  );
};

export default PatientTable;
