import React, { useState, useEffect } from 'react';
import { Calendar, Badge } from 'antd';
import moment from 'moment';

const MedicationScheduleCalendar = ({ schedules }) => {
  const [calendarData, setCalendarData] = useState({});

  useEffect(() => {
    const processSchedules = () => {
      const data = {};
      schedules.forEach(schedule => {
        const startDate = moment(schedule.start_date);
        const endDate = moment(schedule.end_date);
        
        for (let date = startDate; date.isSameOrBefore(endDate); date.add(1, 'days')) {
          const dateStr = date.format('YYYY-MM-DD');
          if (!data[dateStr]) {
            data[dateStr] = [];
          }
          data[dateStr].push(schedule);
        }
      });
      setCalendarData(data);
    };

    processSchedules();
  }, [schedules]);

  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const daySchedules = calendarData[dateStr] || [];

    return (
      <ul className="events">
        {daySchedules.map((schedule, index) => (
          <li key={index}>
            <Badge 
              status={schedule.status === 'taken' ? 'success' : 'processing'} 
              text={`${schedule.medication_name} - ${schedule.dosage}`} 
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="medication-calendar">
      <Calendar 
        dateCellRender={dateCellRender}
        mode="month"
      />
    </div>
  );
};

export default MedicationScheduleCalendar;