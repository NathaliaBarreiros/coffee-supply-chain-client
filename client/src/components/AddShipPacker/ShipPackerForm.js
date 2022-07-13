import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Grid, Container, Typography, Button } from '@mui/material';
import TextfieldWrapper from '../FormsUI/Textfield';
import SelectWrapper from '../FormsUI/Select';
import DateTimePicker from '../FormsUI/DateTimePicker';
import PendingConfirmation from '../PendingConfirmation';
import MobileDateTimePicker from '../FormsUI/MobileDateTimePicker';

import { addTx, removeTx } from '../../redux/txSlice';

import HandleSubmit from '../../logic/AddShipPacker/HandleSubmit';
import transportTypeP from '../../data/transportTypeP.json';

const initialValues = {
  batchNo: '',
  transportTypeP: '',
  pickupDateTimeP: {},
  shipPriceP: '',
};

const valSchema = Yup.object().shape({
  batchNo: Yup.string()
    .required('Obligatorio')
    .max(42, 'La dirección debe tener 42 caracteres')
    .min(42, 'La dirección debe tener 42 caracteres'),
  transportTypeP: Yup.string().required('Obligatorio'),
  pickupDateTimeP: Yup.object().required('Obligatorio'),
  // Yup.string().required('Obligatorio'),
  shipPriceP: Yup.number().typeError('Por favor ingrese un número').required('Obligatorio'),
});

const ShipPackerForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('0x');

  const dispatch = useDispatch();

  const localHandleSubmit = async (values) => {
    setTxHash('0x');
    setLoading(true);
    const tx = HandleSubmit(values);
    tx.then((trans) => {
      setTxHash(trans.hash);
      dispatch(addTx({ tx: trans.hash, type: 'DoneShippingPacker' }));
      setLoading(false);
      enqueueSnackbar('Transacción pendiente de confirmación de red Ethereum', { variant: 'info' });
    }).catch((error) => {
      dispatch(removeTx({ tx: txHash, type: 'DoneShippingPacker' }));
      enqueueSnackbar(error.message, { variant: 'warning' });
      setLoading(false);
    });
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
              {({ dirty, isValid, values }) => {
                return (
                  <Form>
                    <Grid container spacing={2}>
                      {/* <Grid item xs={12}>
                        <Typography className="mb-5 font-semibold underline underline-offset-2">
                          DATOS DE TRANSPORTE HACIA EMPACADORA
                        </Typography>
                      </Grid> */}
                      <Grid item xs={6}>
                        <TextfieldWrapper name="batchNo" label="No. Lote" />
                      </Grid>
                      <Grid item xs={6}>
                        <SelectWrapper name="transportTypeP" label="Tipo de Transporte" options={transportTypeP} />
                      </Grid>
                      <Grid item xs={6}>
                        {/* <DateTimePicker name="pickupDateP" label="Fecha Recogida en Aglomerador" /> */}
                        <MobileDateTimePicker name="pickupDateTimeP" label="Fecha y Hora de Recogida en Aglomerador" />
                        <Typography>{String(values.pickupDateTimeP)}</Typography>
                        <Typography>{typeof values.pickupDateTimeP}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <TextfieldWrapper name="shipPriceP" label="Precio del Transporte" />
                      </Grid>
                      <Grid item xs={12}>
                        <Button fullWidth variant="contained" disabled={!dirty || !isValid} type="submit">
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
