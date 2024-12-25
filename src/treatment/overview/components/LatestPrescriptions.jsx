import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Box,
  FormControlLabel,
  Switch,
  Stack,
  Modal,
  Typography,
  Card,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../common/utils/axios';
import TableHeadCustom from '../../../common/components/mui-table/TableHeadCustom';
import TableSkeleton from '../../../common/components/mui-table/TableSkeleton';
import TableNoData from '../../../common/components/mui-table/TableNoData';
import { HEAD_TABLE_PROPS_PRESCRIPTION } from '../common/constant';
import { API_PRESCRIPTION_LIST } from '@/common/constant/common.constant';
import { useSelector } from '@/common/redux/store';
import { format, addDays, isValid } from 'date-fns';

const LatestPrescriptions = () => {
  const patientId = useSelector((state) => state.treatment.patientId);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await axiosInstance.get(`${API_PRESCRIPTION_LIST}/${patientId}`);
      setPrescriptions(response.data?.metadata || []);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleRowClick = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const handleCloseModal = () => {
    setSelectedPrescription(null);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    if (!isValid(date)) {
      return 'Invalid date';
    }
    return format(date, 'yyyy-MM-dd');
  };

  const calculateEndDate = (createdAt, duration) => {
    const startDate = new Date(createdAt);
    if (!isValid(startDate)) {
      return 'Invalid date';
    }
    return format(addDays(startDate, duration), 'yyyy-MM-dd');
  };

  return (
    <Box display={'flex'} flexDirection={'column'} gap={5}>
      <TableContainer component={Paper}>
        <Table size={dense ? 'small' : 'medium'}>
          <TableHeadCustom
            headLabel={HEAD_TABLE_PROPS_PRESCRIPTION}
            rowCount={prescriptions.length}
          />
          <TableBody>
            {prescriptions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((prescription, index) => (
                <TableRow
                  sx={{ cursor: 'pointer' }}
                  hover
                  key={prescription?.id}
                  onClick={() => handleRowClick(prescription)}
                >
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center">{prescription?.id}</TableCell>
                  <TableCell align="center">
                    {prescription?.MedicalRecord?.Patient?.full_name}
                  </TableCell>
                  <TableCell align="center">{prescription?.MedicalRecord?.diagnosis}</TableCell>
                  <TableCell align="center">{prescription?.MedicalRecord?.symptoms}</TableCell>
                  <TableCell align="center">
                    {formatDateTime(prescription?.prescribed_at)}
                  </TableCell>
                  <TableCell align="center">
                    {prescription?.Doctor?.first_name} {prescription?.Doctor?.last_name}
                  </TableCell>
                </TableRow>
              ))}
            {isLoading && <TableSkeleton isLoading={isLoading} row={rowsPerPage} />}
            {prescriptions.length === 0 && <TableNoData isNotFound={isError} />}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        direction={'row'}
        sx={{ position: 'relative' }}
        justifyContent={'space-between'}
        px={5}
        alignItems={'center'}
        width={'100%'}
      >
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Thu gọn"
        />
        <TablePagination
          sx={{ display: 'flex', justifyContent: 'flex-end' }}
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={prescriptions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Stack>
      <Modal
        open={!!selectedPrescription}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: 400,
            bgcolor: 'background.paper',
            boxShadow: 5,
            p: 1,
            borderRadius: '16px',
            overflowY: 'auto',
            '::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Chi tiết đơn thuốc
          </Typography>
          <Card sx={{ p: 1, mt: 2, mb: 2 }}>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Bệnh nhân: {selectedPrescription?.MedicalRecord?.Patient?.full_name}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Chẩn đoán: {selectedPrescription?.MedicalRecord?.diagnosis}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Triệu chứng: {selectedPrescription?.MedicalRecord?.symptoms}
            </Typography>
          </Card>
          <Box
            sx={{
              minHeight: '200px',
              maxHeight: '400px',
            }}
          >
            {selectedPrescription?.Medicine.map((medicine) => (
              <Card key={medicine.id} sx={{ p: 1, mb: 2, boxShadow: 2 }}>
                <Box sx={{ mt: 2 }}>
                  <Typography>Thuốc: {medicine?.name}</Typography>
                  <Typography>Liều lượng: {medicine?.PrescriptionMedicine?.dosage}</Typography>
                  <Typography>Tần suất: {medicine?.PrescriptionMedicine?.frequency}</Typography>
                  <Typography>
                    Thời gian sử dụng: {medicine?.PrescriptionMedicine?.duration} days
                  </Typography>
                  <Typography>
                    Ngày bắt đầu: {formatDateTime(medicine?.PrescriptionMedicine?.created_at)}
                  </Typography>
                  <Typography>
                    Ngày kết thúc:{' '}
                    {calculateEndDate(
                      medicine?.PrescriptionMedicine?.created_at,
                      medicine?.PrescriptionMedicine?.duration
                    )}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default LatestPrescriptions;
