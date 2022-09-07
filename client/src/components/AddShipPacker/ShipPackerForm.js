import { useDispatch } from 'react-redux';
import React, { useState, useRef, useEffect } from 'react';
import { useSnackbar } from 'notistack';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, Container, Typography, Button } from '@mui/material';
import TextfieldWrapper from '../FormsUI/Textfield';
import SelectWrapper from '../FormsUI/Select';
import DateTimePicker from '../FormsUI/DateTimePicker';
import PendingConfirmation from '../PendingConfirmation';
import DateTimePickerMobile from '../FormsUI/MobileDateTimePicker.js';

import { addTx, removeTx } from '../../redux/txSlice';

import HandleSubmit from '../../logic/AddShipPacker/HandleSubmit';
import transportTypeP from '../../data/transportTypeP.json';

const initialValues = {
  batchNo: '',
  toPackerTransportType: '',
  warehousePickupDate: '',
  toPackerShippingPrice: '',
};
const digitsRegex = /^[\d.]+$/;

const valSchema = Yup.object().shape({
  batchNo: Yup.string()
    .required('Obligatorio')
    .max(42, 'La dirección debe tener 42 caracteres')
    .min(42, 'La dirección debe tener 42 caracteres'),
  toPackerTransportType: Yup.string().required('Obligatorio'),
  // warehousePickupDate: Yup.date().required('Obligatorio'),
  warehousePickupDateTime: Yup.string().required('Obligatorio'),
  // Yup.object().required('Obligatorio'),
  toPackerShippingPrice: Yup.string()
    .required('Obligatorio')
    .matches(digitsRegex, 'Puede ingresar solo dígitos [0-9] y . como separador decimal'),
  // Yup.number().typeError('Por favor ingrese un número').required('Obligatorio'),
});

const ShipPackerForm = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('0x');

  const dispatch = useDispatch();
  const formikRef = useRef();

  const localHandleSubmit = async (values) => {
    setTxHash('0x');
    setLoading(true);
    const tx = HandleSubmit(values);
    tx.then((trans) => {
      setTxHash(trans.hash);
      dispatch(addTx({ tx: trans.hash, type: 'DoneShippingPacker' }));
      setLoading(false);
      enqueueSnackbar('Transacción pendiente de confirmación en blockchain', { variant: 'info' });
    }).catch((error) => {
      dispatch(removeTx({ tx: txHash, type: 'DoneShippingPacker' }));
      enqueueSnackbar(error.message, { variant: 'warning' });
      setLoading(false);
    });
  };

  useEffect(() => {
    if (props.batchValue) {
      formikRef.current.setFieldValue('batchNo', props.batchValue);
    }
  }, [props.batchValue]);

  const handleResetForm = (resetForm) => {
    // if (window.confirm('¿Está seguro que desea resetear las entradas de su formulario?')) {
    resetForm();
    // }
  };

  return (
    <Grid container>
      <PendingConfirmation loading={loading} />
      <Grid item xs={12}>
        <Container maxWidth="md">
          <div>
            <Formik
              enableReinitialize
              innerRef={formikRef}
              initialValues={initialValues}
              validationSchema={valSchema}
              onSubmit={(values) => {
                localHandleSubmit(values);
              }}
            >
              {({ dirty, isValid, resetForm }) => {
                return (
                  <Form>
                    <Grid container spacing={2}>
                      {props.batchValue ? (
                        <Grid item xs={12}>
                          <TextfieldWrapper name="batchNo" label="ID Lote" disabled />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <TextfieldWrapper name="batchNo" label="ID Lote" />
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <SelectWrapper
                          name="toPackerTransportType"
                          label="Tipo de Transporte"
                          options={transportTypeP}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {/* <DateTimePicker name="warehousePickupDate" label="Fecha de Recogida en Aglomerador" /> */}
                        <DateTimePickerMobile
                          name="warehousePickupDateTime"
                          label="Fecha y Hora de Recogida en Bodega"
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ marginBottom: 2 }}>
                        <TextfieldWrapper name="toPackerShippingPrice" label="Precio del Transporte [$]" />
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
                          AGREGAR DATOS
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

export default ShipPackerForm;
