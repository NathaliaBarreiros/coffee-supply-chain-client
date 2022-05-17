import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { create } from 'ipfs-http-client';
import { Grid, Container, Typography, Button } from '@mui/material';
import TextfieldWrapper from '../FormsUI/Textfield/index';
import SelectWrapper from '../FormsUI/Select';
import CheckboxWrapper from '../FormsUI/Checkbox';

import role from '../../data/roles.json';
import HandleSubmit from '../../logic/UpdateUser/HandleSubmit';
import UpdateUserListener from '../../logic/UpdateUser/UpdateUserListener';

const initialValues = {
  name: '',
  email: '',
  role: '',
  isActive: true,
  profileHash: null,
};

const SUPPORTED_FORMATS = ['image/jpg', 'image/png', 'image/jpeg'];
const FILE_SIZE = 650 * 1024;

const valSchema = Yup.object().shape({
  name: Yup.string().required('Requerido').min(2, 'Ingresa el nombre completo'),
  email: Yup.string().email('Email inválido').required('Requerido'),
  role: Yup.string().required('Requerido'),
  isActive: Yup.boolean().required('requerido'),
  //profileHash: Yup.string(),
  profileHash: Yup.mixed()
    .test('fileSize', 'File too large', (value) => value === null || (value && value.size <= FILE_SIZE))
    .test(
      'type',
      'Invalid file format selection',
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
    ),
});

const UpdateUserForm = () => {
  const { userUpdated } = UpdateUserListener();

  let ipfs;
  try {
    ipfs = create({
      url: 'https://ipfs.infura.io:5001/api/v0',
    });
  } catch (err) {
    ipfs = undefined;
  }

  useEffect(() => {
    console.log(userUpdated);
  }, [userUpdated]);

  return (
    <Grid container>
      <Grid item xs={12}>
        {/* <Container maxWidth="md"> */}
        <div>
          <Container maxWidth="md">
            <Formik
              initialValues={initialValues}
              validationSchema={valSchema}
              onSubmit={(values) => {
                HandleSubmit(values, ipfs);
              }}
            >
              {({ dirty, isValid, setTouched, setFieldValue, touched, errors, values }) => {
                return (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography>Modificar Datos de Usuario</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="name" label="Name" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="email" label="Email" />
                      </Grid>
                      <Grid item xs={6}>
                        <SelectWrapper name="role" label="Role" options={role} />
                      </Grid>
                      <Grid item xs={6}>
                        {/* <TextfieldWrapper name="profileHash" label="Profile Hash" /> */}
                        <div>
                          <Typography variant="inherit">Profile Hash</Typography>

                          <input
                            name="profileHash"
                            // label="Profile Hash"
                            type="file"
                            onChange={(event) => {
                              setTouched({
                                ...touched,
                                profileHash: true,
                              });
                              setFieldValue('profileHash', event.target.files[0]);
                            }}
                          />
                          {touched.profileHash && errors.profileHash ? <small>{errors.profileHash}</small> : null}
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <CheckboxWrapper name="isActive" legend="Activity" label="Active User" />
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
          </Container>
        </div>
        {/* </Container> */}
      </Grid>
    </Grid>
  );
};

export default UpdateUserForm;
