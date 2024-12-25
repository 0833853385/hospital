import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useRef, useEffect } from 'react';
import { Container, Dialog, DialogTitle } from '@mui/material';
import { updateEvent, selectEvent, selectRange, closeModal } from '../calendarSlice';
import CalendarStyle from './CalendarStyle';
import CalendarToolbar from './CalendarToolbar';
import { useDispatch } from '@/common/redux/store';
import { useSelector } from 'react-redux';
import Page from '@/common/components/Page';
import CalendarForm from './CalendarForm';
import { axiosInstance } from '@/common/utils/axios';

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;
  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }
  return null;
};

const AppointmentCalendar = () => {
  const dispatch = useDispatch();
  const calendarRef = useRef(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('timeGridWeek');
  const [availabilityEvents, setAvailabilityEvents] = useState([]);
  const selectedEvent = useSelector(selectedEventSelector);
  const { isOpenModal, selectedRange } = useSelector((state) => state.calendar);

  useEffect(() => {
    fetchDoctorAvailability();
  }, [date, view]);

  const fetchDoctorAvailability = async () => {
    try {
      const start = new Date(date);
      const end = new Date(date);
      if (view === 'timeGridWeek') {
        start.setDate(start.getDate() - start.getDay());
        end.setDate(end.getDate() + (6 - end.getDay()));
      }
      const response = await axiosInstance.get(
        `http://localhost:8080/api/doctor/1/availability/between?start_time=${start.toISOString()}&end_time=${end.toISOString()}`
      );
      const events = response.data.metadata.map((item) => ({
        id: item.id,
        title: item.is_available ? 'Làm việc' : 'Nghỉ việc',
        start: item.start_time,
        end: item.end_time,
        allDay: false,
        display: 'background',
        backgroundColor: item.is_available ? 'rgb(25, 118, 210)' : 'red',
        borderColor: item.is_available ? 'rgb(25, 118, 210)' : 'red',
        textColor: '#FFFFFF',
      }));
      console.log('events', events);
      setAvailabilityEvents(events);
    } catch (error) {
      console.error('Error fetching doctor availability:', error);
    }
  };

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    console.log('arg', arg);
    dispatch(selectRange({ start: arg.start.toISOString(), end: arg.end.toISOString() }));
  };

  const handleSelectEvent = (arg) => {
    dispatch(selectEvent(arg.event.id));
  };

  const handleResizeEvent = async ({ event }) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropEvent = async ({ event }) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <Page title="Calendar">
      <h3 className="fw-bold">Appointments</h3>
      <Container>
        <CalendarStyle>
          <CalendarToolbar
            date={date}
            view={view}
            onNextDate={handleClickDateNext}
            onPrevDate={handleClickDatePrev}
            onToday={handleClickToday}
            onChangeView={handleChangeView}
          />
          <FullCalendar
            weekends
            editable
            droppable
            selectable
            events={availabilityEvents}
            ref={calendarRef}
            rerenderDelay={10}
            initialDate={date}
            initialView={view}
            dayMaxEventRows={3}
            eventDisplay="block"
            headerToolbar={false}
            allDayMaintainDuration
            eventResizableFromStart
            select={handleSelectRange}
            eventDrop={handleDropEvent}
            eventClick={handleSelectEvent}
            eventResize={handleResizeEvent}
            height={'auto'}
            slotMinTime="07:00:00"
            slotMaxTime="17:00:00"
            plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
            locale="vi"
            buttonText={{
              today: 'Hôm nay',
              month: 'Tháng',
              week: 'Tuần',
              day: 'Ngày',
              list: 'Danh sách',
            }}
          />
        </CalendarStyle>

        <Dialog open={isOpenModal} onClose={handleCloseModal}>
          <DialogTitle>{selectedEvent ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện'}</DialogTitle>

          <CalendarForm
            event={selectedEvent || {}}
            range={selectedRange}
            onCancel={handleCloseModal}
            onRefresh={fetchDoctorAvailability}
          />
        </Dialog>
      </Container>
    </Page>
  );
};

export default AppointmentCalendar;
