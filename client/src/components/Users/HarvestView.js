import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { v4 as uuid } from 'uuid';
import { useSelector } from 'react-redux';
import { walletAddressSelector } from '../../redux/appDataSlice';
import { getCoffe1ERC20 } from '../../logic/erc20';
import AskNextAction from '../../logic/GetNextAction/AskNextAction';
import HarvestForm from '../AddHarvest/HarvestForm';
import UpdateUserForm from '../UpdateUser/UpdateUserForm';

import AppWidgetCoffee from '../coffeeWidgets/AppWidgetCoffee';
import AppWidgetQR from '../coffeeWidgets/AppWidgetQR';
import TableUsers from '../Table/TableUsers';

const HarvestView = () => {
  const [batchNo, setBatchNo] = useState([]);
  const [nextActions, setNextActions] = useState([]);
  const walletAddress = useSelector(walletAddressSelector);

  useEffect(() => {
    const getBatch = async () => {
      const erc = getCoffe1ERC20();
      const events = await erc.queryFilter(erc.filters.DoneHarvesting(walletAddress, null));
      console.log('events: ', events);
      const batchTemp = events.map((event) => event.args.batchNo);
      const nextActionsTemp = batchTemp.map(async (item) => {
        const res = await AskNextAction({ batchNo: item });
        return res.data;
      });

      setBatchNo(batchTemp);
      setNextActions(await Promise.all(nextActionsTemp));
    };
    getBatch();
  }, []);

  return (
    <>
      <Grid item xs={12} sx={{ paddingTop: '0px', marginTop: '0px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetCoffee
              title="Perfil"
              image="/static/images/farmer-coffee.jpg"
              // image="https://www.3blmedia.com/sites/www.3blmedia.com/files/images/Nespresso_Zimbabwe_small.jpg"
              buttonText="ACTUALIZAR PERFIL"
              dialogTitle="Editar Datos de Perfil"
              Form={UpdateUserForm}
              altImg="Agricultor de café"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetCoffee
              title="Lotes de Café"
              image="/static/images/login.jpg"
              buttonText="AGREGAR COSECHA"
              dialogTitle="Agregar Datos de Cosecha"
              Form={HarvestForm}
              altImg="Lotes de café"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetQR
              title="Lotes de Café"
              innerButtonText="AGREGAR COSECHA"
              innerDialogText="Agregar Datos de Cosecha"
              altImg="Lector QR"
              image="/static/images/qr-code.png"
              // image="/static/images/lote1.jpg"
              buttonText="AGREGAR COSECHA CON CÓDIGO QR"
              dialogTitle="Agregar Cosecha de Lote de Café con Código QR"
              Form={HarvestForm}
            />
          </Grid>
        </Grid>
      </Grid>
      <TableUsers batchNo={batchNo} nextActions={nextActions} />
    </>
  );
};

export default HarvestView;
