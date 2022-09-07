import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, Container, Typography, Button, FormLabel } from '@mui/material';
import TextfieldWrapper from '../FormsUI/Textfield/index';
import CheckboxWrapper from '../FormsUI/Checkbox';
import PendingConfirmation from '../PendingConfirmation';

import { addTx, removeTx } from '../../redux/txSlice';
import { userDataSelector } from '../../redux/appDataSlice';

import HandleSubmit from '../../logic/UpdateUser/HandleSubmit';
import { createIpfs, addFileToIpfs } from '../../logic/ipfs';

const SUPPORTED_FORMATS = ['image/jpg', 'image/png', 'image/jpeg'];
const FILE_SIZE = 650 * 1024;

const valSchema = Yup.object().shape({
  name: Yup.string().required('Obligatorio').min(2, 'Ingresa un nombre completo'),
  email: Yup.string().email('Email inválido').required('Obligatorio'),
  // role: Yup.string().required('Obligatorio'),
  isActive: Yup.boolean().required('Obligatorio'),
  // profileHash: Yup.string(),
  profileHash: Yup.mixed()
    .test(
      'fileSize',
      `Solo se admite archivos menores a ${FILE_SIZE} bytes`,
      (value) => value === null || (value && value?.size <= FILE_SIZE)
    )
    .test(
      'type',
      'Los formatos soportados para los archivos son: jpg, jpeg y png',
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
    ),
});

const UpdateUserForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('0x');
  const [enableIpfs, setEnableIpfs] = useState(false);

  const dispatch = useDispatch();
  const userData = useSelector(userDataSelector);

  const initialValues = {
    name: userData.name,
    email: userData.email,
    // role: userData.role,
    isActive: userData.isActive,
    profileHash: null,
  };

  const ipfs = createIpfs();
  const localHandleSubmit = async (values) => {
    setTxHash('0x');
    setLoading(true);
    let result = null;
    let tempProfileHash = null;

    if (!values.profileHash || values.profileHash.length === 0) {
      values.profileHash = '';
    }
    if (values.profileHash !== '') {
      tempProfileHash = values.profileHash;
      enqueueSnackbar('Guardando imagen del usuario en red IPFS', { variant: 'info' });
      result = await addFileToIpfs(ipfs, values.profileHash);
      if (result.error !== null) {
        enqueueSnackbar('Error al guardar imagen del usuario en red IPFS', { variant: 'error' });
        setLoading(false);
        return;
      }
      values.profileHash = result.url;
      setEnableIpfs(true);
    }

    const tx = HandleSubmit(values);
    tx.then((trans) => {
      setTxHash(trans.hash);
      dispatch(addTx({ tx: trans.hash, type: 'UserUpdate' }));
      setLoading(false);
      enqueueSnackbar('Transacción pendiente de confirmación en blockchain', { variant: 'info' });
    }).catch((error) => {
      dispatch(removeTx({ tx: txHash, type: 'UserUpdate' }));
      enqueueSnackbar(error.message, { variant: 'error' });
      values.profileHash = tempProfileHash;
      setLoading(false);
      setEnableIpfs(false);
    });
  };

  const handleResetForm = (resetForm) => {
    setEnableIpfs(false);
    resetForm();
  };

  return (
    <Grid container>
      <PendingConfirmation loading={loading} />
      <Grid item xs={12}>
        <Container maxWidth="md">
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={valSchema}
              onSubmit={(values) => {
                localHandleSubmit(values);
              }}
            >
              {({ dirty, isValid, setTouched, setFieldValue, touched, errors, values, resetForm }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Grid item xs={6} className="bg-gray-200 max-w-fit p-2 rounded-xl mb-5">
                        {enableIpfs ? (
                          <img
                            alt="Profile"
                            className="rounded-full w-40 h-40"
                            // src={values.profileHash ? URL.createObjectURL(values.profileHash) : userData.profileHash}
                            src={values.profileHash ? values.profileHash : userData.profileHash}
                          />
                        ) : (
                          <img
                            alt="Profile"
                            className="rounded-full w-40 h-40"
                            // src={values.profileHash ? URL.createObjectURL(values.profileHash) : userData.profileHash}
                            src={values.profileHash ? URL.createObjectURL(values.profileHash) : userData.profileHash}
                          />
                        )}
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: 2 }}>
                      <TextfieldWrapper name="name" label="Nombre" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextfieldWrapper name="email" label="Email" />
                    </Grid>
                    {/* <Grid item xs={6}>
                        <SelectWrapper name="role" label="Rol" options={role} />
                      </Grid> */}
                    <Grid item xs={12} justifyContent="space-between" alignItems="center">
                      <div className="flex flex-col">
                        <FormLabel component="legend" sx={{ paddingBottom: '3px', paddingTop: 0 }}>
                          Cargar imagen de perfil
                        </FormLabel>
                        <input
                          className="mt-2 text-sm"
                          name="profileHash"
                          type="file"
                          onChange={(event) => {
                            setTouched({
                              ...touched,
                              profileHash: true,
                            });
                            setFieldValue('profileHash', event.target.files[0]);
                          }}
                        />
                        <br />
                        {touched.profileHash && errors.profileHash ? (
                          <small className="text-red-500 pt-0 MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained MuiFormHelperText-filled error-img">
                            {errors.profileHash}
                          </small>
                        ) : null}
                      </div>
                    </Grid>
                    <Grid item xs={12} sx={{ marginBottom: 1 }}>
                      <CheckboxWrapper name="isActive" legend="Estado" label="Usuario Activo" />
                    </Grid>

                    <Grid item xs={6} sx={{ marginBottom: 2 }}>
                      <Button
                        fullWidth
                        className="reset-btn"
                        variant="outlined"
                        //  disabled={dirty || isValid}
                        type="reset"
                        onClick={() => {
                          handleResetForm(resetForm);
                        }}
                      >
                        {' '}
                        RESETEAR FORMULARIO
                      </Button>
                    </Grid>
                    <Grid item xs={6} sx={{ marginBottom: 2 }}>
                      <Button
                        fullWidth
                        className="form-btn"
                        variant="contained"
                        disabled={!dirty || !isValid}
                        type="submit"
                      >
                        {' '}
                        ACTUALIZAR USUARIO
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </div>
        </Container>
      </Grid>
    </Grid>
  );
};

export default UpdateUserForm;
