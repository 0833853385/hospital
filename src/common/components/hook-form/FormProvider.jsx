// form
import { FormProvider as Form } from 'react-hook-form';

// ----------------------------------------------------------------------

// type Props = {
//   children: ReactNode;
//   methods: UseFormReturn<any>;
//   onSubmit?: VoidFunction;
// };

export default function FormProvider({ children, onSubmit, methods }) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
