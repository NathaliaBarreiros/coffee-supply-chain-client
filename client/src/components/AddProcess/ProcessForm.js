import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Grid,
  Container,
  Typography,
  Button,
  FormLabel,
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

import { addTx, removeTx } from '../../redux/txSlice';

import HandleSubmit from '../../logic/AddProcess/HandleSubmit';
import typeDrying from '../../data/typeDrying.json';
import typeRoasting from '../../data/typeRoasting.json';
import { createIpfs, addFileToIpfs } from '../../logic/ipfs';
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

const SUPPORTED_FORMATS = ['image/jpg', 'image/png', 'image/jpeg'];
const FILE_SIZE = 650 * 1024;

const initialValues = {
  batchNo: '',
  processorAddress: '',
  processorLat: '',
  processorLng: '',
  typeOfDrying: '',
  humidityAfterDrying: '',
  // roastImageHash: '',
  roastImageHash: undefined,
  roastTemp: '',
  typeOfRoast: '',
  roastDate: '',
  millDate: '',
  processorPricePerKilo: '',
  processBatchWeight: '',
};
const digitsRegex = /^[\d.]+$/;

const valSchema = Yup.object().shape({
  batchNo: Yup.string()
    .required('Obligatorio')
    .max(42, 'La dirección debe tener 42 caracteres')
    .min(42, 'La dirección debe tener 42 caracteres'),
  processorAddress: Yup.string().required('Obligatorio'),
  processorLat: Yup.string().required('Obligatorio'),
  processorLng: Yup.string().required('Obligatorio'),
  typeOfDrying: Yup.string().required('Obligatorio'),
  humidityAfterDrying: Yup.string()
    .required('Obligatorio')
    .matches(digitsRegex, 'Puede ingresar solo dígitos [0-9] y . como separador decimal'),
  // roastImageHash: Yup.string().required('Obligatorio'),
  roastImageHash: Yup.mixed()
    .required('Obligatorio')
    .test(
      'fileSize',
      `Solo se admite archivos menores a ${FILE_SIZE} bytes`,
      (value) => value === null || (value && value?.size <= FILE_SIZE)
    )
    .test(
      'type',
      'Los archivos soportados son: jpg, jpeg y png',
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
    ),
  roastTemp: Yup.string()
    .required('Obligatorio')
    .matches(digitsRegex, 'Puede ingresar solo dígitos [0-9] y . como separador decimal'),
  typeOfRoast: Yup.string().required('Obligatorio'),
  roastDate: Yup.date().required('Obligatorio'),
  millDate: Yup.date().required('Obligatorio'),
  processorPricePerKilo: Yup.string()
    .required('Obligatorio')
    .matches(digitsRegex, 'Puede ingresar solo dígitos [0-9] y . como separador decimal'),
  processBatchWeight: Yup.string()
    .required('Obligatorio')
    .matches(digitsRegex, 'Puede ingresar solo dígitos [0-9] y . como separador decimal'),
  // processorPrice: Yup.number().typeError('Por favor ingrese un número').required('Requerido'),
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

const ProcessForm = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('0x');
  const [fileUrl, setfileUrl] = useState('');
  const [openMap, setOpenMap] = useState(false);
  const formikRef = useRef();

  const dispatch = useDispatch();

  const directionData = String(useSelector(directionDataSelector));
  const latitudeData = String(useSelector(latitudeDataSelector));
  const longitudeData = String(useSelector(longitudeDataSelector));
  const locReadyToAddData = useSelector(locReadyToAddDataSelector);

  const ipfs = createIpfs();
  const localHandleSubmit = async (values) => {
    setTxHash('0x');
    setLoading(true);
    setfileUrl('');

    console.log('roast Img value', values.roastImageHash);
    console.log('ipfs: ', ipfs);

    if (values.roastImageHash !== '') {
      enqueueSnackbar('Guardando imagen en la red de IPFS', { variant: 'info' });
      const result = await addFileToIpfs(ipfs, values.roastImageHash);
      console.log('Result', result);
      if (result.error !== null) {
        enqueueSnackbar('Error al guardar imagen en la red de IPFS', { variant: 'error' });
        setLoading(false);
        return;
      }
      values.roastImageHash = result.url;
      setfileUrl(result.url);
    }

    const tx = HandleSubmit(values);
    tx.then((trans) => {
      setTxHash(trans.hash);
      dispatch(addTx({ tx: trans.hash, type: 'DoneProcessing' }));
      setLoading(false);
      enqueueSnackbar('Transacción pendiente de confirmación en blockchain', { variant: 'info' });
    }).catch((error) => {
      dispatch(removeTx({ tx: txHash, type: 'DoneProcessing' }));
      enqueueSnackbar(error.message, { variant: 'warning' });
      setLoading(false);
      setfileUrl('');
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
      formikRef.current.setFieldValue('processorAddress', directionData);
      formikRef.current.setFieldValue('processorLat', latitudeData);
      formikRef.current.setFieldValue('processorLng', longitudeData);
      // console.log('formik ref: ', formikRef.current);
      // console.log('AQUI 1');
    } else {
      formikRef.current.setFieldValue('processorAddress', '');
      formikRef.current.setFieldValue('processorLat', '');
      formikRef.current.setFieldValue('processorLng', '');
      // console.log('AQUI 2');
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
              {({ dirty, isValid, setTouched, setFieldValue, touched, errors, values, resetForm }) => {
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
                          Ubicación del Procesador
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sx={{ marginBottom: 0 }}>
                        <Button
                          size="small"
                          color="secondary"
                          className="map-btn"
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
                          <TextfieldWrapper
                            name="processorAddress"
                            label="Dirección del Procesador"
                            disabled
                            sx={{
                              boxShadow: 0,
                              borderRadius: '0%',
                              borderBottom: 'none',
                              marginBottom: 2,
                            }}
                          />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <TextfieldWrapper
                            name="processorAddress"
                            label="Dirección del Procesador"
                            sx={{
                              boxShadow: 0,
                              borderRadius: '0%',
                              borderBottom: 'none',
                              marginBottom: 0,
                            }}
                          />
                        </Grid>
                      )}
                      {locReadyToAddData ? (
                        <Grid item xs={12}>
                          <TextfieldWrapper
                            name="processorLat"
                            label="Latitud de la Dirección del Procesador"
                            disabled
                            sx={{
                              boxShadow: 0,
                              borderRadius: '0%',
                              borderBottom: 'none',
                              marginBottom: 2,
                            }}
                          />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <TextfieldWrapper
                            name="processorLat"
                            label="Latitud de la Dirección del Procesador"
                            sx={{
                              boxShadow: 0,
                              borderRadius: '0%',
                              borderBottom: 'none',
                              marginBottom: 0,
                            }}
                          />
                        </Grid>
                      )}
                      {locReadyToAddData ? (
                        <Grid item xs={12}>
                          <TextfieldWrapper
                            name="processorLng"
                            label="Longitud de la Dirección del Procesador"
                            disabled
                            sx={{
                              boxShadow: 0,
                              borderRadius: '0%',
                              borderBottom: 'none',
                              marginBottom: 2,
                            }}
                          />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <TextfieldWrapper
                            name="processorLng"
                            label="Longitud de la Dirección del Procesador"
                            sx={{
                              boxShadow: 0,
                              borderRadius: '0%',
                              borderBottom: 'none',
                              marginBottom: 0,
                            }}
                          />
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <SelectWrapper name="typeOfDrying" label="Tipo de Secado" options={typeDrying} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextfieldWrapper name="humidityAfterDrying" label="Humedad después del Secado [%]" />
                      </Grid>
                      <Grid item xs={12} justifyContent="space-between" alignItems="center">
                        <div className="flex flex-col">
                          <FormLabel component="legend" sx={{ paddingBottom: '3px' }}>
                            Imagen de Tueste
                          </FormLabel>
                          <input
                            className="mt-2 text-sm"
                            name="roastImageHash"
                            type="file"
                            onClick={(event) => {
                              console.log(event);
                              setFieldValue('roastImageHash', null);
                              event.target.value = '';
                            }}
                            onChange={(event) => {
                              setTouched({
                                ...touched,
                                roastImageHash: true,
                              });
                              setFieldValue('roastImageHash', event.target.files[0]);
                            }}
                          />
                          {touched.roastImageHash && errors.roastImageHash ? (
                            <small className="text-red-500 pt-0 MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained MuiFormHelperText-filled">
                              {errors.roastImageHash}
                            </small>
                          ) : null}
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <TextfieldWrapper name="roastTemp" label="Temperatura de Tueste [ºC]" />
                      </Grid>
                      <Grid item xs={12}>
                        <SelectWrapper name="typeOfRoast" label="Tipo de Tueste" options={typeRoasting} />
                      </Grid>
                      <Grid item xs={12}>
                        {/* <DateTimePicker name="roastDate" label="Fecha de Tostado" /> */}
                        <DateTimePickerMobile name="roastDate" label="Fecha y Hora de Tostado" />
                      </Grid>
                      <Grid item xs={12}>
                        <DateTimePickerMobile name="millDate" label="Fecha y Hora de Molienda" />
                        {/* <DateTimePicker name="millDate" label="Fecha de Molienda" /> */}
                      </Grid>
                      <Grid item xs={12}>
                        <TextfieldWrapper name="processorPricePerKilo" label="Precio por Kilo de Café Procesado [$]" />
                      </Grid>
                      <Grid item xs={12} sx={{ marginBottom: 2 }}>
                        <TextfieldWrapper name="processBatchWeight" label="Peso del Lote después del Procesado [kg]" />
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

export default ProcessForm;
