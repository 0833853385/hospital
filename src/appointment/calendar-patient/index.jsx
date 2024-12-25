import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import CalendarStyle from '../calendar/components/CalendarStyle';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import { axiosInstance } from '@/common/utils/axios';
import { API_PATIENT } from '@/common/constant/common.constant';

const CalendarPatientContainer = () => {
  const { patientId } = useParams();
  const calendarRef = useRef(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('timeGridWeek');
  const [appointmentEvents, setAppointmentEvents] = useState([]);

  useEffect(() => {
    fetchPatientAppointments();
  }, [date, view]);

  const fetchPatientAppointments = async () => {
    try {
      const start = new Date(date);
      const end = new Date(date);
      if (view === 'timeGridWeek') {
        start.setDate(start.getDate() - start.getDay());
        end.setDate(end.getDate() + (6 - end.getDay()));
      }
      const response = await axiosInstance.get(
        `${API_PATIENT}/${patientId}/appointments?startTime=${start.toISOString()}&endTime=${end.toISOString()}`
      );
      const events = response.data.metadata.map((item) => ({
        id: item.id,
        title: item.reason_for_visit,
        start: item.actual_start_time,
        end: item.actual_end_time,
        display: 'background',
        allDay: false,
        backgroundColor: 'rgb(25, 118, 210)',
        borderColor: 'rgb(25, 118, 210)',
        textColor: '#FFFFFF',
      }));
      console.log(events);
      setAppointmentEvents(events);
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
    }
  };

  return (
    <div className="mb-5">
      <Container>
        <h3 className="fw-bold">Lịch hẹn của bạn</h3>
        <CalendarStyle>
          <FullCalendar
            weekends
            editable
            droppable
            selectable
            events={appointmentEvents}
            ref={calendarRef}
            rerenderDelay={10}
            initialDate={date}
            initialView={view}
            dayMaxEventRows={3}
            eventDisplay="block"
            headerToolbar={false}
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
      </Container>
    </div>
  );
};

export default CalendarPatientContainer;
