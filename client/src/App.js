import { useEffect, useState, useLayoutEffect } from 'react';
import { useRoutes, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import ThemeProvider from './theme';
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import routes from './routes';

import useDetectProvider from './hooks/useDetectProvider';

import UserAdminListener from './logic/AddUserAdmin/UserAdminListener';
import UpdateUserListener from './logic/UpdateUser/UpdateUserListener';
import FarmListener from './logic/AddFarmDetails/FarmListener';
import HarvestListener from './logic/AddHarvest/HarvestListener';
import ProcessListener from './logic/AddProcess/ProcessListener';
import TasterListener from './logic/AddTaster/TasterListener';
import CoffeeSellListener from './logic/AddCoffeeSell/CoffeeSellListener';
import WarehouseListener from './logic/AddWarehouse/WarehouseListener';
import ShipPackerListener from './logic/AddShipPacker/ShipPackerListener';
import PackerListener from './logic/AddPacker/PackerListener';
import ShipRetailerListener from './logic/AddShipRetailer/ShipRetailerListener';
import RetailerListener from './logic/AddRetailer/RetailerListener';

import {
  setWalletAddress,
  setLoading,
  setUserData,
  setMessage,
  setIsOwer,
  userDataSelector,
  walletAddressSelector,
  loadingSelector,
} from './redux/appDataSlice';
import { setDirectionData, setLatitudeData, setLongitudeData, setLocReadyToAddData } from './redux/locationDataSlice';
import { setCoffeAddress1, setCoffeAddress2, setUserAddress } from './redux/contractsAddressSlice';
import { txListSelector, removeTx } from './redux/txSlice';

import getUserByAddress from './logic/GetUser';
import getOwner from './logic/GetOwner';

function App() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // UserInfo, Wallet and Owner

  const [walletAddress, error] = useDetectProvider(true);
  const [isOwner, setIsOwner] = useState(false);
  const userData = useSelector(userDataSelector);
  const loading = useSelector(loadingSelector);
  const walletAddressApp = useSelector(walletAddressSelector);
  const [searchParams] = useSearchParams();
  const batch = searchParams.get('batch');

  const getUserLocal = async (walletAddress) => {
    dispatch(setLoading(true));
    const user = await getUserByAddress(walletAddress);
    const owner = await getOwner();
    setIsOwner(owner === walletAddress);
    dispatch(setIsOwer(isOwner));

    if (user && user.message === null) {
      if (isOwner) {
        user.name = 'Administrador';
        user.role = [{ key: 'ADMIN', value: 'Admin User' }];
        user.email = 'coffeetrackec@.gmail.com';
      }
      if (user.role.length < 1 || user.name === '') {
        dispatch(setUserData(null));
        dispatch(setLoading(false));
        return;
      }
      dispatch(setUserData(user));
      dispatch(setMessage(''));
    } else dispatch(setMessage(user.message));

    dispatch(setLoading(false));
  };

  const setNullUserLocal = () => {
    dispatch(setIsOwer(false));
    dispatch(setUserData(null));
    dispatch(setMessage(''));
  };

  useLayoutEffect(() => {
    const userAddress = '0xB7afe31dD99bC184AEa39F3666B2188e63205aB1';
    const coffeAddress1 = '0x588774DEd56c4395A4b2115931e2B1379d29980d';
    const coffeAddress2 = '0x4213D059E4c1a9830BD41a7830082C9cEE95CcbA';

    window.userAddress = userAddress;
    window.coffeAddress1 = coffeAddress1;
    window.coffeAddress2 = coffeAddress2;

    dispatch(setUserAddress(userAddress));
    dispatch(setCoffeAddress1(coffeAddress1));
    dispatch(setCoffeAddress2(coffeAddress2));
  }, []);

  useEffect(() => {
    console.log('DISPACH ERROR ADDRESS');
    console.log(error);
    if (error) {
      // enqueueSnackbar(error, { variant: 'error' });
      // setNullUserLocal();
      dispatch(setLoading(false));
    }
  }, [error]);

  useEffect(() => {
    // console.log("DISPACH USER ADDRESS")
    dispatch(setWalletAddress(walletAddress));
  }, [walletAddress]);

  useLayoutEffect(() => {
    console.log('Wallet Address');
    console.log(walletAddressApp);
    if (walletAddressApp) getUserLocal(walletAddressApp);
    else setNullUserLocal();
  }, [walletAddressApp, isOwner]);

  // END //

  // Transactions Listeners in APP //
  const txList = useSelector(txListSelector);
  const txIsContain = (tx, type) => txList.some((item) => item.tx === tx && item.type === type);

  const { userRegistered } = UserAdminListener();
  useEffect(() => {
    if (userRegistered !== undefined && txIsContain(userRegistered.tx, 'UserUpdate')) {
      console.log('HERE');
      console.log('userregistered', userRegistered);
      enqueueSnackbar(`Usuario ${userRegistered.name} agregado correctamente`, { variant: 'success' });
      dispatch(removeTx({ tx: userRegistered.tx, type: 'UserUpdate' }));
    }
  }, [userRegistered, txList]);

  const { userUpdated } = UpdateUserListener();
  useEffect(() => {
    if (userUpdated !== undefined && txIsContain(userUpdated.tx, 'UserUpdate')) {
      console.log('userrupdated', userUpdated);
      console.log('MODIFIED');
      enqueueSnackbar(`Información de usuario ${userUpdated.name} modificada correctamente`, { variant: 'success' });
      dispatch(removeTx({ tx: userUpdated.tx, type: 'UserUpdate' }));
    }
  }, [userUpdated, txList]);

  const { farmRegistered } = FarmListener();
  useEffect(() => {
    if (farmRegistered !== undefined && txIsContain(farmRegistered.tx, 'SetFarmDetails')) {
      enqueueSnackbar(`Granja agregada y lote de café ${farmRegistered.batchNo} creado correctamente`, {
        variant: 'success',
      });
      dispatch(removeTx({ tx: farmRegistered.tx, type: 'SetFarmDetails' }));
      dispatch(setDirectionData(''));
      dispatch(setLatitudeData(''));
      dispatch(setLongitudeData(''));
      dispatch(setLocReadyToAddData(false));
    }
  }, [farmRegistered, txList]);

  const { harvestRegistered } = HarvestListener();
  useEffect(() => {
    if (harvestRegistered !== undefined && txIsContain(harvestRegistered.tx, 'DoneHarvesting')) {
      enqueueSnackbar(`Datos de cosecha del lote de café ${harvestRegistered.batchNo} agregados correctamente`, {
        variant: 'success',
      });
      dispatch(removeTx({ tx: harvestRegistered.tx, type: 'DoneHarvesting' }));
    }
  }, [harvestRegistered, txList]);

  const { processRegistered } = ProcessListener();
  useEffect(() => {
    if (processRegistered !== undefined && txIsContain(processRegistered.tx, 'DoneProcessing')) {
      enqueueSnackbar(`Datos de procesamiento del lote de café ${processRegistered.batchNo} agregados correctamente`, {
        variant: 'success',
      });
      dispatch(removeTx({ tx: processRegistered.tx, type: 'DoneProcessing' }));
    }
  }, [processRegistered, txList]);

  const { tasterRegistered } = TasterListener();
  useEffect(() => {
    if (tasterRegistered !== undefined && txIsContain(tasterRegistered.tx, 'DoneTasting')) {
      enqueueSnackbar(
        `Datos de catación correspondientes al lote de café ${tasterRegistered.batchNo} agregados correctamente`,
        {
          variant: 'success',
        }
      );
      dispatch(removeTx({ tx: tasterRegistered.tx, type: 'DoneTasting' }));
    }
  }, [tasterRegistered, txList]);

  const { coffeeSellRegistered } = CoffeeSellListener();
  useEffect(() => {
    if (coffeeSellRegistered !== undefined && txIsContain(coffeeSellRegistered.tx, 'DoneCoffeeSelling')) {
      enqueueSnackbar(
        `Datos de venta de café correspondientes al lote de café ${coffeeSellRegistered.batchNo} agregados correctamente`,
        {
          variant: 'success',
        }
      );
      dispatch(removeTx({ tx: coffeeSellRegistered.tx, type: 'DoneCoffeeSelling' }));
    }
  }, [coffeeSellRegistered, txList]);

  const { warehouseRegistered } = WarehouseListener();
  useEffect(() => {
    if (warehouseRegistered !== undefined && txIsContain(warehouseRegistered.tx, 'DoneWarehousing')) {
      enqueueSnackbar(`Datos de bodegaje del lote de café ${warehouseRegistered.batchNo} agregados correctamente`, {
        variant: 'success',
      });
      dispatch(removeTx({ tx: warehouseRegistered.tx, type: 'DoneWarehousing' }));
    }
  }, [warehouseRegistered, txList]);

  const { shipPackerRegistered } = ShipPackerListener();
  useEffect(() => {
    if (shipPackerRegistered !== undefined && txIsContain(shipPackerRegistered.tx, 'DoneShippingPacker')) {
      enqueueSnackbar(
        `Datos de transporte hacia empacador correspondientes al lote de café ${shipPackerRegistered.batchNo} agregados correctamente`,
        {
          variant: 'success',
        }
      );
      dispatch(removeTx({ tx: shipPackerRegistered.tx, type: 'DoneShippingPacker' }));
    }
  }, [shipPackerRegistered, txList]);

  const { packRegistered } = PackerListener();
  useEffect(() => {
    if (packRegistered !== undefined && txIsContain(packRegistered.tx, 'DonePackaging')) {
      enqueueSnackbar(
        `Datos de empacado correspondientes al lote de café ${packRegistered.batchNo} agregados correctamente`,
        {
          variant: 'success',
        }
      );
      dispatch(removeTx({ tx: packRegistered.tx, type: 'DonePackaging' }));
    }
  }, [packRegistered, txList]);

  const { shipRetailerRegistered } = ShipRetailerListener();
  useEffect(() => {
    if (shipRetailerRegistered !== undefined && txIsContain(shipRetailerRegistered.tx, 'DoneShippingRetailer')) {
      enqueueSnackbar(
        `Datos de transporte hacia el retailer correspondientes al lote de café ${shipRetailerRegistered.batchNo} agregados correctamente`,
        {
          variant: 'success',
        }
      );
      dispatch(removeTx({ tx: shipRetailerRegistered.tx, type: 'DoneShippingRetailer' }));
    }
  }, [shipRetailerRegistered, txList]);

  const { retailerRegistered } = RetailerListener();
  useEffect(() => {
    if (retailerRegistered !== undefined && txIsContain(retailerRegistered.tx, 'DoneRetailer')) {
      enqueueSnackbar(
        `Datos de comercialización en retailer correspondientes al lote de café ${retailerRegistered.batchNo} agregados correctamente`,
        {
          variant: 'success',
        }
      );
      dispatch(removeTx({ tx: retailerRegistered.tx, type: 'DoneRetailer' }));
    }
  }, [retailerRegistered, txList]);

  const getValidUserss = (userData) => {
    if (!userData || userData.role.length < 1) return null;
    return userData;
  };

  // END //

  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      {useRoutes(routes(loading, userData, isOwner, batch))}
    </ThemeProvider>
  );
}

export default App;
