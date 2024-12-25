import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';
import TableHeadCustom from '../../../common/components/mui-table/TableHeadCustom';
import TableSkeleton from '../../../common/components/mui-table/TableSkeleton';
import TableNoData from '../../../common/components/mui-table/TableNoData';
import VitalSignTableRow from './VitalSignTableRow'; // Import the table row component
import { axiosInstance } from '@/common/utils/axios';
import { API_TREATMENT_RECORD } from '@/common/constant/common.constant';
import { formatDateTime } from '@/common/utils/common.utils'; // Import the formatDate function
import Page from '@/common/components/Page';
import { useParams } from 'react-router-dom';
import { useSelector } from '@/common/redux/store';

const HEAD_TABLE_PROPS = [
  { id: 'index', label: 'STT', align: 'center' },
  { id: 'date', label: 'Ngày', align: 'center' },
  { id: 'temperature', label: 'Nhiệt độ', align: 'center' },
  { id: 'heartRate', label: 'Nhịp tim', align: 'center' },
  { id: 'bloodPressure', label: 'Huyết áp', align: 'center' },
  { id: 'respiratoryRate', label: 'Nhịp thở', align: 'center' },
  { id: 'weight', label: 'Cân nặng', align: 'center' },
  { id: 'height', label: 'Chiều cao', align: 'center' },
  { id: 'bmi', label: 'BMI', align: 'center' },
  { id: 'note', label: 'Ghi chú', align: 'center' },
  { id: 'action' },
];

const VitalSignList = () => {
  const params = useParams();
  const countFetchVitalSign = useSelector((state) => state.treatment.countFetchVitalSign);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);

  useEffect(() => {
    const fetchVitalSigns = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_TREATMENT_RECORD}/${params?.medicalRecordId}/vital-signs`
        );
        const mappedVitalSigns = response.data.metadata.map((item) => ({
          id: item.id,
          date: formatDateTime(item.create_at), // Apply formatDate function
          temperature: item.temperature,
          heartRate: item.heart_rate,
          bloodPressure: item.blood_pressure,
          respiratoryRate: item.respiratory_rate,
          weight: item.weight,
          height: item.height,
          bmi: item.bmi,
          note: item.note,
        }));
        setVitalSigns(mappedVitalSigns);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchVitalSigns();
  }, [countFetchVitalSign, params?.medicalRecordId]);

  const vitalSignList = vitalSigns || [];

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

  const handleDeleteRow = (id) => {
    setVitalSigns((prevVitalSigns) => prevVitalSigns.filter((vitalSign) => vitalSign.id !== id));
  };

  return (
    <Page>
      <h3 className="mb-4 fw-bold">Lịch sử vital sign</h3>

      <TableContainer sx={{ position: 'relative' }}>
        <Table size={dense ? 'small' : 'medium'}>
          <TableHeadCustom headLabel={HEAD_TABLE_PROPS} rowCount={vitalSignList.length} />
          <TableBody>
            {vitalSignList.map((row, index) => (
              <VitalSignTableRow
                key={row.id}
                row={row}
                index={index}
                onDeleteRow={() => handleDeleteRow(row.id)}
              />
            ))}
            {isLoading && <TableSkeleton isLoading={isLoading} row={rowsPerPage} />}
            {vitalSignList.length === 0 && <TableNoData isNotFound={isError} />}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ position: 'relative', mt: '20px' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={vitalSigns?.length || 0}
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
    </Page>
  );
};

export default VitalSignList;
