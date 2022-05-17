import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, Container, Typography, Button } from '@mui/material';
import TextfieldWrapper from '../FormsUI/Textfield';

import HandleSubmit from '../../logic/AddFarmDetails/HandleSubmit';
import FarmListener from '../../logic/AddFarmDetails/FarmListener';

const initialValues = {
  // registrationNo: '',
  farmName: '',
  latitude: '',
  longitude: '',
  farmAddress: '',
};

const valSchema = Yup.object().shape({
  // registrationNo: Yup.string().required('Requerido'),
  farmName: Yup.string().required('Requerido'),
  latitude: Yup.string().required('Requerido'),
  longitude: Yup.string().required('Requerido'),
  farmAddress: Yup.string().required('Requerido'),
});

const FarmForm = () => {
  const { farmRegistered } = FarmListener();

  useEffect(() => {
    console.log(farmRegistered);
  }, [farmRegistered]);

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
                        <Typography>Añadir Detalles de la Granja</Typography>
                      </Grid>
                      {/* <Grid item xs={6}>
                        <TextfieldWrapper name="registrationNo" label="Registration No" />
                      </Grid> */}
                      <Grid item xs={6}>
                        <TextfieldWrapper name="farmName" label="Farm Name" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="latitude" label="Latitude" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="longitude" label="Longitude" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="farmAddress" label="Farm Address" />
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

export default FarmForm;
