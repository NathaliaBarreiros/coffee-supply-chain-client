import React, { useState, useEffect } from 'react';
import PropTypes, { element } from 'prop-types';
import {
  Grid,
  Container,
  Typography,
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
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
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import { chipClasses } from '@mui/material/Chip';
import { tooltipClasses } from '@mui/material/Tooltip';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import {
  EmailShareButton,
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
  TwitterIcon,
  TelegramIcon,
} from 'react-share';
import { v4 as uuid } from 'uuid';
import { saveSvgAsPng } from 'save-svg-as-png';
import QRCode from 'qrcode.react';
import { QrReader } from 'react-qr-reader';
import { GetApp } from '@mui/icons-material';
import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import DoNotDisturbAltRoundedIcon from '@mui/icons-material/DoNotDisturbAltRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import RunningWithErrorsRoundedIcon from '@mui/icons-material/RunningWithErrorsRounded';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { walletAddressSelector, userDataSelector } from '../../redux/appDataSlice';
import { getCoffe1ERC20 } from '../../logic/erc20';
import AskNextAction from '../../logic/GetNextAction/AskNextAction';
import HarvestForm from '../AddHarvest/HarvestForm';
import UpdateUserForm from '../UpdateUser/UpdateUserForm';
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

function ShareSocialMedia(batch) {
  return (
    <Stack direction="row" spacing={1}>
      <FacebookShareButton
        url={`${process.env.HOST_URL}/tracking?batch=${batch}`}
        quote={'Modifica el estado de tu café 🥔☕️ accediendo al link: '}
        hashtag={'#coffeeTrackingAppEC'}
      >
        <FacebookIcon size={20} round />
      </FacebookShareButton>

      <WhatsappShareButton
        url={`${process.env.HOST_URL}/tracking?batch=${batch}`}
        title={'Modifica el estado de tu café 🥔☕️👩‍🌾🧑‍🌾  accediendo al link: '}
        separator={''}
      >
        <WhatsappIcon size={20} round />
      </WhatsappShareButton>

      <EmailShareButton
        url={`${process.env.HOST_URL}/tracking?batch=${batch}`}
        subject={'LINK COFFEE 🥔 ☕️ TRACKING APP EC 👩‍🌾 🧑‍🌾'}
        body={'Hola!, modifica el estado de tu café 🥔 ☕️ accediendo al link: '}
        separator={'  '}
      >
        <EmailIcon size={20} round />
      </EmailShareButton>

      <TelegramShareButton
        url={`${process.env.HOST_URL}/tracking?batch=${batch}`}
        title={'Modifica el estado de tu café 🥔☕️👩‍🌾🧑‍🌾 accediendo al link'}
      >
        <TelegramIcon size={20} round />
      </TelegramShareButton>

      <TwitterShareButton
        url={`${process.env.HOST_URL}/tracking?batch=${batch}`}
        title={'Modifica el estado de tu café 🥔☕️👩‍🌾🧑‍🌾  accediendo al link'}
        hashtags={['#coffeeTrackingAppEC', '#EC', 'coffee']}
      >
        <TwitterIcon size={20} round />
      </TwitterShareButton>
    </Stack>
  );
}

const defColor = (myState) => {
  let color = '';
  let icon = '';
  if (myState === 'En Proceso') {
    color = 'primary';
    icon = <RunningWithErrorsRoundedIcon />;
  } else if (myState === 'No Disponible') {
    color = 'warning';
    icon = <DoNotDisturbAltRoundedIcon />;
  } else if (myState === 'Completado') {
    color = 'secondary';
    icon = <CheckRoundedIcon />;
  }
  return (
    <Stack>
      <StyledChip label={myState} color={color} icon={icon} />
    </Stack>
  );
};

const StyledChip = styled(Chip)(({ theme }) => ({
  [`&.${chipClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.fifth.dark,
  },
  [`&.${chipClasses.colorSecondary}`]: {
    backgroundColor: theme.palette.success.dark,
  },
}));

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.grey[900],
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.grey[900],
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

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

const TableHarvest = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [batchNo, setBatchNo] = useState([]);
  const [nextActions, setNextActions] = useState([]);
  const [openUser, setOpenUser] = useState(false);
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  // const [searchBatchParams, setSearchBatchParams] = useSearchParams();

  const assignState = (action) => {
    let arr = [];
    if (action === 'AGRICULTOR/PRODUCTOR') {
      arr = [
        'En Proceso',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
      ];
    } else if (action === 'PROCESADOR') {
      arr = [
        'Completado',
        'En Proceso',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
      ];
    } else if (action === 'INSPECTOR DE GRANO/AGRICULTOR') {
      arr = [
        'Completado',
        'Completado',
        'En Proceso',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
      ];
    } else if (action === 'AGLOMERADOR') {
      arr = [
        'Completado',
        'Completado',
        'Completado',
        'En Proceso',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
      ];
    } else if (action === 'TRANSPORTISTA A EMPACADORA') {
      arr = [
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'En Proceso',
        'No Disponible',
        'No Disponible',
        'No Disponible',
      ];
    } else if (action === 'EMPACADORA') {
      arr = [
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'En Proceso',
        'No Disponible',
        'No Disponible',
      ];
    } else if (action === 'TRANSPORTISTA A RETAILER') {
      arr = [
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'En Proceso',
        'No Disponible',
      ];
    } else if (action === 'RETAILER') {
      arr = [
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'En Proceso',
      ];
    } else if (action === 'DONE') {
      arr = [
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
      ];
    }
    return arr;
  };

  const handleClickOpenUser = () => {
    setOpenUser(true);
  };
  const handleCloseUser = () => {
    setOpenUser(false);
  };
  const handleClickOpenBatch = () => {
    setOpenBatch(true);
  };
  const handleCloseBatch = () => {
    setOpenBatch(false);
    dispatch(setMessageExternal(''));
    dispatch(setReadyToAddExternal(false));
    dispatch(setBatchNoExternal(''));
    dispatch(setUrlExternal(''));
    dispatch(setNextActionExternal(''));
  };
  const handleClickOpenLectorQR = () => {
    setOpenLectorQR(true);
  };
  const handleCloseLectorQR = () => {
    setDataQR('');
    setStateLectorQR(false);
    setOpenLectorQR(false);
    dispatch(setMessageExternal(''));
    dispatch(setReadyToAddExternal(false));
    dispatch(setBatchNoExternal(''));
    dispatch(setUrlExternal(''));
    dispatch(setNextActionExternal(''));
  };

  const handleAddQR = () => {
    console.log('redux 0:', urlQR);
    console.log('redux 1: ', batchNoQR);
    console.log('redux 2: ', nextAction);
    console.log('redux 3: ', messageQR);
    console.log('redux 4: ', readyToAdd);
    enqueueSnackbar(messageQR);
    if (readyToAdd) {
      setOpenBatch(true);
      setDataQR('');
      setStateLectorQR(false);
      setBatchNew('');
      setNextActionNew('');
    }
  };

  const getNextAction = async (batchNoUrl) => {
    let str;
    let res;

    dispatch(
      setMessageExternal(`La url ${batchNoUrl} no contiene un número de lote correcto. Ingrese un código QR válido.`)
    );

    if (batchNoUrl.includes('?batch=0x')) {
      str = batchNoUrl.split('?batch=');
      // const found = batchNo.find((el) => el === str[1]);
      res = await AskNextAction({ batchNo: str[1] });
      if (str[1].length === 42) {
        console.log('res.data', res.data);
        console.log('usedata.role', userData.role);
        if (res.data === userData.role) {
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
          // enqueueSnackbar(messageQR, { variant: 'success' });
          console.log('HOOA');
        }
      }
    }
    // enqueueSnackbar(messageQR,  { variant: 'error' });
    messageShow();
  };

  const messageShow = () => {
    if (readyToAdd) {
      enqueueSnackbar(messageQR, { variant: 'success' });
    } else {
      enqueueSnackbar(messageQR, { variant: 'error' });
    }
    // enqueueSnackbar(messageQR);
    console.log('redux 0:', urlQR);
    console.log('redux 1: ', batchNoQR);
    console.log('redux 2: ', nextAction);
    console.log('redux 3: ', messageQR);
    console.log('redux 4: ', readyToAdd);
  };

  useEffect(() => {
    const getBatch = async () => {
      const erc = getCoffe1ERC20(); // aqui posible error del listener
      const events = await erc.queryFilter(erc.filters.DoneHarvesting(walletAddress, null));
      const batchTemp = events.map((event) => event.args.batchNo);
      const nextActionsTemp = batchTemp.map(async (item) => {
        const res = await AskNextAction({ batchNo: item });
        return res.data;
      });

      setBatchNo(batchTemp);
      setNextActions(await Promise.all(nextActionsTemp));
    };
    // console.log('user: ', userData.role); // tengo el rol del user actual
    getBatch();
  }, []);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, batchNo.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Grid item xs={12} sx={{ paddingTop: '0px', marginTop: '0px' }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 5, sm: 5, md: 30 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                minWidth: 275,
              }}
            >
              <CardHeader title="Perfil" />
              <CardMedia component="img" height="194" alt="Agricultor de café" image="/static/images/farmer2.jpg" />

              <CardActions>
                <Button size="small" onClick={handleClickOpenUser}>
                  ACTUALIZAR PERFIL
                </Button>
                <BootstrapDialog aria-labelledby="customized-dialog-title" open={openUser}>
                  <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseUser}>
                    Editar Datos de Perfil
                  </BootstrapDialogTitle>
                  <DialogContent dividers>
                    <UpdateUserForm />
                  </DialogContent>
                </BootstrapDialog>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                minWidth: 275,
              }}
            >
              <CardHeader title="Lotes de Café" />
              <CardMedia component="img" height="194" alt="Lotes de café" image="/static/images/lote1.jpg" />
              <CardActions>
                <Button size="small" onClick={handleClickOpenBatch}>
                  AGREGAR COSECHA
                </Button>
                <BootstrapDialog aria-labelledby="customized-dialog-title" open={openBatch}>
                  <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseBatch}>
                    Agregar Datos de Cosecha
                  </BootstrapDialogTitle>
                  <DialogContent dividers>
                    <HarvestForm />
                  </DialogContent>
                </BootstrapDialog>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                minWidth: 275,
              }}
            >
              <CardHeader title="Lector QR" />
              <CardMedia component="img" height="194" alt="Lector QR" image="/static/images/lote1.jpg" />
              <CardActions>
                <Button size="small" onClick={handleClickOpenLectorQR}>
                  AGREGAR COSECHA CON CÓDIGO QR
                </Button>
                <BootstrapDialog aria-labelledby="customized-dialog-title" open={openLectorQR}>
                  <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseLectorQR}>
                    Agregar Cosecha de Lote de Café con Código QR
                  </BootstrapDialogTitle>
                  <DialogContent dividers>
                    <Grid container sx={{ justifyContent: 'center' }}>
                      <Grid item>
                        <QrReader
                          onResult={(result, error) => {
                            if (result) {
                              setDataQR(result?.text);
                              setStateLectorQR(true);
                              getNextAction(result?.text);
                              // messageShow();
                            }
                            // if (error) {
                            //   setStateLectorQR(false);
                            //   // console.info(error);
                            // }
                          }}
                          style={{ width: '100%' }}
                          containerStyle={{
                            marginTop: '0px',
                            paddingTop: '0px',
                            width: '500px',
                          }}
                        />{' '}
                      </Grid>
                      {stateLectorQR ? (
                        <Grid item>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: 14 }}
                            // color="text.secondary"
                          >
                            Su código es:{' '}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: 14 }} color="text.secondary">
                            {dataQR}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: 14 }} color="text.secondary">
                            {'hola'}
                            <br />
                            {urlQR}
                            <br />
                            {batchNoQR}
                            <br />
                            {nextAction}
                            <br />
                            {messageQR}
                            <br />
                            {readyToAdd ? 'true' : 'false'}
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
                      AGREGAR COSECHA
                    </Button>
                    <BootstrapDialog aria-labelledby="customized-dialog-title" open={openBatch}>
                      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseBatch}>
                        Agregar Datos de Cosecha
                      </BootstrapDialogTitle>
                      <DialogContent dividers>
                        <HarvestForm batchValue={batchNoQR} />
                      </DialogContent>
                    </BootstrapDialog>
                  </DialogActions>
                </BootstrapDialog>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                minWidth: 275,
              }}
            >
              <CardHeader title="Resumen" />

              <CardContent>
                <Stack direction="row" spacing={2}>
                  <Typography color="text.secondary" variant="subtitle2">
                    Lotes de café modificados:
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {batchNo.length}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Typography color="text.secondary" variant="subtitle2">
                    Lotes de café por modificar:
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {batchNew}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: '50px' }}>
        <TableContainer sx={{ maxHeight: '1000px', boxShadow: 8, borderRadius: 1 }} component={Paper}>
          <Table sx={{ minWidth: '2100px' }} aria-label="customized table" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">ID Lote</StyledTableCell>
                <StyledTableCell align="center">CÓDIGO QR</StyledTableCell>
                <StyledTableCell align="center">COSECHA</StyledTableCell>
                <StyledTableCell align="center">PROCESADO</StyledTableCell>
                <StyledTableCell align="center">INSPECCIÓN DEL GRANO</StyledTableCell>
                <StyledTableCell align="center">AGLOMERADO</StyledTableCell>
                <StyledTableCell align="center">TRANSPORTE A EMPACADORA</StyledTableCell>
                <StyledTableCell align="center">EMPACADO</StyledTableCell>
                <StyledTableCell align="center">TRANSPORTE A RETAILER</StyledTableCell>
                <StyledTableCell align="center">RETAILER</StyledTableCell>
                <StyledTableCell align="center">TRACKING</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(batchNo.length > 0 && rowsPerPage > 0
                ? batchNo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : batchNo
              ).map((batch, index) => (
                <StyledTableRow key={index} sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }}>
                  <StyledTableCell
                    align="center"
                    sx={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 100,

                      backgroundColor: 'primary.lighter',
                    }}
                  >
                    <Stack direction="row" spacing={2} m={2}>
                      <BootstrapTooltip
                        title={ShareSocialMedia(batch)}
                        placement="top"
                        arrow
                        enterDelay={300}
                        leaveDelay={200}
                      >
                        <Typography variant="body2">{batch} </Typography>
                      </BootstrapTooltip>
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell align="center" spacing={2}>
                    <Grid item xs={2}>
                      <Stack direction="column" spacing={1}>
                        <QRCode
                          bgColor="#FFFFFF"
                          id={batch}
                          value={`${process.env.HOST_URL}/tracking?batch=${batch}`}
                          size="100"
                          includeMargin
                          renderAs="svg"
                        />
                        <div>
                          <Chip
                            onClick={() => {
                              saveSvgAsPng(document.getElementById(`${batch}`), `QR_lote_${batch}.png`, {
                                scale: 60,
                              });
                            }}
                            style={{ marginLeft: 2 }}
                            color="primary"
                            size="small"
                            label="descargar"
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                            icon={<DownloadForOfflineRoundedIcon />}
                          />
                        </div>
                      </Stack>
                    </Grid>
                  </StyledTableCell>
                  {assignState(nextActions[index]).map((myState) => (
                    <StyledTableCell key={uuid()} align="center">
                      {defColor(myState)}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell align="center">
                    <Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                      <RouterLink to={`/tracking?batch=${batch}`}>
                        <IconButton aria-label="tracking-batch" sx={{ color: 'grey[800]' }} size="small">
                          <RemoveRedEyeRoundedIcon />
                        </IconButton>
                      </RouterLink>
                    </Stack>
                  </StyledTableCell>
                </StyledTableRow>
              ))}

              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 166 * emptyRows }}>
                  <StyledTableCell colSpan={3} />
                </StyledTableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[2, 5, 10, 25]}
                  count={batchNo.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                  }}
                  labelDisplayedRows={({ page }) => {
                    return `Page: ${page + 1}`;
                  }}
                  backIconButtonProps={{
                    color: 'quaternary',
                  }}
                  nextIconButtonProps={{ color: 'quaternary' }}
                  showFirstButton
                  showLastButton
                  labelRowsPerPage={<span>Rows:</span>}
                  sx={{
                    '.MuiTablePagination-toolbar': {
                      backgroundColor: 'divider',
                    },
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-input': {
                      fontWeight: 'bold',
                      color: 'grey',
                    },
                  }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default TableHarvest;
