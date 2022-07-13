import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns, DateAdapter } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { useField, useFormikContext } from 'formik';

const DateTimePickerMobile = ({ name, label, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [currentValue, setCurrentValue] = useState(new Date());
  const [field, meta] = useField(name);

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);

  const configDatePicker = {
    fullWidth: true,
    variant: 'outlined',
    InputLabelProps: {
      shrink: true,
    },
    ...field,
    // "named" props above apply to all
    // Textfields present.
    // "otherProps" below will be custom tailored
    // to particular Text/Date etc. Fields
    // such as label, type, id, etc.
    ...otherProps,
  };

  // meta object containes
  // submitForm, isSubmitting, touched, errors
  // Not really needed in this case, minDate/maxDate
  // props do the job, just keep 4 consistency
  if (meta && meta.touched && meta.error) {
    configDatePicker.error = true;
    configDatePicker.helperText = meta.error;
  }

  const iterate = (vals) => {
    console.log('aquiiiii');
    console.log('type: ', typeof vals);
    console.log('val: ', vals);
    // Object.keys(vals).map((val) => console.log('aqui', val));
    // Object.entries(vals).forEach((val) => {
    //   console.log(val);
    // });
    Object.keys(vals).forEach((e) => console.log(`key=${e} value=${vals[e]}`));
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDateTimePicker
        value={currentValue}
        onChange={(newValue) => {
          // What shows on Screen
          setCurrentValue(newValue);
          //   console.log('Old Field', field);
          // What goes to backend (Formik)
          setFieldValue(name, newValue);
          // Testing Visualization
          //   console.log('newVal', newValue);
          //   console.log('type newVal', typeof newValue);
          //   console.log('Field', field);

          iterate(newValue);
        }}
        minDate={minDate}
        maxDate={maxDate}
        label={label}
        inputFormat="yyyy/MM/dd hh:mm a"
        mask="___/__/__ __:__ _M"
        renderInput={(configDatePicker) => <TextField {...configDatePicker} />}
      />
    </LocalizationProvider>
  );
};

export default DateTimePickerMobile;
