import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useRef } from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Grid,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import TextfieldWrapper from '../FormsUI/Textfield';
import SelectWrapper from '../FormsUI/Select';
import DateTimePicker from '../FormsUI/DateTimePicker';
import DateTimePickerMobile from '../FormsUI/MobileDateTimePicker.js';
import PendingConfirmation from '../PendingConfirmation';
import MapsLocation from '../Maps/MapsLocation';
import {
  directionDataSelector,
  latitudeDataSelector,
  longitudeDataSelector,
  locReadyToAddDataSelector,
  setDirectionData,
  setLatitudeData,
  setLongitudeData,
  setLocReadyToAddData,
} from '../../redux/locationDataSlice';

import { addTx, removeTx } from '../../redux/txSlice';

import HandleSubmit from '../../logic/AddPacker/HandleSubmit';

const initialValues = {
  batchNo: '',
  packerAddress: '',
  packerLat: '',
  packerLng: '',
  packerArrivalDate: '',
  packingDate: '',
  packingPricePerKilo: '',
};
const digitsRegex = /^[\d.]+$/;
const valSchema = Yup.object().shape({
  batchNo: Yup.string()
    .required('Obligatorio')
    .max(42, 'La dirección debe tener 42 caracteres')
    .min(42, 'La dirección debe tener 42 caracteres'),
  packerAddress: Yup.string().required('Obligatorio'),
  packerLat: Yup.string().required('Obligatorio'),
  packerLng: Yup.string().required('Obligatorio'),
  packerArrivalDate: Yup.date().required('Obligatorio'),
  packingDate: Yup.date().required('Obligatorio'),
  packingPricePerKilo: Yup.string()
    .required('Obligatorio')
    .matches(digitsRegex, 'Puede ingresar solo dígitos [0-9] y . como separador decimal'),
  // Yup.number().typeError('Por favor ingrese un número').required('Obligatorio'),
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const PackerForm = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('0x');
  const [openMap, setOpenMap] = useState(false);
  const formikRef = useRef();

  const dispatch = useDispatch();

  const directionData = String(useSelector(directionDataSelector));
  const latitudeData = String(useSelector(latitudeDataSelector));
  const longitudeData = String(useSelector(longitudeDataSelector));
  const locReadyToAddData = useSelector(locReadyToAddDataSelector);

  const localHandleSubmit = async (values) => {
    setTxHash('0x');
    setLoading(true);
    const tx = HandleSubmit(values);
    tx.then((trans) => {
      setTxHash(trans.hash);
      dispatch(addTx({ tx: trans.hash, type: 'DonePackaging' }));
      setLoading(false);
      enqueueSnackbar('Transacción pendiente de confirmación en blockchain', { variant: 'info' });
    }).catch((error) => {
      dispatch(removeTx({ tx: txHash, type: 'DonePackaging' }));
      enqueueSnackbar(error.message, { variant: 'warning' });
      setLoading(false);
    });
  };

  const handleClickOpenMap = () => {
    setOpenMap(true);
  };
  const handleCloseMap = () => {
    setOpenMap(false);
  };

  useEffect(() => {
    if (props.batchValue) {
      formikRef.current.setFieldValue('batchNo', props.batchValue);
    }

    if (locReadyToAddData) {
      formikRef.current.setFieldValue('packerAddress', directionData);
      formikRef.current.setFieldValue('packerLat', latitudeData);
      formikRef.current.setFieldValue('packerLng', longitudeData);
    } else {
      formikRef.current.setFieldValue('packerAddress', '');
      formikRef.current.setFieldValue('packerLat', '');
      formikRef.current.setFieldValue('packerLng', '');
    }
  }, [props.batchValue, latitudeData, longitudeData, directionData]);

  const handleResetForm = (resetForm) => {
    // if (window.confirm('¿Está seguro que desea resetear las entradas de su formulario?')) {
    resetForm();
    dispatch(setDirectionData(''));
    dispatch(setLatitudeData(''));
    dispatch(setLongitudeData(''));
    dispatch(setLocReadyToAddData(false));
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

                      <Grid
                        item
                        xs={12}
                        sx={{
                          marginBottom: 0,
                          marginLeft: 0,
                          paddingLeft: 0,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: 'grey.600',
                          }}
                        >
                          Ubicación del Empacador
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sx={{ marginBottom: 0 }}>
                        <Button
                          size="small"
                          className="map-btn"
                          color="secondary"
                          // color="comp5"
                          variant="contained"
                          startIcon={<AddLocationAltIcon />}
                          onClick={handleClickOpenMap}
                          sx={{ boxShadow: 2 }}
                        >
                          Buscar en Mapa
                        </Button>
                        <BootstrapDialog
                          aria-labelledby="customized-dialog-title"
                          open={openMap}
                          PaperProps={{ sx: { width: '100%', height: '100%' } }}
                        >
                          <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseMap}>
                            Ubica el marcador en la dirección deseada
                          </BootstrapDialogTitle>
                          <DialogContent dividers>
                            <MapsLocation svg="/static/icons/marker2.png" />
                          </DialogContent>
                        </BootstrapDialog>
                      </Grid>

                      {locReadyToAddData ? (
                        <Grid item xs={12}>
                          <TextfieldWrapper name="packerAddress" label="Dirección de Empacador" disabled />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <TextfieldWrapper name="packerAddress" label="Dirección de Empacador" />
                        </Grid>
                      )}

                      {locReadyToAddData ? (
                        <Grid item xs={12}>
                          <TextfieldWrapper name="packerLat" label="Latitud de la Dirección de Empacador" disabled />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <TextfieldWrapper name="packerLat" label="Latitud de la Dirección de Empacador" />
                        </Grid>
                      )}

                      {locReadyToAddData ? (
                        <Grid item xs={12}>
                          <TextfieldWrapper name="packerLng" label="Longitud de la Dirección de Empacador" disabled />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <TextfieldWrapper name="packerLng" label="Longitud de la Dirección de Empacador" />
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <DateTimePickerMobile name="packerArrivalDate" label="Fecha y Hora de Llegada en Empacador" />
                        {/* <DateTimePicker name="packerArrivalDate" label="Fecha de Llegada al Empacador" /> */}
                      </Grid>
                      <Grid item xs={12}>
                        <DateTimePickerMobile name="packingDate" label="Fecha y Hora de Empacado" />
                        {/* <DateTimePicker name="packingDate" label="Fecha de Empacado" /> */}
                      </Grid>
                      <Grid item xs={12} sx={{ marginBottom: 2 }}>
                        <TextfieldWrapper name="packingPricePerKilo" label="Precio por Kilo de Café Empacado [$]" />
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

export default PackerForm;
