import Iconify from '@/common/components/Iconify';
import { Box, Button, Typography } from '@mui/material';

const CalendarToolbar = ({ date, view, onNextDate, onPrevDate, onToday, onChangeView }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
      <Button onClick={onToday} startIcon={<Iconify icon="eva:calendar-outline" />}>
        Hôm nay
      </Button>
      <Box>
        <Button onClick={onPrevDate} startIcon={<Iconify icon="eva:arrow-back-outline" />} />
        <Typography variant="h6" component="span" sx={{ mx: 2 }}>
          {date.toLocaleDateString('vi-VN')}
        </Typography>
        <Button onClick={onNextDate} endIcon={<Iconify icon="eva:arrow-forward-outline" />} />
      </Box>
      <Button
        onClick={() => onChangeView(view === 'dayGridMonth' ? 'timeGridWeek' : 'dayGridMonth')}
      >
        {view === 'dayGridMonth' ? 'Xem theo tuần' : 'Xem theo tháng'}
      </Button>
    </Box>
  );
};

export default CalendarToolbar;
