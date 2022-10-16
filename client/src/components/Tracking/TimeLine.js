/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-comment-textnodes */
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import moment from 'moment';
import { Button, Typography, useTheme, Tooltip } from '@mui/material';
import PhaseCard from './PhaseCard';

import AskNextActionInfura from '../../logic/GetNextAction/AskNextActionInfura';
import AskFarm from '../../logic/GetFarmDetails/AskFarm';
import AskHarvest from '../../logic/GetHavest/AskHarvest';
import AskProcess from '../../logic/GetProcess/AskProcess';
import AskTasting from '../../logic/GetTasting/AskTasting';
import AskCoffeeSeller from '../../logic/GetCoffeeSeller/AskCoffeeSeller';
import AskWarehouse from '../../logic/GetWarehouse/AskWarehouse';
import AskShipPacker from '../../logic/GetShipPacker/AskShipPacker';
import AskPacker from '../../logic/GetPacker/AskPacker';
import AskShipRetailer from '../../logic/GetShipRetailer/AskShipRetailer';
import AskRetailer from '../../logic/GetRetailer/AskRetailer';
import {
  getFarmTx,
  getHarvestTx,
  getProcessTx,
  getTasteTx,
  getSellTx,
  getWarehouseTx,
  getShipPackerTx,
  getPackerTx,
  getShipRetailerTx,
  getRetailerTx,
} from '../../logic/getBatchTx';

import getUserInfura from '../../logic/GetUserInfura';
import getOwnerInfura from '../../logic/GetOwnerInfura';

import MapsTracking from '../Maps/MapsTracking';

import '../../App.css';

const TimeLine = ({ batchNo }) => {
  const theme = useTheme();
  const [batchNoIn, setBatchNoIn] = useState(batchNo);
  const navigate = useNavigate();
  const [message, setMessage] = useState('Loading..');
  const [txMessage, setTxMessage] = useState('Loading..');
  let nextAction = {};
  const [statusList, setStatusList] = useState([
    'No Disponible',
    'No Disponible',
    'No Disponible',
    'No Disponible',
    'No Disponible',
    'No Disponible',
    'No Disponible',
    'No Disponible',
    'No Disponible',
    'No Disponible',
  ]);
  const [farmData, setFarmData] = useState({});
  const [harverstData, setHarverstData] = useState({});
  const [processData, setProcessData] = useState({});
  const [tasteData, setTasteData] = useState({});
  const [sellData, setSellData] = useState({});
  const [warehouseData, setWarehouseData] = useState({});
  const [shipPackerData, setShipPackerData] = useState({});
  const [packerData, setPackerData] = useState({});
  const [shipRetailerData, setShipRetailerData] = useState({});
  const [retailerData, setRetailerData] = useState({});

  const [farmTx, setFarmTx] = useState(null);
  const [harvestTx, setHarvestTx] = useState(null);
  const [processTx, setProcessTx] = useState(null);
  const [tasteTx, setTasteTx] = useState(null);
  const [sellTx, setSellTx] = useState(null);
  const [warehouseTx, setWarehouseTx] = useState(null);
  const [shipPackerTx, setShipPackerTx] = useState(null);
  const [packerTx, setPackerTx] = useState(null);
  const [shipRetailerTx, setShipRetailerTx] = useState(null);
  const [retailerTx, setRetailerTx] = useState(null);

  const [userAdmin, setUserAdmin] = useState(null);
  const [userHarvest, setUserHarvest] = useState({});
  const [userProcess, setUserProcess] = useState({});
  const [userTaste, setUserTaste] = useState({});
  const [userSell, setUserSell] = useState({});
  const [userWarehouse, setUserWarehouse] = useState({});
  const [userShipPacker, setUserShipPacker] = useState({});
  const [userPacker, setUserPacker] = useState({});
  const [userShipRetailer, setUserShipRetailer] = useState({});
  const [userRetailer, setUserRetailer] = useState({});

  const parsePrice = (price) => (price ? `$ ${parseFloat(price)}` : 'No disponible');

  const assignState = (action) => {
    let arr = [];
    if (action === 'FARMER') {
      arr = [
        'Completado',
        'En Proceso',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
      ];
    } else if (action === 'PROCESSOR') {
      arr = [
        'Completado',
        'Completado',
        'En Proceso',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
      ];
    } else if (action === 'TASTER') {
      arr = [
        'Completado',
        'Completado',
        'Completado',
        'En Proceso',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
      ];
    } else if (action === 'SELLER') {
      arr = [
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'En Proceso',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
      ];
    } else if (action === 'WAREHOUSE') {
      arr = [
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'En Proceso',
        'No Disponible',
        'No Disponible',
        'No Disponible',
        'No Disponible',
      ];
    } else if (action === 'SHIPPER_PACKER') {
      arr = [
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'En Proceso',
        'No Disponible',
        'No Disponible',
        'No Disponible',
      ];
    } else if (action === 'PACKER') {
      arr = [
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'Completado',
        'En Proceso',
        'No Disponible',
        'No Disponible',
      ];
    } else if (action === 'SHIPPER_RETAILER') {
      arr = [
        'Completado',
        'Completado',
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
        'Completado',
        'Completado',
      ];
    }
    return arr;
  };

  useEffect(() => {
    const getPaticipants = async () => {
      const nextActionLocal = await AskNextActionInfura({ batchNo: batchNoIn });

      if (nextActionLocal.data === null) {
        setTxMessage('No disponible');
        // navigate(`/dashboard?batch=${batchNoIn}`);
        return;
      }
      const statusListLocal = assignState(nextActionLocal.data);
      console.log('statusListLocal');
      console.log(statusListLocal);

      if (statusListLocal[0] === 'Completado') {
        const farmTx = await getFarmTx(batchNoIn);
        setFarmTx(farmTx);
        setUserAdmin(await getOwnerInfura());
      }

      if (statusListLocal[1] === 'Completado') {
        const harvestTx = await getHarvestTx(batchNoIn);
        setHarvestTx(harvestTx);
        setUserHarvest(await getUserInfura(harvestTx ? harvestTx[0] : null));
      }

      if (statusListLocal[2] === 'Completado') {
        const processTx = await getProcessTx(batchNoIn);
        setProcessTx(processTx);
        setUserProcess(await getUserInfura(processTx ? processTx[0] : null));
      }

      if (statusListLocal[3] === 'Completado') {
        const tasteTx = await getTasteTx(batchNoIn);
        setTasteTx(tasteTx);
        setUserTaste(await getUserInfura(tasteTx ? tasteTx[0] : null));
      }

      if (statusListLocal[4] === 'Completado') {
        const sellTx = await getSellTx(batchNoIn);
        setSellTx(sellTx);
        setUserSell(await getUserInfura(sellTx ? sellTx[0] : null));
      }

      if (statusListLocal[5] === 'Completado') {
        const warehouseTx = await getWarehouseTx(batchNoIn);
        setWarehouseTx(warehouseTx);
        setUserWarehouse(await getUserInfura(warehouseTx ? warehouseTx[0] : null));
      }

      if (statusListLocal[6] === 'Completado') {
        const shipPackerTx = await getShipPackerTx(batchNoIn);
        setShipPackerTx(shipPackerTx);
        setUserShipPacker(await getUserInfura(shipPackerTx ? shipPackerTx[0] : null));
      }

      if (statusListLocal[7] === 'Completado') {
        const packerTx = await getPackerTx(batchNoIn);
        setPackerTx(packerTx);
        setUserPacker(await getUserInfura(packerTx ? packerTx[0] : null));
      }

      if (statusListLocal[8] === 'Completado') {
        const shipRetailerTx = await getShipRetailerTx(batchNoIn);
        setShipRetailerTx(shipRetailerTx);
        setUserShipRetailer(await getUserInfura(shipRetailerTx ? shipRetailerTx[0] : null));
      }

      if (statusListLocal[9] === 'Completado') {
        const retailerTx = await getRetailerTx(batchNoIn);
        setRetailerTx(retailerTx);
        setUserRetailer(await getUserInfura(retailerTx ? retailerTx[0] : null));
      }

      setTxMessage('No disponible');
    };

    getPaticipants();
  }, []);

  useEffect(() => {
    const getDataInfura = async () => {
      nextAction = await AskNextActionInfura({ batchNo: batchNoIn });

      if (nextAction.data === null) {
        setTxMessage('No disponible');
        setMessage('No disponible');
        // navigate(`/dashboard?batch=${batchNoIn}`);
        return;
      }

      const statusListLocal = assignState(nextAction.data);

      if (statusListLocal[0] === 'Completado') setFarmData(await AskFarm({ batchNo: batchNoIn }));
      if (statusListLocal[1] === 'Completado') setHarverstData(await AskHarvest({ batchNo: batchNoIn }));
      if (statusListLocal[2] === 'Completado') setProcessData(await AskProcess({ batchNo: batchNoIn }));
      if (statusListLocal[3] === 'Completado') setTasteData(await AskTasting({ batchNo: batchNoIn }));
      if (statusListLocal[4] === 'Completado') setSellData(await AskCoffeeSeller({ batchNo: batchNoIn }));
      if (statusListLocal[5] === 'Completado') setWarehouseData(await AskWarehouse({ batchNo: batchNoIn }));
      if (statusListLocal[6] === 'Completado') setShipPackerData(await AskShipPacker({ batchNo: batchNoIn }));
      if (statusListLocal[7] === 'Completado') setPackerData(await AskPacker({ batchNo: batchNoIn }));
      if (statusListLocal[8] === 'Completado') setShipRetailerData(await AskShipRetailer({ batchNo: batchNoIn }));
      if (statusListLocal[9] === 'Completado') setRetailerData(await AskRetailer({ batchNo: batchNoIn }));
      setMessage('No disponible');
      setStatusList(statusListLocal);
    };

    getDataInfura();
    console.log('farm: ', farmData);
    console.log('proc: ', processData);
    console.log('warehouse: ', warehouseData);
    console.log('packer: ', packerData);
    console.log('retailer: ', retailerData);
  }, []);

  function unixToYMD(unixData) {
    const ds = moment.unix(unixData).format('DD-MM-YYYY');
    const ts = moment.unix(unixData).format('HH:mm:ss');

    return `${ds} || ${ts}`;
  }

  function dateToYMD2(dateIN) {
    // eslint-disable-next-line no-self-compare
    if (dateIN.getTime() !== dateIN.getTime()) {
      return 'No disponible';
    }
    const ds = moment(dateIN).format('DD-MM-YYYY');
    const ts = moment(dateIN).format('HH:mm:ss');
    return `${ds} || ${ts}`;
  }

  return (
    <div className="cursor-default max-w-5xl mx-auto mt-10">
      <p className="text-center mt-20 font-bold text-xl">Tracking del Café</p>
      {batchNoIn && (
        <Tooltip title="Copiar" placement="bottom">
          <div
            className="text-center my-4 mb-8 break-all hover:cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(batchNoIn);
            }}
            aria-hidden="true"
          >
            <span className="font-semibold">ID Lote:</span> {batchNoIn}
          </div>
        </Tooltip>
      )}

      <div
        style={{ backgroundImage: 'url(static/icons/data_shapes.svg)' }}
        className="w-full h-full absolute opacity-10 none"
      >
        <br />
      </div>

      <div className="grid py-5 gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center w-full">
        <PhaseCard
          title={'Datos de la Granja'}
          className={'bg-green-100'}
          icon={'farm1.png'}
          date={farmTx ? unixToYMD(farmTx[2]) : txMessage}
          url={farmTx ? `https://goerli.etherscan.io/tx/${farmTx[1]}` : null}
          status={statusList[0]}
        >
          <div className="flex flex-col text-sm">
            <div className="flex flex-col">
              <div className="mt-1 mb-1 font-semibold ">Información del editor: </div>
              {userAdmin ? (
                <>
                  <div>Administrador</div>
                  <a
                    href={`https://goerli.etherscan.io/address/${userAdmin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-link"
                  >
                    {String(userAdmin).slice(0, 8).concat('...').concat(String(userAdmin).slice(-8))}
                  </a>
                  <a target="_blank" href="mailto:coffeetrackec@gmail.com" rel="noreferrer" className="mail-track">
                    coffeetrackec@gmail.com
                  </a>
                </>
              ) : (
                <p>{txMessage}</p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Nombre:</div>

              {farmData.data ? farmData.data.farmName : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Dirección:</div>
              {farmData.data ? farmData.data.farmAddress : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Geolocalización [lat, lng]:</div>
              {farmData.data
                ? `[${parseFloat(farmData.data.latitude).toFixed(6)}, ${parseFloat(farmData.data.longitude).toFixed(
                    6
                  )}]`
                : message}
            </div>
            {/* <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Geolocalización: Longitud</div>
              {farmData.data ? `${parseFloat(farmData.data.longitude).toFixed(6)}` : message}
            </div> */}
            {statusList[0] === 'En Proceso' && (
              <div className="absolute bottom-0 left-0 w-full flex flex-col justify-center">
                <Button
                  className="font-bold track-btn bg-emerald-600 text-white mb-4  mx-4"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    navigate(`/dashboard?batch=${batchNoIn}`);
                  }}
                >
                  Registrar
                </Button>
              </div>
            )}
          </div>
        </PhaseCard>

        <PhaseCard
          title={'Cosecha'}
          className={'bg-green-100'}
          icon={'cosecha.png'}
          date={harvestTx ? unixToYMD(harvestTx[2]) : txMessage}
          url={harvestTx ? `https://goerli.etherscan.io/tx/${harvestTx[1]}` : null}
          status={statusList[1]}
        >
          <div className="flex flex-col text-sm">
            <div className="flex flex-col">
              <div className="mt-1 mb-1 font-semibold ">Información del editor:</div>
              {harvestTx ? (
                <>
                  <div>{userHarvest.name ? `${userHarvest.name}` : message}</div>
                  <a
                    href={`https://goerli.etherscan.io/address/${harvestTx[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-link"
                  >
                    {String(harvestTx[0]).slice(0, 8).concat('...').concat(String(harvestTx[0]).slice(-8))}
                  </a>
                  <a target="_blank" href={`mailto:${userHarvest.email}`} rel="noreferrer" className="mail-track ">
                    {userHarvest.email ? userHarvest.email : message}
                  </a>
                </>
              ) : (
                <p>{txMessage}</p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Proveedor de semilla:</div>
              {harverstData.data ? harverstData.data.seedSupplier : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Tipo de semilla:</div>
              {harverstData.data ? harverstData.data.typeOfSeed : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Familia del café:</div>
              {harverstData.data ? harverstData.data.coffeeFamily : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fertilizantes:</div>
              {harverstData.data ? harverstData.data.fertilizerUsed : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fecha y hora de cosecha:</div>
              {harverstData.data ? dateToYMD2(new Date(harverstData.data.harvestDate)) : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Humedad del grano cosechado:</div>
              {harverstData.data ? `${parseFloat(harverstData.data.humidityPercentage)} [%]` : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Peso del lote cosechado:</div>
              {harverstData.data ? `${parseFloat(harverstData.data.batchWeight)} [kg]` : message}
            </div>
            {statusList[1] === 'En Proceso' && (
              <div className="absolute bottom-0 left-0 w-full flex flex-col justify-center">
                <Button
                  className="font-bold track-btn bg-emerald-600 text-white mb-4  mx-4"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    navigate(`/dashboard?batch=${batchNoIn}`);
                  }}
                >
                  Registrar
                </Button>
              </div>
            )}
          </div>
        </PhaseCard>

        <PhaseCard
          title={'Procesado'}
          className={'bg-red-100'}
          icon={'proccess.png'}
          date={processTx ? unixToYMD(processTx[2]) : txMessage}
          url={processTx ? `https://goerli.etherscan.io/tx/${processTx[1]}` : null}
          status={statusList[2]}
        >
          <div className="flex flex-col text-sm">
            <div className="bg-gray-100 rounded-lg">
              <img
                src={processData.data ? processData.data.roastImageHash : 'static/images/no-imagen.gif'}
                alt="Imagen del Café Tostado"
                className="h-48 mx-auto"
              />
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold ">Información del editor:</div>
              {processTx ? (
                <>
                  <div>{userProcess.name && processTx[0] ? `${userProcess.name}` : message}</div>
                  <a
                    href={`https://goerli.etherscan.io/address/${processTx[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-link"
                  >
                    {String(processTx[0]).slice(0, 8).concat('...').concat(String(processTx[0]).slice(-8))}
                  </a>

                  <a target="_blank" href={`mailto:${userProcess.email}`} rel="noreferrer" className="mail-track ">
                    {userProcess.email ? userProcess.email : message}
                  </a>
                </>
              ) : (
                <p>{txMessage}</p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Dirección:</div>
              {processData.data ? processData.data.addressLatLngProcessor[0] : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Geolocalización [lat, lng]:</div>
              {processData.data
                ? `[${parseFloat(processData.data.addressLatLngProcessor[1]).toFixed(6)}, ${parseFloat(
                    processData.data.addressLatLngProcessor[2]
                  ).toFixed(6)}]`
                : message}
            </div>
            {/* <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Geolocalización: Longitud</div>
              {processData.data ? `${parseFloat(processData.data.addressLatLngProcessor[2]).toFixed(6)}` : message}
            </div> */}
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Tipo de secado:</div>
              {processData.data ? processData.data.typeOfDrying : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Humedad del grano secado:</div>
              {processData.data ? `${parseFloat(processData.data.humidityAfterDrying)} [%]` : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Temperatura de tostado:</div>
              {processData.data ? `${parseFloat(processData.data.tempTypeRoast[0])} [ºC]` : message}
            </div>{' '}
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Tipo de tostado:</div>
              {processData.data ? processData.data.tempTypeRoast[1] : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fecha y hora de tostado:</div>
              {processData.data ? dateToYMD2(new Date(processData.data.roastMillDates[0])) : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fecha y hora de molienda:</div>
              {processData.data ? dateToYMD2(new Date(processData.data.roastMillDates[1])) : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Precio por kilo de café procesado:</div>
              {processData.data ? `${parsePrice(processData.data.processorPricePerKilo)}` : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Peso del lote después del procesado:</div>
              {processData.data ? `${parseFloat(processData.data.processBatchWeight)} [kg]` : message}
            </div>
            {statusList[2] === 'En Proceso' && (
              <div className="absolute bottom-0 left-0 w-full flex flex-col justify-center">
                <Button
                  className="font-bold track-btn bg-emerald-600 text-white mb-4  mx-4"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    navigate(`/dashboard?batch=${batchNoIn}`);
                  }}
                >
                  Registrar
                </Button>
              </div>
            )}
          </div>
        </PhaseCard>

        <PhaseCard
          title={'Catación'}
          className={'bg-blue-200'}
          icon={'inspeccion.png'}
          date={tasteTx ? unixToYMD(tasteTx[2]) : message}
          url={tasteTx ? `https://goerli.etherscan.io/tx/${tasteTx[1]}` : null}
          status={statusList[3]}
        >
          <div className="flex flex-col text-sm">
            <div className="flex flex-col">
              <div className="mt-1 mb-1 font-semibold ">Información del editor: </div>
              {tasteTx ? (
                <>
                  <div>{userTaste.name && tasteTx[0] ? `${userTaste.name}` : message}</div>
                  <a
                    href={`https://goerli.etherscan.io/address/${tasteTx[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-link"
                  >
                    {String(tasteTx[0]).slice(0, 8).concat('...').concat(String(tasteTx[0]).slice(-8))}
                  </a>
                  <a target="_blank" href={`mailto:${userTaste.email}`} rel="noreferrer" className="mail-track">
                    {userTaste.email ? userTaste.email : message}
                  </a>
                </>
              ) : (
                <p>{txMessage}</p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Puntuación de catación [/100]:</div>
              {tasteData.data ? `${parseFloat(tasteData.data.tastingScore)}` : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Precio del servicio:</div>
              {tasteData.data ? `${parsePrice(tasteData.data.tastingServicePrice)}` : message}
            </div>
            {statusList[3] === 'En Proceso' && (
              <div className="absolute bottom-0 left-0 w-full flex flex-col justify-center">
                <Button
                  className="font-bold track-btn bg-emerald-600 text-white mb-4  mx-4"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    navigate(`/dashboard?batch=${batchNoIn}`);
                  }}
                >
                  Registrar
                </Button>
              </div>
            )}
          </div>
        </PhaseCard>

        <PhaseCard
          title={'Venta del Grano'}
          className={'bg-blue-200'}
          icon={'sell1.png'}
          date={sellTx ? unixToYMD(sellTx[2]) : txMessage}
          url={sellTx ? `https://goerli.etherscan.io/tx/${sellTx[1]}` : null}
          status={statusList[4]}
        >
          <div className="flex flex-col text-sm">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div className="mt-1 mb-1 font-semibold ">Información del editor: </div>
                {sellTx ? (
                  <>
                    <div>{userSell.name && sellTx[0] ? `${userSell.name}` : message}</div>
                    <a
                      href={`https://goerli.etherscan.io/address/${sellTx[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="user-link"
                    >
                      {String(sellTx[0]).slice(0, 8).concat('...').concat(String(sellTx[0]).slice(-8))}
                    </a>
                    <a target="_blank" href={`mailto:${userSell.email}`} rel="noreferrer" className="mail-track ">
                      {userSell.email ? userSell.email : message}
                    </a>
                  </>
                ) : (
                  <p>{txMessage}</p>
                )}
              </div>
              <div className="flex flex-col">
                <div className="mt-5 mb-1 font-semibold">Peso del lote de café vendido:</div>
                {sellData.data ? `${parseFloat(sellData.data.coffeeSellingBatchWeight)}  [kg]` : message}
              </div>
              <div className="flex flex-col">
                <div className="mt-5 mb-1 font-semibold">Precio de venta por kilo de café:</div>
                {sellData.data ? `${parsePrice(sellData.data.beanPricePerKilo)}` : message}
              </div>
            </div>
            {statusList[4] === 'En Proceso' && (
              <div className="absolute bottom-0 left-0 w-full flex flex-col justify-center">
                <Button
                  className="font-bold track-btn bg-emerald-600 text-white mb-4  mx-4"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    navigate(`/dashboard?batch=${batchNoIn}`);
                  }}
                >
                  Registrar
                </Button>
              </div>
            )}
          </div>
        </PhaseCard>

        <PhaseCard
          title={'Bodega'}
          className={'bg-blue-200'}
          icon={'aglomerado.png'}
          date={warehouseTx ? unixToYMD(warehouseTx[2]) : txMessage}
          url={warehouseTx ? `https://goerli.etherscan.io/tx/${warehouseTx[1]}` : null}
          status={statusList[5]}
        >
          <div className="flex flex-col text-sm">
            <div className="flex flex-col">
              <div className="mt-1 mb-1 font-semibold ">Información del editor: </div>
              {warehouseTx ? (
                <>
                  <div>{userWarehouse.name && warehouseTx[0] ? `${userWarehouse.name}` : message}</div>
                  <a
                    href={`https://goerli.etherscan.io/address/${warehouseTx[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-link"
                  >
                    {String(warehouseTx[0]).slice(0, 8).concat('...').concat(String(warehouseTx[0]).slice(-8))}
                  </a>
                  <a target="_blank" href={`mailto:${userWarehouse.email}`} rel="noreferrer" className="mail-track ">
                    {userWarehouse.email ? userWarehouse.email : message}
                  </a>
                </>
              ) : (
                <p>{txMessage}</p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Dirección:</div>
              {warehouseData.data ? warehouseData.data.warehouseAddress : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Geolocalización [lat, lng]:</div>
              {warehouseData.data
                ? `[${parseFloat(warehouseData.data.latLngWarehouse[0]).toFixed(6)}, ${parseFloat(
                    warehouseData.data.latLngWarehouse[1]
                  ).toFixed(6)}]`
                : message}
            </div>
            {/* <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Geolocalización: Longitud</div>
              {warehouseData.data ? `${parseFloat(warehouseData.data.latLngWarehouse[1]).toFixed(6)}` : message}
            </div> */}
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fecha y hora de ingreso:</div>
              {warehouseData.data ? dateToYMD2(new Date(warehouseData.data.warehouseArrivalDate)) : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Tiempo de almacenamiento del lote de café:</div>
              {warehouseData.data ? `${warehouseData.data.storageTime} [días]` : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Peso del lote ingresado:</div>
              {warehouseData.data ? `${parseFloat(sellData.data.coffeeSellingBatchWeight)}  [kg]` : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Precio por kilo de café por día almacenado:</div>
              {warehouseData.data ? `${parsePrice(warehouseData.data.storagePricePerKiloPerTime)}` : message}
            </div>
            {statusList[5] === 'En Proceso' && (
              <div className="absolute bottom-0 left-0 w-full flex flex-col justify-center">
                <Button
                  className="font-bold track-btn bg-emerald-600 text-white mb-4  mx-4"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    navigate(`/dashboard?batch=${batchNoIn}`);
                  }}
                >
                  Registrar
                </Button>
              </div>
            )}
          </div>
        </PhaseCard>

        <PhaseCard
          title={'Transporte hacia Empacador'}
          className={'bg-blue-200'}
          icon={'transporte.png'}
          date={shipPackerTx ? unixToYMD(shipPackerTx[2]) : txMessage}
          url={shipPackerTx ? `https://goerli.etherscan.io/tx/${shipPackerTx[1]}` : null}
          status={statusList[6]}
        >
          <div className="flex flex-col text-sm">
            <div className="flex flex-col">
              <div className="mt-1 mb-1 font-semibold ">Información del editor: </div>
              {shipPackerTx ? (
                <>
                  <div>{userShipPacker.name && shipPackerTx[0] ? `${userShipPacker.name}` : message}</div>
                  <a
                    href={`https://goerli.etherscan.io/address/${shipPackerTx[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-link"
                  >
                    {String(shipPackerTx[0]).slice(0, 8).concat('...').concat(String(shipPackerTx[0]).slice(-8))}
                  </a>
                  <a target="_blank" href={`mailto:${userShipPacker.email}`} rel="noreferrer" className="mail-track">
                    {userShipPacker.email ? userShipPacker.email : message}
                  </a>
                </>
              ) : (
                <p>{txMessage}</p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fecha y hora de salida:</div>
              {shipPackerData.data ? dateToYMD2(new Date(shipPackerData.data.warehousePickupDate)) : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Tipo de transporte:</div>
              {shipPackerData.data ? shipPackerData.data.toPackerTransportType : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Precio de transporte:</div>
              {shipPackerData.data ? `${parsePrice(shipPackerData.data.toPackerShippingPrice)}` : message}
            </div>
            {statusList[6] === 'En Proceso' && (
              <div className="absolute bottom-0 left-0 w-full flex flex-col justify-center">
                <Button
                  className="font-bold track-btn bg-emerald-600 text-white mb-4  mx-4"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    navigate(`/dashboard?batch=${batchNoIn}`);
                  }}
                >
                  Registrar
                </Button>
              </div>
            )}
            {/* <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Destino</div>
              {shipPackerData.data ? 'Empacadora' : message}
            </div> */}
          </div>
        </PhaseCard>

        <PhaseCard
          title={'Empacado'}
          className={'bg-blue-200'}
          icon={'empacado.png'}
          date={packerTx ? unixToYMD(packerTx[2]) : txMessage}
          url={packerTx ? `https://goerli.etherscan.io/tx/${packerTx[1]}` : null}
          status={statusList[7]}
        >
          <div className="flex flex-col text-sm">
            <div className="flex flex-col">
              <div className="mt-1 mb-1 font-semibold ">Información del editor: </div>
              {packerTx ? (
                <>
                  <div>{userPacker.name && packerTx[0] ? `${userPacker.name}` : message}</div>
                  <a
                    href={`https://goerli.etherscan.io/address/${packerTx[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-link"
                  >
                    {String(packerTx[0]).slice(0, 8).concat('...').concat(String(packerTx[0]).slice(-8))}
                  </a>
                  <a target="_blank" href={`mailto:${userPacker.email}`} rel="noreferrer" className="mail-track">
                    {userPacker.email ? userPacker.email : message}
                  </a>
                </>
              ) : (
                <p>{txMessage}</p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Dirección:</div>
              {packerData.data ? packerData.data.packerAddress : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Geolocalización [lat, lng]:</div>
              {packerData.data
                ? `[${parseFloat(packerData.data.latLngPacker[0]).toFixed(6)}, ${parseFloat(
                    packerData.data.latLngPacker[1]
                  ).toFixed(6)}]`
                : message}
            </div>
            {/* <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Geolocalización: Longitud</div>
              {packerData.data ? `${parseFloat(packerData.data.latLngPacker[1]).toFixed(6)}` : message}
            </div> */}
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fecha y hora de llegada:</div>
              {packerData.data ? dateToYMD2(new Date(packerData.data.packerArrivalDate)) : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fecha y hora de empacado:</div>
              {packerData.data ? dateToYMD2(new Date(packerData.data.packingDate)) : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Precio por kilo de café empacado:</div>
              {packerData.data ? `${parsePrice(packerData.data.packingPricePerKilo)}` : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Peso del lote ingresado:</div>
              {packerData.data ? `${parseFloat(sellData.data.coffeeSellingBatchWeight)}  [kg]` : message}
            </div>
            {statusList[7] === 'En Proceso' && (
              <div className="absolute bottom-0 left-0 w-full flex flex-col justify-center">
                <Button
                  className="font-bold track-btn bg-emerald-600 text-white mb-4  mx-4"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    navigate(`/dashboard?batch=${batchNoIn}`);
                  }}
                >
                  Registrar
                </Button>
              </div>
            )}
          </div>
        </PhaseCard>

        <PhaseCard
          title={'Transporte hacia Retailer'}
          className={'bg-blue-200'}
          icon={'transporte.png'}
          date={shipRetailerTx ? unixToYMD(shipRetailerTx[2]) : txMessage}
          url={shipRetailerTx ? `https://goerli.etherscan.io/tx/${shipRetailerTx[1]}` : null}
          status={statusList[8]}
        >
          <div className="flex flex-col text-sm">
            <div className="flex flex-col">
              <div className="mt-1 mb-1 font-semibold ">Información del editor: </div>
              {shipRetailerTx ? (
                <>
                  <div>{userShipRetailer.name && shipRetailerTx[0] ? `${userShipRetailer.name}` : message}</div>
                  <a
                    href={`https://goerli.etherscan.io/address/${shipRetailerTx[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-link"
                  >
                    {String(shipRetailerTx[0]).slice(0, 8).concat('...').concat(String(shipRetailerTx[0]).slice(-8))}
                  </a>
                  <a target="_blank" href={`mailto:${userShipRetailer.email}`} rel="noreferrer" className="mail-track ">
                    {userShipRetailer.email ? userShipRetailer.email : message}
                  </a>
                </>
              ) : (
                <p>{txMessage}</p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fecha y hora de salida:</div>
              {shipRetailerData.data ? dateToYMD2(new Date(shipRetailerData.data.packerPickupDate)) : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Tipo de transporte:</div>
              {shipRetailerData.data ? shipRetailerData.data.toRetailerTransportType : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Precio de transporte:</div>
              {shipRetailerData.data ? `${parsePrice(shipRetailerData.data.toReatilerShippingPrice)}` : message}
            </div>
            {/* <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Destino</div>
              {shipRetailerData.data ? 'Retailer' : message}
            </div> */}
            {statusList[8] === 'En Proceso' && (
              <div className="absolute bottom-0 left-0 w-full flex flex-col justify-center">
                <Button
                  className="font-bold track-btn bg-emerald-600 text-white mb-4  mx-4"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    navigate(`/dashboard?batch=${batchNoIn}`);
                  }}
                >
                  Registrar
                </Button>
              </div>
            )}
          </div>
        </PhaseCard>

        <PhaseCard
          title={'Retailer'}
          className={'bg-blue-200'}
          icon={'retailer.png'}
          date={retailerTx ? unixToYMD(retailerTx[2]) : txMessage}
          url={retailerTx ? `https://goerli.etherscan.io/tx/${retailerTx[1]}` : null}
          status={statusList[9]}
        >
          <div className="flex flex-col text-sm">
            <div className="flex flex-col">
              <div className="mt-1 mb-1 font-semibold ">Información del editor:</div>
              {retailerTx ? (
                <>
                  <div>{userRetailer.name && retailerTx[0] ? `${userRetailer.name}` : message}</div>
                  <a
                    href={`https://goerli.etherscan.io/address/${retailerTx[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-link"
                  >
                    {String(retailerTx[0]).slice(0, 8).concat('...').concat(String(retailerTx[0]).slice(-8))}
                  </a>
                  <a target="_blank" href={`mailto:${userRetailer.email}`} rel="noreferrer" className="mail-track">
                    {userRetailer.email ? userRetailer.email : message}
                  </a>
                </>
              ) : (
                <p>{txMessage}</p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Almacén:</div>
              {retailerData.data ? retailerData.data.warehouseRetailerName : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Dirección del almacén:</div>
              {retailerData.data ? retailerData.data.addressLatLngWarehouseRetailer[0] : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Geolocalización [lat, lng]: </div>
              {retailerData.data
                ? `[${parseFloat(retailerData.data.addressLatLngWarehouseRetailer[1]).toFixed(6)}, ${parseFloat(
                    retailerData.data.addressLatLngWarehouseRetailer[2]
                  ).toFixed(6)}]`
                : message}
            </div>
            {/* <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Geolocalización: Longitud</div>
              {retailerData.data
                ? `${parseFloat(retailerData.data.addressLatLngWarehouseRetailer[2]).toFixed(6)}`
                : message}
            </div> */}
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fecha y hora de llegada al almacén:</div>
              {retailerData.data ? dateToYMD2(new Date(retailerData.data.warehouseSalepointArrivalDate[0])) : message}
            </div>

            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Punto de venta:</div>
              {retailerData.data ? retailerData.data.salepointRetailerName : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Dirección del punto de venta:</div>
              {retailerData.data ? retailerData.data.addressLatLngSalepointRetailer[0] : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Geolocalización [lat, lng]:</div>
              {retailerData.data
                ? `[${parseFloat(retailerData.data.addressLatLngSalepointRetailer[1]).toFixed(6)}, ${parseFloat(
                    retailerData.data.addressLatLngSalepointRetailer[2]
                  ).toFixed(6)}]`
                : message}
            </div>
            {/* <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Geolocalización: Longitud</div>
              {retailerData.data
                ? `${parseFloat(retailerData.data.addressLatLngSalepointRetailer[2]).toFixed(6)}`
                : message}
            </div> */}
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fecha y hora de llegada al punto de venta:</div>
              {retailerData.data ? dateToYMD2(new Date(retailerData.data.warehouseSalepointArrivalDate[1])) : message}
            </div>

            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Tipo de transporte:</div>
              {retailerData.data ? retailerData.data.toSalepointTransportType : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Precio de transporte:</div>
              {retailerData.data ? `${parsePrice(retailerData.data.toSalepointShippingPrice)}` : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Peso del lote ingresado:</div>
              {retailerData.data ? `${parseFloat(sellData.data.coffeeSellingBatchWeight)}  [kg]` : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Precio por kilo de café comercializado en retailer:</div>
              {retailerData.data ? `${parsePrice(retailerData.data.retailerPricePerKilo)}` : message}
            </div>
            {statusList[9] === 'En Proceso' && (
              <div className="absolute bottom-0 left-0 w-full flex flex-col justify-center">
                <Button
                  className="font-bold track-btn bg-emerald-600 text-white mb-4  mx-4"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    navigate(`/dashboard?batch=${batchNoIn}`);
                  }}
                >
                  Registrar
                </Button>
              </div>
            )}
          </div>
        </PhaseCard>
      </div>

      <div className="map-view">
        {farmData.data && processData.data && warehouseData.data && packerData.data && retailerData.data && (
          <Typography
            variant="subtitle1"
            sx={{
              color: (theme) => theme.palette.secondary.main2,
              marginBottom: '10px',
              fontSize: '18px',
              textTransform: 'uppercase',
            }}
          >
            Conoce los Puntos de Intervención de tu Café
          </Typography>
        )}
        {farmData.data && processData.data && warehouseData.data && packerData.data && retailerData.data && (
          <MapsTracking
            farmAddress={[farmData.data[4], farmData.data[2], farmData.data[3]]}
            processAddress={processData.data[0]}
            warehouseAddress={[warehouseData.data[0], warehouseData.data[1][0], warehouseData.data[1][1]]}
            packerAddress={[packerData.data[0], packerData.data[1][0], packerData.data[1][1]]}
            warehouseRetAddress={retailerData.data[3]}
            salepointRetAddress={retailerData.data[4]}
          />
        )}
      </div>
    </div>
  );
};

export default TimeLine;
