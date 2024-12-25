import { useState, useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Box,
  MenuItem,
} from '@mui/material';

import MiniSidebar from '../common/components/MiniSidebar';
import Page from '@/common/components/Page';
import DiagnosisForm from './components/DiagnosisForm';
import TableMoreMenu from '@/common/components/mui-table/TableMoreMenu';
import Iconify from '@/common/components/Iconify';
import ModalEditDiagnosis from './components/ModalEditDiagnosis';
import { formatDateTime } from '@/common/utils/common.utils';
import { axiosInstance } from '@/common/utils/axios';
import { API_MEDICAL_RECORDS } from '@/common/constant/common.constant';
import { useParams } from 'react-router-dom';
import useToast from '@/common/hooks/useToast';

const DiagnosisContainer = () => {
  const { medicalRecordId } = useParams();
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [openMenu, setOpenMenuActions] = useState(null);
  const [editDiseaseIndex, setEditDiseaseIndex] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const { showToast, Toast } = useToast();

  const fetchDiagnoses = async () => {
    setIsFetching(true);
    try {
      const response = await axiosInstance.get(
        `${API_MEDICAL_RECORDS}/${medicalRecordId}/diagnoses`
      );
      setSelectedDiseases(response.data?.metadata?.data || []);
    } catch (error) {
      console.error('Error fetching diagnoses:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isFetching) {
      fetchDiagnoses();
    }
  }, [medicalRecordId, isFetching]);

  const handleAddDisease = async (data) => {
    const newDisease = {
      icd10: data.icd10,
      searchTerm: data.searchTerm,
      note: data.note,
      treatmentPlan: data.treatmentPlan,
      symptoms: data.symptoms,
      takeTime: new Date().toLocaleString(),
    };
    setSelectedDiseases((prev) => [...prev, newDisease]);
    await fetchDiagnoses();
  };

  const handleRemoveDisease = async (index) => {
    const disease = selectedDiseases[index];
    try {
      await axiosInstance.delete(
        `${API_MEDICAL_RECORDS}/${medicalRecordId}/diagnoses/${disease.id}`
      );
      setSelectedDiseases((prev) => prev.filter((_, i) => i !== index));
      showToast('success', 'Disease deleted successfully!');
    } catch (error) {
      showToast('error', 'Error deleting disease!');
      console.error('Error deleting disease:', error);
    }
  };

  const handleEditDisease = (index) => {
    setEditDiseaseIndex(index);
  };

  const handleUpdateDisease = async (updatedDisease) => {
    try {
      await axiosInstance.put(
        `${API_MEDICAL_RECORDS}/${medicalRecordId}/diagnoses/${updatedDisease.id}`,
        updatedDisease
      );
      setSelectedDiseases((prev) =>
        prev.map((disease, i) => (i === editDiseaseIndex ? updatedDisease : disease))
      );
      setEditDiseaseIndex(null);
      showToast('success', 'Disease updated successfully!');
    } catch (error) {
      showToast('error', 'Error updating disease!');
      console.error('Error updating disease:', error);
    }
  };

  const handleCloseEditModal = () => {
    setEditDiseaseIndex(null);
  };

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <div className="w-100 h-100 d-flex flex-row gap-3 ">
      <div className="" style={{ width: '20%' }}>
        <MiniSidebar />
      </div>
      <div className="w-100 d-flex gap-4 flex-column" style={{ marginBottom: '100px' }}>
        <DiagnosisForm onAddDisease={handleAddDisease} setIsFetching={setIsFetching} />
        <Page>
          <h3 className="fw-bold">Các bệnh đã chuẩn đoán</h3>

          <TableContainer component={Paper} className="mt-3">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã ICD-10</TableCell>
                  <TableCell>Tên bệnh</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell>Kế hoạch điều trị</TableCell>
                  <TableCell>Triệu chứng</TableCell>
                  <TableCell>Thời gian chẩn đoán</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDiseases?.map((disease, index) => (
                  <TableRow key={index}>
                    <TableCell>{disease.icd10_code}</TableCell>
                    <TableCell>{disease.disease_name}</TableCell>
                    <TableCell>{disease.note}</TableCell>
                    <TableCell>{disease.treatment_plan}</TableCell>
                    <TableCell>{disease.symptoms}</TableCell>
                    <TableCell>{formatDateTime(disease.taken_time)}</TableCell>
                    <TableCell>
                      <TableMoreMenu
                        open={openMenu}
                        onClose={handleCloseMenu}
                        onOpen={handleOpenMenu}
                        actions={
                          <Box width={'500px'} height={''}>
                            <MenuItem
                              onClick={() => {
                                handleRemoveDisease(index);
                                handleCloseMenu();
                              }}
                              sx={{ color: 'error.main' }}
                            >
                              <Iconify icon={'eva:trash-2-outline'} />
                              Xóa
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                handleEditDisease(index);
                                handleCloseMenu();
                              }}
                            >
                              <Iconify icon={'eva:edit-fill'} />
                              Chỉnh sửa
                            </MenuItem>
                          </Box>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Page>
        {editDiseaseIndex !== null && (
          <ModalEditDiagnosis
            disease={selectedDiseases[editDiseaseIndex]}
            onClose={handleCloseEditModal}
            onUpdateDisease={handleUpdateDisease}
          />
        )}
        <Toast />
      </div>
    </div>
  );
};

export default DiagnosisContainer;
