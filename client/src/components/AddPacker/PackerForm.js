import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, Container, Typography, Button } from '@mui/material';
import TextfieldWrapper from '../FormsUI/Textfield';
import SelectWrapper from '../FormsUI/Select';
import DateTimePicker from '../FormsUI/DateTimePicker';

import HandleSubmit from '../../logic/AddPacker/HandleSubmit';
import PackerListener from '../../logic/AddPacker/PackerListener';

const initialValues = {
  batchNo: '',
  packAddress: '',
  arrivalDateP: '',
  packDate: '',
  packPrice: '',
};

const valSchema = Yup.object().shape({
  batchNo: Yup.string().required('Requerido').max(42, 'La dirección debe tener máximo 42 caracteres').min(42),
  packAddress: Yup.string().required('Requerido'),
  arrivalDateP: Yup.date().required('Requerido'),
  packDate: Yup.date().required('Requerido'),
  packPrice: Yup.number().typeError('Por favor ingrese un precio correcto').required('Requerido'),
});

const PackerForm = () => {
  const { packRegistered } = PackerListener();

  useEffect(() => {
    console.log(packRegistered);
  }, [packRegistered]);

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
                        <Typography>Añadir Datos de Empacado</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="batchNo" label="Batch No" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="packAddress" label="Packer Address" />
                      </Grid>
                      <Grid item xs={6}>
                        <DateTimePicker name="arrivalDateP" label="Arrival Date at Packer" />
                      </Grid>
                      <Grid item xs={6}>
                        <DateTimePicker name="packDate" label="Packaging Date" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="packPrice" label="Packer Price" />
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

export default PackerForm;
