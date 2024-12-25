import { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const useToast = () => {
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const showToast = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const Toast = () => (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
        {alertMessage}
      </Alert>
    </Snackbar>
  );

  return { showToast, Toast };
};

export default useToast;
