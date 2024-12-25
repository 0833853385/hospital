// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Switch, FormControlLabel } from '@mui/material';

// ----------------------------------------------------------------------

// type IProps = Omit<FormControlLabelProps, 'control'>;

// interface Props extends IProps {
//   name: string;
//   disableSwitch?: boolean;
// }

export default function RHFSwitch({ name, disableSwitch, ...other }) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Switch {...field} checked={field.value} disabled={disableSwitch} />
          )}
        />
      }
      {...other}
    />
  );
}
