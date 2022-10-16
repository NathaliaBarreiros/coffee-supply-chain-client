import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Box,
  Typography,
  Grid,
  Container,
  Card,
  CardContent,
  useTheme,
  Paper,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import Wave from 'react-wavify';
import CloseIcon from '@mui/icons-material/Close';
import '../../App.css';

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

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

const Section1 = () => {
  const theme = useTheme();

  const [stateLectorQR, setStateLectorQR] = useState(false);
  const [dataQR, setDataQR] = useState('');

  const [openLectorQR, setOpenLectorQR] = useState(false);

  const handleClickOpenLectorQR = () => {
    setOpenLectorQR(true);
  };

  const handleCloseLectorQR = () => {
    setDataQR('');
    setStateLectorQR(false);
    setOpenLectorQR(false);
  };

  return (
    <div id="section-1 mb-20">
      <Wave
        className="wave-track mt-20 mb-20"
        fill="#042A2B"
        paused={false}
        options={{
          height: 50,
          amplitude: 75,
          speed: 0.1,
          points: 5,
        }}
      />
      <div className="absolute top-0 right-0 left-0 grid mx-auto max-w-4xl mt-20">
        <div className="mx-auto my-5">
          <Typography
            className=" font-semibold title-track text-2xl lg:text-4xl"
            sx={{
              textAlign: 'center',
              color: theme.palette.secondary.dark2,
            }}
          >
            Escanea el Código QR de tu Café
          </Typography>
        </div>
        <div>
          <Box
            component="img"
            className="w-full max-w-lg h-auto mx-auto"
            alt="Scan the QR of your coffee product"
            src="/static/images/track4.svg"
          />
        </div>
      </div>
      <div className="grid mx-auto max-w-4xl my-20">
        <div className="px-5">
          <Card className="section-1-card max-w-4xl mx-auto">
            <CardContent>
              <Typography className="section-1-info">
                Tu producto ha sido identificado a través de su lote de origen, el mismo que ha sido modificado durante
                las siguientes etapas:
                <br />
                {bull} Cosecha
                {bull} Procesado {bull} Catación {bull} Venta del Grano
                {bull} Bodegaje {bull} Transporte a Empacador
                {bull} Empacado {bull} Transporte a Retailer
                {bull} Retailer
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 mt-4 max-w-2xl mx-auto">
          <Button
            href={`${process.env.REACT_APP_HOST_URL}/tracking?batch=0x68c37dD00940BEb553BC8ADc1071a4568fEDC793`}
            className="font-bold track-btn bg-emerald-600 text-white lg:min-w-[300px] max-w-xs mx-auto"
            variant="contained"
          >
            LOTE DE EJEMPLO
          </Button>
          <Button
            className="font-bold track-btn bg-emerald-600 text-white lg:min-w-[300px] max-w-xs mx-auto"
            variant="contained"
            size="medium"
            onClick={handleClickOpenLectorQR}
          >
            ESCANEAR QR
          </Button>
          <BootstrapDialog
            PaperProps={{ sx: { width: '40%' } }}
            aria-labelledby="customized-dialog-title"
            open={openLectorQR}
          >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseLectorQR}>
              Lector QR
            </BootstrapDialogTitle>
            <DialogContent
              dividers
              // PaperProps={{ sx: { width: '80%' } }}
              sx={{
                margin: 0,
                padding: 0,
                //   display: 'flex',
                //   flexDirection: 'column',
                //   alignContent: 'space-around',
                //   flexWrap: 'wrap',
                //   alignItems: 'flex-end',
              }}
            >
              <Grid container sx={{ justifyContent: 'center' }}>
                <Grid item>
                  <QrReader
                    onResult={(result, error) => {
                      if (result) {
                        setDataQR(result?.text);
                        setStateLectorQR(true);
                      }
                    }}
                    containerStyle={{
                      marginTop: '0px',
                      paddingTop: '0px',
                      width: '450px',
                    }}
                  />
                </Grid>
                {stateLectorQR ? (
                  <Grid item>
                    <Typography
                      variant="body2"
                      sx={{ color: 'grey.700' }}
                      // color="text.secondary"
                    >
                      Puede consultar la trazabilidad de su café a través del siguiente enlace:{' '}
                      <a href={dataQR} className="my-batch">
                        {dataQR}
                      </a>
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
          </BootstrapDialog>
        </div>
      </div>
    </div>
  );
};

export default Section1;
