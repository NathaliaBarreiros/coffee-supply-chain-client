import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { create } from 'ipfs-http-client';
import { Grid, Container, Typography, Button } from '@mui/material';
import TextfieldWrapper from '../FormsUI/Textfield';
import SelectWrapper from '../FormsUI/Select';
import DateTimePicker from '../FormsUI/DateTimePicker';

import HandleSubmit from '../../logic/AddProcess/HandleSubmit';
import ProcessListener from '../../logic/AddProcess/ProcessListener';
import typeDrying from '../../data/typeDrying.json';
import typeRoasting from '../../data/typeRoasting.json';

const initialValues = {
  batchNo: '',
  procAddress: '',
  typeOfDrying: '',
  roastImageHash: null,
  roastTemp: '',
  typeOfRoast: '',
  roastDate: '',
  millDate: '',
  processorPrice: '',
};

const SUPPORTED_FORMATS = ['image/jpg', 'image/png', 'image/jpeg'];
const FILE_SIZE = 650 * 1024;

const valSchema = Yup.object().shape({
  batchNo: Yup.string().required('Requerido').max(42, 'La dirección debe tener máximo 42 caracteres').min(42),
  procAddress: Yup.string().required('Requerido'),
  typeOfDrying: Yup.string().required('Requerido'),
  // roastImageHash: Yup.string().required('Requerido'),
  profileHash: Yup.mixed()
    .required('requerido')
    .test('fileSize', 'File too large', (value) => value === null || (value && value.size <= FILE_SIZE))
    .test(
      'type',
      'Invalid file format selection',
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
    ),
  roastTemp: Yup.string().required('Requerido'),
  typeOfRoast: Yup.string().required('Requerido'),
  roastDate: Yup.date().required('Requerido'),
  millDate: Yup.date().required('Requerido'),
  processorPrice: Yup.number().typeError('Por favor ingrese un precio correcto').required('Requerido'),
});

const ProcessForm = () => {
  const { processRegistered } = ProcessListener();

  useEffect(() => {
    console.log(processRegistered);
  }, [processRegistered]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Container maxWidth="md">
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={valSchema}
              onSubmit={(values) => {
                HandleSubmit(values);
              }}
            >
              {({ dirty, isValid }) => {
                return (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography>Añadir Datos del Procesamiento</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="batchNo" label="Batch No" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="procAddress" label="Processor Address" />
                      </Grid>
                      <Grid item xs={6}>
                        <SelectWrapper name="typeOfDrying" label="Type Of Drying" options={typeDrying} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="roastImageHash" label="Roasting Image Hash" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="roastTemp" label="Roasting Temperature" />
                      </Grid>
                      <Grid item xs={6}>
                        <SelectWrapper name="typeOfRoast" label="Type Of Roasting" options={typeRoasting} />
                      </Grid>
                      <Grid item xs={6}>
                        <DateTimePicker name="roastDate" label="Roast Date" />
                      </Grid>
                      <Grid item xs={6}>
                        <DateTimePicker name="millDate" label="Mill Date" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="processorPrice" label="Processor Price" />
                      </Grid>
                      <Grid item xs={12}>
                        <Button fullWidth variant="contained" disabled={!dirty || !isValid} type="submit">
                          {' '}
                          SUBMIT
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Container>
      </Grid>
    </Grid>
  );
};

export default ProcessForm;
