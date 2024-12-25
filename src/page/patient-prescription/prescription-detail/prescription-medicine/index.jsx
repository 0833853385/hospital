import { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import PrescriptionMedicineService from '../../../../service/prescriptionMedicine';

const PrescriptionMedicine = ({ presciptionId }) => {
  const [presciptionMedicine, setPresciptionMedicine] = useState([]);

  const getPrescriptionMedicine = async (presciptionId) => {
    try {
      const response = await PrescriptionMedicineService.getPrescriptionMedicine(presciptionId);
      if (response) {
        setPresciptionMedicine(response.data);
      }
    } catch (error) {
      console.error('Error fetching prescription', error);
    }
  };

  useEffect(() => {
    getPrescriptionMedicine(presciptionId);
  }, [presciptionId]);

  return (
    <Table responsive className="table-hover">
      <thead className="bg-light">
        <tr>
          <th>STT</th>
          <th>Tên thuốc</th>
          <th>Liều lượng</th>
          <th>Số lượng</th>
          <th>Tần suất</th>
          <th>Thời gian</th>
          <th>Hướng dẫn</th>
          <th>Chống chỉ định</th>
          <th>Mô tả</th>
          <th>Điều kiện bảo quản</th>
          <th>Lưu ý</th>
        </tr>
      </thead>
      <tbody>
        {presciptionMedicine?.map((med, index) => (
          <tr key={med.id}>
            <td>{index + 1}</td>
            <td>{med.Medicine?.name}</td>
            <td>{med.dosage + ' ' + med.Medicine?.dosage}</td>
            <td>{med.quantity}</td>
            <td>{med.frequency}</td>
            <td>{med.duration} day</td>
            <td>{med.instructions}</td>
            <td>{med.Medicine?.contraindications}</td>
            <td>{med.Medicine?.description}</td>
            <td>{med.Medicine?.storage_condition}</td>
            <td>{med.Medicine?.warnings}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PrescriptionMedicine;
