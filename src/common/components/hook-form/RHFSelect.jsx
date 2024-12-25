// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

// type IProps = {
//   name: string;
//   children: React.ReactNode;
// };

// type Props = IProps & TextFieldProps;

export default function RHFSelect({ name, children, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{ native: true }}
          error={!!error}
          helperText={error?.message}
          {...other}
          sx={{ zIndex: 0 }}
        >
          {children}
        </TextField>
      )}
    />
  );
}
