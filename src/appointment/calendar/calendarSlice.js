import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  isOpenModal: false,
  selectedEventId: null,
  selectedRange: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    getEvents(state, action) {
      state.events = action.payload;
    },
    openModal(state) {
      state.isOpenModal = true;
    },
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
    selectEvent(state, action) {
      state.selectedEventId = action.payload;
      state.isOpenModal = true;
    },
    selectRange(state, action) {
      state.selectedRange = action.payload;
      state.isOpenModal = true;
    },
    updateEvent(state, action) {
      const { id, data } = action.payload;
      const index = state.events.findIndex((event) => event.id === id);
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...data };
      }
    },
  },
});

export const { getEvents, openModal, closeModal, selectEvent, selectRange, updateEvent } =
  calendarSlice.actions;

export default calendarSlice.reducer;
