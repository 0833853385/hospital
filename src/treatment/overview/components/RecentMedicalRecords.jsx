import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import axios from 'axios';

const RecentMedicalRecords = ({ patientId }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/treatment/records/patient/${patientId}`
        );
        if (response.data.status === 200) {
          setRecords(response.data.metadata.data);
        }
      } catch (error) {
        console.error('Error fetching medical records:', error);
      }
    };

    fetchRecords();
  }, [patientId]);

  return (
    <List>
      {records.map((record) => (
        <ListItem key={record.id}>
          <ListItemText
            primary={`Chẩn đoán: ${record.diagnosis || 'Không có chẩn đoán'}`}
            secondary={
              <Typography component="span" variant="body2" color="text.primary">
                {`Ngày: ${new Date(record.created_at).toLocaleDateString()}`}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default RecentMedicalRecords;
