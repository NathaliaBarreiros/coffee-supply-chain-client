import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Container,
  Typography,
  Tooltip,
  Paper,
  Fab,
  IconButton,
  Box,
  Stack,
  Badge,
  Chip,
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { v4 as uuid } from 'uuid';
import { QrReader } from 'react-qr-reader';

import CloseIcon from '@mui/icons-material/Close';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { walletAddressSelector, userDataSelector } from '../../redux/appDataSlice';
import AskNextAction from '../../logic/GetNextAction/AskNextAction';
import HarvestForm from '../AddHarvest/HarvestForm';
import {
  setUrlExternal,
  setBatchNoExternal,
  setNextActionExternal,
  setMessageExternal,
  setReadyToAddExternal,
  urlExternalSelector,
  batchNoExternalSelector,
  nextActionExternalSelector,
  readyToAddExternalSelector,
  messageExternalSelector,
} from '../../redux/batchExternalDataSlice';

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

export default function AppWidgetQR({
  title,
  innerButtonText,
  innerDialogText,
  altImg,
  image,
  buttonText,
  dialogTitle,
  Form,
  color = 'quaternary',
  sx,
  ...other
}) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [openLectorQR, setOpenLectorQR] = useState(false);
  const [openBatch, setOpenBatch] = useState(false);
  const [stateLectorQR, setStateLectorQR] = useState(false);
  const [dataQR, setDataQR] = useState('');
  const [batchNew, setBatchNew] = useState('');
  const [nextActionNew, setNextActionNew] = useState('');

  const walletAddress = useSelector(walletAddressSelector);
  const userData = useSelector(userDataSelector);
  const urlQR = useSelector(urlExternalSelector);
  const batchNoQR = useSelector(batchNoExternalSelector);
  const nextAction = useSelector(nextActionExternalSelector);
  const messageQR = useSelector(messageExternalSelector);
  const readyToAdd = useSelector(readyToAddExternalSelector);

  const handleClickOpenBatch = () => {
    setOpenBatch(true);
  };
  const handleCloseBatch = () => {
    setOpenBatch(false);
    dispatch(setUrlExternal(''));
    dispatch(setBatchNoExternal(''));
    dispatch(setNextActionExternal(''));
    dispatch(setMessageExternal(''));
    dispatch(setReadyToAddExternal(false));
  };
  const handleClickOpenLectorQR = () => {
    setOpenLectorQR(true);
  };
  const handleCloseLectorQR = () => {
    setDataQR('');
    setStateLectorQR(false);
    setOpenLectorQR(false);
    dispatch(setUrlExternal(''));
    dispatch(setBatchNoExternal(''));
    dispatch(setNextActionExternal(''));
    dispatch(setMessageExternal(''));
    dispatch(setReadyToAddExternal(false));
  };

  const handleAddQR = () => {
    // console.log('redux 0:', urlQR);
    // console.log('redux 1: ', batchNoQR);
    // console.log('redux 2: ', nextAction);
    // console.log('redux 3: ', messageQR);
    // console.log('redux 4: ', readyToAdd);
    if (readyToAdd) {
      setOpenBatch(true);
      setStateLectorQR(false);
      setDataQR('');
      setBatchNew('');
      setNextActionNew('');
    }
  };

  const getNextAction = async (batchNoUrl) => {
    let str;
    let res;
    let validBatch = false;

    dispatch(
      setMessageExternal(`La url ${batchNoUrl} no contiene un número de lote correcto. Ingrese un código QR válido.`)
    );

    if (batchNoUrl.includes('?batch=0x')) {
      str = batchNoUrl.split('?batch=');
      res = await AskNextAction({ batchNo: str[1] });
      // console.log('rol: ', res);
      if (str[1].length === 42) {
        // console.log('str[1].length: ', str[1].length);
        // console.log('42');
        // console.log('user.role', userData.role);

        const items = userData.role.filter((item) => item.key === res.data);

        // const prue = items.filter((item, index) => items.findIndex((iItem) => iItem.key === res.data) === index);

        if (items.length > 0 && items[0].key === res.data) {
          // console.log('rol');
          setBatchNew(str[1]);
          setNextActionNew(res.data);
          dispatch(
            setMessageExternal(
              `Código QR válido. Proceda a agregar información de la intervención del lote correspondiente.`
            )
          );
          dispatch(setReadyToAddExternal(true));
          dispatch(setBatchNoExternal(str[1]));
          dispatch(setUrlExternal(batchNoUrl));
          dispatch(setNextActionExternal(res.data));
          validBatch = true;
        }
      }
    }

    if (validBatch) {
      enqueueSnackbar(`Código QR válido. Proceda a agregar información de la intervención del lote correspondiente.`, {
        variant: 'success',
      });
    } else {
      enqueueSnackbar(
        `La url ${batchNoUrl} no contiene un número de lote correcto.
      Ingrese un código QR válido.`,
        {
          variant: 'error',
        }
      );
    }
  };

  return (
    <>
      <Card
        sx={{
          py: 0,
          boxShadow: 2,
          color: (theme) => theme.palette[color].darker,
          borderRadius: '4%',

          ...sx,
        }}
        {...other}
      >
        <CardMedia component="img" height="194" alt={altImg} image={image} />

        <CardActions>
          {' '}
          <Button
            startIcon={<AddCircleOutlineIcon />}
            size="small"
            // variant="outlined"
            onClick={handleClickOpenLectorQR}
            className="widget"
            sx={{
              color: (theme) => theme.palette.secondary.dark2,
            }}
          >
            {buttonText}
          </Button>
          <BootstrapDialog
            PaperProps={{ sx: { width: '40%' } }}
            aria-labelledby="customized-dialog-title"
            open={openLectorQR}
          >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseLectorQR}>
              {dialogTitle}
            </BootstrapDialogTitle>
            <DialogContent
              dividers
              // PaperProps={{ sx: { width: '80%' } }}
              sx={{ margin: 0, padding: 0 }}
            >
              <Grid container sx={{ justifyContent: 'center' }}>
                <Grid item>
                  <QrReader
                    onResult={(result, error) => {
                      if (result) {
                        setDataQR(result?.text);
                        setStateLectorQR(true);
                        getNextAction(result?.text);
                      }
                    }}
                    containerStyle={{
                      marginTop: '0px',
                      paddingTop: '0px',
                      width: '350px',
                    }}
                  />
                </Grid>
                {stateLectorQR ? (
                  <Grid item>
                    <Typography
                      variant="h6"
                      sx={{ color: 'grey.700' }}
                      // color="text.secondary"
                    >
                      Su código contiene:{' '}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: 14 }} color="text.secondary">
                      {dataQR}
                    </Typography>
                  </Grid>
                ) : (
                  <Grid item sx={{ paddingTop: '0px', marginTop: '0px' }}>
                    <Typography variant="body2" sx={{ fontSize: 14 }} color="text.secondary">
                      Coloque su código QR frente a la cámara.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button disabled={!readyToAdd} autoFocus onClick={handleAddQR} startIcon={<AddCircleRoundedIcon />}>
                {innerButtonText}
              </Button>
              <BootstrapDialog aria-labelledby="customized-dialog-title" open={openBatch}>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseBatch}>
                  {innerDialogText}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                  <Form batchValue={batchNoQR} />
                </DialogContent>
              </BootstrapDialog>
            </DialogActions>
          </BootstrapDialog>
        </CardActions>
      </Card>
    </>
  );
}

// export default AppWidgetQR;
