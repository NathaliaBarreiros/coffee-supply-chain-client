import { useDispatch } from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';
import { useSnackbar } from 'notistack';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, Container, Typography, Button } from '@mui/material';
import TextfieldWrapper from '../FormsUI/Textfield';
import SelectWrapper from '../FormsUI/Select';
import DateTimePicker from '../FormsUI/DateTimePicker';
import DateTimePickerMobile from '../FormsUI/MobileDateTimePicker.js';
import PendingConfirmation from '../PendingConfirmation';

import { addTx, removeTx } from '../../redux/txSlice';

import HandleSubmit from '../../logic/AddHarvest/HandleSubmit';
import typeSeeds from '../../data/typeSeeds.json';

const initialValues = {
  batchNo: '',
  seedSupplier: '',
  typeOfSeed: '',
  coffeeFamily: '',
  fertilizerUsed: '',
  harvestDate: '',
  humidityPercentage: '',
  batchWeight: '',
};

const digitsRegex = /^[\d.]+$/;

const valSchema = Yup.object().shape({
  batchNo: Yup.string()
    .required('Obligatorio')
    .max(42, 'La dirección debe tener 42 caracteres')
    .min(42, 'La dirección debe tener 42 caracteres'),
  seedSupplier: Yup.string().required('Obligatorio'),
  typeOfSeed: Yup.string().required('Obligatorio'),
  coffeeFamily: Yup.string().required('Obligatorio'),
  fertilizerUsed: Yup.string().required('Obligatorio'),
  harvestDate: Yup.date().required('Obligatorio'),
  humidityPercentage: Yup.string()
    .required('Obligatorio')
    .matches(digitsRegex, 'Puede ingresar solo dígitos [0-9] y . como separador decimal'),
  batchWeight: Yup.string()
    .required('Obligatorio')
    .matches(digitsRegex, 'Puede ingresar solo dígitos [0-9] y . como separador decimal'),
});

const HarvestForm = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('0x');
  const formikRef = useRef();

  const dispatch = useDispatch();

  const localHandleSubmit = async (values) => {
    setTxHash('0x');
    setLoading(true);
    const tx = HandleSubmit(values);
    tx.then((trans) => {
      setTxHash(trans.hash);
      dispatch(addTx({ tx: trans.hash, type: 'DoneHarvesting' }));
      setLoading(false);
      enqueueSnackbar('Transacción pendiente de confirmación en blockchain', { variant: 'info' });
    }).catch((error) => {
      dispatch(removeTx({ tx: txHash, type: 'DoneHarvesting' }));
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
              innerRef={formikRef}
              enableReinitialize
              initialValues={initialValues}
              validationSchema={valSchema}
              onSubmit={(values) => {
                localHandleSubmit(values);
              }}
            >
              {({ dirty, isValid, errors, handleChange, values, setFieldValue, resetForm }) => (
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
                      <TextfieldWrapper name="seedSupplier" label="Proveedor de Semilla" />
                    </Grid>
                    <Grid item xs={12}>
                      <SelectWrapper name="typeOfSeed" label="Tipo de Semilla" options={typeSeeds} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextfieldWrapper name="coffeeFamily" label="Familia del Café" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextfieldWrapper name="fertilizerUsed" label="Fertilizante Utilizado" />
                    </Grid>
                    <Grid item xs={12}>
                      {/* <DateTimePicker name="harvestDate" label="Fecha de Cosecha" /> */}
                      <DateTimePickerMobile name="harvestDate" label="Fecha y Hora de Cosecha" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextfieldWrapper
                        name="humidityPercentage"
                        label="Porcentaje de Humedad del Grano Cosechado [%]"
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ marginBottom: 2 }}>
                      <TextfieldWrapper name="batchWeight" label="Peso del Lote Cosechado [kg]" />
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
                        variant="contained"
                        className="form-btn"
                        disabled={!isValid || !dirty}
                        type="submit"
                      >
                        {' '}
                        AGREGAR DATOS
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

export default HarvestForm;
