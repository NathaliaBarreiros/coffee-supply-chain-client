import { useState, useEffect } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';

import { Button, Grid, Typography, Tooltip } from '@mui/material';
import PhaseCard from './PhaseCard';

import { getCoffeERC20 } from '../../logic/erc20';
import AskNextAction from '../../logic/GetNextAction/AskNextAction';
import AskHarvest from '../../logic/GetHavest/AskHarvest';
import AskProcess from '../../logic/GetProcess/AskProcess';
import AskGrainInspection from '../../logic/GetGrainInspection/AskGrainInspection';
import AskAgglom from '../../logic/GetAgglom/AskAgglom';

const TimeLine = ({ batchNoIn }) => {
  const [message, setMessage] = useState('Loading..');
  const [nextAction, setNextAction] = useState({});
  const [harversData, setHarversData] = useState({});
  const [processData, setProcessData] = useState({});
  const [inspectData, setInspectData] = useState({});
  const [agglomData, setAgglomData] = useState({});

  // https://docs.ethers.io/v5/concepts/events/
  // http://localhost:3000/tracking?batch=0x6B4964E34816C7FF32EA3787c2C615E583715197

  const parseFloat = (str, radix) => {
    const parts = str.split('.');
    if (parts.length > 1) {
      return parseInt(parts[0], radix) + parseInt(parts[1], radix) / radix ** parts[1].length;
    }
    return parseInt(parts[0], radix);
  };

  useEffect(() => {
    const de = async () => {
      const erc = getCoffeERC20();
      const events = await erc.queryFilter(erc.filters.SetFarmDetails(null));
      const batchTemp = events.map((event) => event.args.batchNo);

      /* const nextActionsTemp = batchTemp.map(async (item) => {
        const res = await AskNextAction({ batchNo: item });
        return res.data;
      });
      setBatchNo(batchTemp);
      setNextActions(await Promise.all(nextActionsTemp));
      */

      setNextAction(await AskNextAction({ batchNo: batchNoIn }));
      setHarversData(await AskHarvest({ batchNo: batchNoIn }));
      setProcessData(await AskProcess({ batchNo: batchNoIn }));
      setInspectData(await AskGrainInspection({ batchNo: batchNoIn }));
      setAgglomData(await AskAgglom({ batchNo: batchNoIn }));
      // console.log(nextAction)
      console.log(processData);
      if (nextAction && nextAction.data !== 'DONE') {
        setMessage('No Disponibles');
      }
    };
    de();
  }, []);

  function dateToYMD(dateIN) {
    // eslint-disable-next-line no-self-compare
    if (dateIN.getTime() !== dateIN.getTime()) {
      return 'No disponible';
    }
    const d = dateIN.getDate();
    const m = dateIN.getMonth() + 1; // Month from 0 to 11
    const y = dateIN.getFullYear();
    return `${d < 9 ? `0${d}` : d}-${m + 1 < 9 ? `0${m + 1}` : m + 1}-${y}`;
  }

  return (
    <Grid className="cursor-default relative">
      <p className="text-center font-bold text-xl">Tracking Coffe</p>
      <p className="text-center my-4 mb-10">
        Bach #: <span className="underline ">{batchNoIn}</span>
      </p>
      <div
        style={{ backgroundImage: 'url(static/icons/data_shapes.svg)' }}
        className="w-full h-full absolute opacity-10 none"
      >
        <br />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <PhaseCard
          title={'Cosecha'}
          className={'bg-green-100'}
          icon={'cosecha.png'}
          date={harversData.data ? dateToYMD(new Date(harversData.data.harvestDate)) : message}
        >
          <div className="flex flex-col text-sm">
            <div className="flex flex-col">
              <div className="mt-0 mb-1 font-semibold">Familia</div>
              {harversData.data ? harversData.data.coffeeFamily : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Tipo de Semilla</div>
              {harversData.data ? harversData.data.typeOfSeed : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fertilizantes</div>
              {harversData.data ? harversData.data.fertilizerUsed : message}
            </div>
          </div>
        </PhaseCard>

        <PhaseCard
          title={'Procesado'}
          className={'bg-red-100'}
          icon={'proccess.png'}
          date={processData.data ? dateToYMD(new Date(processData.data.millDate)) : message}
        >
          <div className="flex flex-col text-sm">
            <div className="bg-gray-100 rounded-lg">
              <img
                src={processData.data ? processData.data.roastImageHash : ''}
                alt="Imagen del café Tostado"
                className="h-48 mx-auto"
              />
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Dirección del Procesado</div>
              {processData.data ? processData.data.procAddress : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fecha de Secado</div>
              {processData.data ? dateToYMD(new Date(processData.data.millDate)) : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Tipo de Secado</div>
              {processData.data ? processData.data.typeOfDrying : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Fecha de Tostado</div>
              {processData.data ? dateToYMD(new Date(processData.data.roastDate)) : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Tipo de Tostado</div>
              {processData.data ? processData.data.typeOfRoast : message}
            </div>
            <div className="flex flex-col">
              <div className="mt-5 mb-1 font-semibold">Temp. de Tostado</div>
              {processData.data ? `${processData.data.roastTemp} grados` : message}
            </div>
            <div className="bg-gray-200 p-2  mt-4 rounded-lg hover:cursor-pointer hover:underline text-center">
              <a href="http://localhost:3000/dashboard?batch=0x6B4964E34816C7FF32EA3787c2C615E583715197">
                INGRESAR INFO
              </a>
            </div>
          </div>
        </PhaseCard>
      </div>

      <Timeline>
        <TimelineItem className="relative">
          <TimelineOppositeContent sx={{ m: 'auto 0' }} align="right" variant="body2">
            <Typography variant="h6" component="span">
              Cosecha
              {processData.data && (
                <span className="">
                  <br />
                  {processData.data.millDate}
                </span>
              )}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" className="h-16 w-16">
              <img alt="" src="static/icons/cosecha.png" className="h-auto w-auto p-1" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '16px', px: 2 }}>
            {harversData.data && (
              <div className="flex flex-row">
                <div className="flex flex-col w-8/12">
                  <Typography>
                    <span className="underline mr-2">Familia:</span>
                    {harversData.data.coffeeFamily}
                  </Typography>
                  <Typography>
                    <span className="underline mr-2">Fertilizantes:</span>
                    {harversData.data.coffeeFamily}
                  </Typography>
                </div>
                <div className="flex items-center justify-center w-full">
                  <div className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:underline">
                    Más Información
                    <a href="http://localhost:3000/dashboard?batch=0x6B4964E34816C7FF32EA3787c2C615E583715197">
                      INGRESAR INFO
                    </a>
                  </div>
                </div>
              </div>
            )}
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          {false && (
            <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
              10:00 am
            </TimelineOppositeContent>
          )}
          <TimelineSeparator>
            <TimelineDot variant="outlined" className="h-16 w-16">
              <img alt="" src="static/icons/proccess.png" className="h-auto w-auto p-1" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '16px', px: 2 }}>
            <Typography variant="h6" component="span">
              Procesados
            </Typography>
            {processData.data && (
              <div className="flex flex-row">
                <div className="flex flex-col w-8/12">
                  <Typography>
                    <span className="underline mr-2">Secado:</span>
                    {processData.data.typeOfDrying}
                  </Typography>
                  <Typography>
                    <span className="underline mr-2">Tueste:</span>
                    {processData.data.typeOfRoast}
                  </Typography>
                  {/* <Typography><span className='underline mr-2'>Precio:</span>{ parseFloat(processData.data.processorPrice._hex, 16)}</Typography>   */}
                </div>
                <div className="flex items-center justify-center w-full">
                  <div className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:underline">Más Información</div>
                </div>
              </div>
            )}
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant="outlined" className="h-16 w-16">
              <img alt="" src="static/icons/inspeccion.png" className="h-auto w-auto p-1" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '16px', px: 2 }}>
            <Typography variant="h6" component="span">
              Inspección del Grano
            </Typography>
            {inspectData.data && (
              <div className="flex flex-row">
                <div className="flex flex-col w-8/12">
                  {/* <Typography><span className='underline mr-2'>Precio:</span>{parseFloat(inspectData.data.grainPrice._hex, 16)}</Typography>
              <Typography><span className='underline mr-2'>Catacion:</span>{parseFloat(inspectData.data.tasteScore._hex, 16)}</Typography>   */}
                </div>
                <div className="flex items-center justify-center w-full">
                  <div className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:underline">Más Información</div>
                </div>
              </div>
            )}
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant="outlined" className="h-16 w-16">
              <img alt="" src="static/icons/aglomerado.png" className="h-auto w-auto p-1" />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent sx={{ py: '16px', px: 2 }}>
            <Typography variant="h6" component="span">
              Aglomerado
            </Typography>
            {agglomData.data && (
              <div className="flex flex-row">
                <div className="flex flex-col w-8/12">
                  <Typography>
                    <span className="underline mr-2">Direccion:</span>
                    {agglomData.data.agglomAddress}
                  </Typography>
                  {/* <Typography><span className='underline mr-2'>Precio:</span>{parseFloat(agglomData.data.storagePrice._hex, 16)}</Typography>   */}
                </div>
                <div className="flex items-center justify-center w-full">
                  <div className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:underline">Más Información</div>
                </div>
              </div>
            )}
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot variant="outlined" className="h-16 w-16">
              <img alt="" src="static/icons/transporte.png" className="h-auto w-auto p-1" />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent sx={{ py: '35px', px: 2 }}>
            <Typography variant="h6" component="span">
              Transporte a Empacadora
            </Typography>
            <Typography>Because this is the life you love!</Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot variant="outlined" className="h-16 w-16">
              <img alt="" src="static/icons/empacado.png" className="h-auto w-auto p-1" />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent sx={{ py: '35px', px: 2 }}>
            <Typography variant="h6" component="span">
              Empacado
            </Typography>
            <Typography>Because this is the life you love!</Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot variant="outlined" className="h-16 w-16">
              <img alt="" src="static/icons/transporte.png" className="h-auto w-auto p-1" />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent sx={{ py: '35px', px: 2 }}>
            <Typography variant="h6" component="span">
              Transporte a Retailer
            </Typography>
            <Typography>Because this is the life you love!</Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot variant="outlined" className="h-16 w-16">
              <img alt="" src="static/icons/retailer.png" className="h-auto w-auto p-1" />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent sx={{ py: '35px', px: 2 }}>
            <Typography variant="h6" component="span">
              Retailer
            </Typography>
            <Typography>Because this is the life you love!</Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot variant="outlined" className="h-16 w-16">
              <img alt="" src="static/icons/track.png" className="h-auto w-auto p-1" />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent sx={{ py: '35px', px: 2 }}>
            <Typography variant="h6" component="span">
              Tracking
            </Typography>
            <Typography>Because this is the life you love!</Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Grid>
  );
};

export default TimeLine;
