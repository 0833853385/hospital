import { createSlice } from '@reduxjs/toolkit';
import { STATUSES_TREATMENT } from './constant';

const initialState = {
  currentMedicalRecordId: null,
  patientId: null,
  countFetchVitalSign: 0,
  currentMedicalRecordStatus: STATUSES_TREATMENT[0].status,
};

const treatmentSlice = createSlice({
  name: 'treatment',
  initialState,
  reducers: {
    setCurrentMedicalRecordId(state, action) {
      state.currentMedicalRecordId = action.payload;
    },
    setPatientId(state, action) {
      state.patientId = action.payload;
    },
    setCountFetchVitalSign(state) {
      state.countFetchVitalSign = state.countFetchVitalSign + 1;
    },
    setCurrentMedicalRecordStatus(state, action) {
      state.currentMedicalRecordStatus = action.payload;
    },
    clearTreatmentData(state) {
      state.currentMedicalRecordId = null;
      state.patientId = null;
      state.currentMedicalRecordId = STATUSES_TREATMENT[0].status;
    },
  },
});

export const {
  setCurrentMedicalRecordId,
  setPatientId,
  clearTreatmentData,
  setCountFetchVitalSign,
  setCurrentMedicalRecordStatus,
} = treatmentSlice.actions;

export default treatmentSlice.reducer;
