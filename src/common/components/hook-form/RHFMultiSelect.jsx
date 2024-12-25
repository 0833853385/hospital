import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, MenuItem, Chip, Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function RHFMultiSelect({ name, label, options, ...other }) {
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
          label={label}
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={options.find((opt) => opt.value === value)?.label} />
                ))}
              </Box>
            ),
          }}
          error={!!error}
          helperText={error?.message}
          {...other}
          sx={{ zIndex: 0 }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
