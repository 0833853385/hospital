import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

const RHFDatePicker = ({ name, label, placeholder, ...other }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Form.Group className="mb-0">
          {label && <Form.Label>{label}</Form.Label>}
          <DatePicker
            selected={value}
            onChange={onChange}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            placeholderText={placeholder}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            {...other}
          />
          {error && (
            <Form.Control.Feedback type="invalid">
              {error.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      )}
    />
  );
};

RHFDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

export default RHFDatePicker;