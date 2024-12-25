import AppointmentCalendar from './components/AppointmentCalendar';

const AppointmentContainer = () => {
  return (
    <div className="w-75 d-flex flex-column gap-4 mx-auto" style={{ marginBottom: '100px' }}>
      <AppointmentCalendar />
    </div>
  );
};

export default AppointmentContainer;
