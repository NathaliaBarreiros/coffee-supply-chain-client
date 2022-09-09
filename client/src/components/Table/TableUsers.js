import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
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
import { saveSvgAsPng, svgAsPngUri } from 'save-svg-as-png';
import QRCode from 'qrcode.react';
import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';
import CloseIcon from '@mui/icons-material/Close';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import LinkIcon from '@mui/icons-material/Link';
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';

import { Link as RouterLink } from 'react-router-dom';

import TimelineProcess from './TimelineProcess';

function ShareSocialMedia(batch) {
  return (
    <Stack direction="row" spacing={1}>
      <IconButton
        aria-label="copy"
        color="quaternary"
        sixe="small"
        sx={{ p: 0, m: 0 }}
        onClick={() => {
          navigator.clipboard.writeText(batch);
        }}
      >
        <Tooltip size="small" placement="top" title="Copiar ID Lote" sx={{ m: 0, p: 0, fontSize: '1.3875rem' }}>
          <ContentCopyRoundedIcon sx={{ m: 0, p: 0, fontSize: '1.3875rem' }} />
        </Tooltip>
      </IconButton>
      <IconButton
        aria-label="copy URL"
        color="quaternary"
        sixe="small"
        sx={{ p: 0, m: 0 }}
        onClick={() => {
          navigator.clipboard.writeText(`${process.env.REACT_APP_HOST_URL}/tracking?batch=${batch}`);
        }}
      >
        <Tooltip size="small" placement="top" title="Copiar Url" sx={{ m: 0, p: 0, fontSize: '1.3875rem' }}>
          <LinkIcon sx={{ m: 0, p: 0, fontSize: '1.3875rem' }} />
        </Tooltip>
      </IconButton>
      <FacebookShareButton
        url={`${process.env.REACT_APP_HOST_URL}/tracking?batch=${batch}`}
        quote={'Modifica el estado de tu café 🥔☕️ accediendo al link: '}
        hashtag={'#coffeeTrackingAppEC'}
      >
        <FacebookIcon size={20} round />
      </FacebookShareButton>
      <WhatsappShareButton
        url={`${process.env.REACT_APP_HOST_URL}/tracking?batch=${batch}`}
        title={'Modifica el estado de tu café 🥔☕️👩‍🌾🧑‍🌾  accediendo al link: '}
        separator={''}
      >
        <WhatsappIcon size={20} round />
      </WhatsappShareButton>
      <EmailShareButton
        url={`${process.env.REACT_APP_HOST_URL}/tracking?batch=${batch}`}
        subject={'LINK COFFEE 🥔 ☕️ TRACKING APP EC 👩‍🌾 🧑‍🌾'}
        body={'Hola!, modifica el estado de tu café 🥔 ☕️ accediendo al link: '}
        separator={'  '}
      >
        <EmailIcon size={20} round />
      </EmailShareButton>
      <TelegramShareButton
        url={`${process.env.REACT_APP_HOST_URL}/tracking?batch=${batch}`}
        title={'Modifica el estado de tu café 🥔☕️👩‍🌾🧑‍🌾 accediendo al link'}
      >
        <TelegramIcon size={20} round />
      </TelegramShareButton>
      <TwitterShareButton
        url={`${process.env.REACT_APP_HOST_URL}/tracking?batch=${batch}`}
        title={'Modifica el estado de tu café 🥔☕️👩‍🌾🧑‍🌾  accediendo al link'}
        hashtags={['#coffeeTrackingAppEC', '#EC', 'coffee']}
      >
        <TwitterIcon size={20} round />
      </TwitterShareButton>
    </Stack>
  );
}

const defColor = (myState) => {
  return (
    <Stack>
      <StyledChip
        label={myState}
        sx={{ color: 'green' }}
        // icon={icon}
        // avatar={
        //   <Avatar
        //     alt="Natacha"
        //     src="/static/illustrations/retailer.svg
        // "
        //   />
        // }
        // avartar={<Avatar alt={myState} src="/static/illustrations/transport2.png" />}
        // sx={{ backgroundColor: { color } }}
      />
    </Stack>
  );
};

const StyledChip = styled(Chip)(({ theme }) => ({
  [`&.${chipClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.primary.dark,
  },
  [`&.${chipClasses.colorSecondary}`]: {
    backgroundColor: theme.palette.tertiary.dark,
  },
}));

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.grey[900],
    // .grey[900],
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.grey[900],
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.main2,
    color: theme.palette.common.white,
    fontSize: '14px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
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

const TableUsers = ({ batchNo, nextActions }) => {
  const [indexSelect, setIndexSelect] = useState(0);
  const [qrImage, setQrImage] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openZoom, setOpenZoom] = useState(false);
  const [openLook, setOpenLook] = useState(false);

  const assignState = (action) => {
    let arr = [];

    if (action === 'FARMER') {
      arr = ['REGISTRO DE GRANJA', 'COSECHA'];
    } else if (action === 'PROCESSOR') {
      arr = ['COSECHA', 'PROCESADO'];
    } else if (action === 'TASTER') {
      arr = ['PROCESADO', 'CATACIÓN'];
    } else if (action === 'SELLER') {
      arr = ['CATACIÓN', 'VENTA DE GRANO'];
    } else if (action === 'WAREHOUSE') {
      arr = ['VENTA DE GRANO', 'BODEGAJE'];
    } else if (action === 'SHIPPER_PACKER') {
      arr = ['BODEGAJE', 'TRANSPORTE A EMPACADOR'];
    } else if (action === 'PACKER') {
      arr = ['TRANSPORTE A EMPACADOR', 'EMPACADO'];
    } else if (action === 'SHIPPER_RETAILER') {
      arr = ['EMPACADO', 'TRANSPORTE A RETAILER'];
    } else if (action === 'RETAILER') {
      arr = ['TRANSPORTE A RETAILER', 'RETAILER'];
    } else if (action === 'DONE') {
      arr = ['COMERCIALIZACIÓN EN RETAILER', 'TERMINADO'];
    }
    return arr;
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, batchNo.length - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpenZoom = (index) => {
    setIndexSelect(index);
    setOpenZoom(true);
  };
  const handleCloseZoom = () => {
    setOpenZoom(false);
  };

  const handleClickOpenLook = (index) => {
    setIndexSelect(index);
    setOpenLook(true);
  };
  const handleCloseLook = () => {
    setOpenLook(false);
  };

  const getBacthList = (batchNo, rowsPerPage, page) => {
    return batchNo.length > 0 && rowsPerPage > 0
      ? batchNo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : batchNo;
  };

  const getNextActionsList = (nextActions, rowsPerPage, page) => {
    return nextActions.length > 0 && rowsPerPage > 0
      ? nextActions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : nextActions;
  };

  useEffect(() => {
    console.log('nextACTIONS:', nextActions);
  }, []);
  return (
    <Grid item xs={12} sx={{ marginTop: '50px' }}>
      <TableContainer sx={{ maxHeight: '1000px', boxShadow: 5, borderRadius: 1 }} component={Paper}>
        <Table sx={{ minWidth: '900px' }} aria-label="customized table" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">ID LOTE</StyledTableCell>
              <StyledTableCell align="center">CÓDIGO QR</StyledTableCell>
              <StyledTableCell align="center">PROCESO ANTERIOR</StyledTableCell>
              <StyledTableCell align="center">PROCESO ACTUAL</StyledTableCell>
              <StyledTableCell align="center">VER TODO</StyledTableCell>
              {/* <StyledTableCell align="center">COSECHA</StyledTableCell>
              <StyledTableCell align="center">PROCESADO</StyledTableCell>
              <StyledTableCell align="center">INSPECCIÓN DEL GRANO</StyledTableCell>
              <StyledTableCell align="center">AGLOMERADO</StyledTableCell>
              <StyledTableCell align="center">TRANSPORTE A EMPACADORA</StyledTableCell>
              <StyledTableCell align="center">EMPACADO</StyledTableCell>
              <StyledTableCell align="center">TRANSPORTE A RETAILER</StyledTableCell>
              <StyledTableCell align="center">RETAILER</StyledTableCell> */}
              <StyledTableCell align="center">TRACKING</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getBacthList(batchNo, rowsPerPage, page).map((batch, index) => (
              <StyledTableRow key={index} sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }}>
                <StyledTableCell
                  align="center"
                  sx={{
                    // position: 'sticky',
                    left: 0,
                    zIndex: 100,
                    // backgroundColor: 'grey.200',
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
                      {/* <Tooltip title="Copiar" placement="bottom">
                        <div
                          className="mr-10 text-black hover:cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(batch);
                          }}
                          aria-hidden="true"
                        > */}
                      <Typography variant="body2">
                        {batch.slice(0, 8).concat('...').concat(batch.slice(-8))}{' '}
                      </Typography>
                      {/* </div>
                      </Tooltip> */}
                    </BootstrapTooltip>
                  </Stack>
                </StyledTableCell>
                <StyledTableCell align="center" spacing={2}>
                  <Grid item xs={2}>
                    <Stack direction="column" spacing={1}>
                      <Grid container justifyItems="center" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }}>
                          <QRCode
                            bgColor="#FFFFFF"
                            id={batch}
                            value={`${process.env.REACT_APP_HOST_URL}/tracking?batch=${batch}`}
                            size="50"
                            includeMargin
                            renderAs="svg"
                          />
                        </Grid>

                        <Grid container item xs={12}>
                          <Grid item xs={6} sx={{ transform: 'translate(6%, -45%)' }}>
                            <IconButton
                              aria-label="descargar"
                              color="primary"
                              sixe="small"
                              sx={{ p: 0, m: 0 }}
                              onClick={() => {
                                saveSvgAsPng(document.getElementById(`${batch}`), `QR_lote_${batch}.png`, {
                                  scale: 60,
                                });
                              }}
                            >
                              <Tooltip
                                size="small"
                                placement="top"
                                title="Descargar"
                                sx={{ m: 0, p: 0, fontSize: '1.3875rem' }}
                              >
                                <DownloadForOfflineRoundedIcon />
                              </Tooltip>
                            </IconButton>
                          </Grid>
                          <Grid item xs={6} sx={{ transform: 'translate(-6%, -250%)' }}>
                            <IconButton
                              aria-label="zoom"
                              color="secondary"
                              sixe="small"
                              sx={{ p: 0, m: 0 }}
                              onClick={() => {
                                svgAsPngUri(document.getElementById(batch), {
                                  scale: 100,
                                }).then((uri) => setQrImage(uri));
                                handleClickOpenZoom(index);
                              }}
                            >
                              <Tooltip
                                size="small"
                                placement="top"
                                title="Zoom"
                                sx={{ m: 0, p: 0, fontSize: '1.3875rem' }}
                              >
                                <ExpandCircleDownRoundedIcon sx={{ transform: 'rotate(225deg)' }} />
                              </Tooltip>
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Grid>
                </StyledTableCell>
                {assignState(getNextActionsList(nextActions, rowsPerPage, page)[index]).map((myState) => (
                  <StyledTableCell key={uuid()} align="center">
                    {defColor(myState)}
                    {/* {myState} */}
                  </StyledTableCell>
                ))}
                {/* {nextActions.map((nextAction, index) => ( */}

                <StyledTableCell align="center">
                  <Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                    {/* <RouterLink to={`/tracking?batch=${batch}`}> */}
                    <IconButton
                      aria-label="tracking-batch"
                      sx={{ color: 'grey[800]' }}
                      size="small"
                      onClick={() => {
                        handleClickOpenLook(index);
                      }}
                    >
                      <RemoveRedEyeRoundedIcon />
                    </IconButton>
                    {/* </RouterLink> */}
                  </Stack>
                </StyledTableCell>

                {/* ))} */}

                <StyledTableCell align="center" key={index}>
                  <Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RouterLink to={`/tracking?batch=${batch}`}>
                      <IconButton aria-label="tracking-batch" sx={{ color: 'grey[800]' }} size="small">
                        <SendRoundedIcon />
                      </IconButton>
                    </RouterLink>
                  </Stack>
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {emptyRows > 0 && (
              <StyledTableRow style={{ height: 110 * emptyRows, backgroundColor: 'white', opacity: '8%' }}>
                <StyledTableCell colSpan={3} />
              </StyledTableRow>
            )}
            <BootstrapDialog aria-labelledby="customized-dialog-title" open={openLook}>
              <BootstrapDialogTitle
                sx={{
                  textAlign: 'center',
                }}
                id="customized-dialog-title"
                onClose={handleCloseLook}
              >
                Línea de tiempo de los procesos del lote {getBacthList(batchNo, rowsPerPage, page)[indexSelect]}
              </BootstrapDialogTitle>
              <DialogContent dividers>
                <TimelineProcess nextAction={getNextActionsList(nextActions, rowsPerPage, page)[indexSelect]} />
              </DialogContent>
            </BootstrapDialog>

            <BootstrapDialog
              PaperProps={{ sx: { width: '40%' } }}
              aria-labelledby="customized-dialog-title"
              open={openZoom}
            >
              <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseZoom}>
                <p className="break-all !important text-green-500">
                  Código QR del lote #<br />
                  {getBacthList(batchNo, rowsPerPage, page)[indexSelect]}
                </p>
              </BootstrapDialogTitle>
              <DialogContent
                // PaperProps={{ sx: { width: '80%' } }}
                sx={{ margin: 0, padding: 0 }}
              >
                <img className="w-48 h-auto" src={qrImage} alt="QR Code" />
                {/*
                    svgAsPngUri(document.getElementById("diagram"), options).then(uri => )
                  */}
              </DialogContent>
            </BootstrapDialog>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
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
                  color: 'secondary',
                }}
                nextIconButtonProps={{ color: 'secondary' }}
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
  );
};

export default TableUsers;

// https://coffeetrack.vercel.app/tracking?batch=${batch}
