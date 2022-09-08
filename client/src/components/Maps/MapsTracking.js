import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';
import { Typography, IconButton, Grid, Box, Stack, Container, Button, useTheme } from '@mui/material';
import { getGeocode, getLatLng } from 'use-places-autocomplete';
import '@reach/combobox/styles.css';

import '../../App.css';

const google = window.google;

const libraries = ['places'];

const mapContainerStyle = {
  height: '100%',
  width: '100%',
};

const options = {
  mapId: 'c43de04e5c01e2fc',
  scaleControl: true,
  scrollwheel: true,
  mapTypeControl: false,
  keyboardShortcuts: false,
  zoomControl: true,
};

const getCoordinates = async (val) => {
  const results = await getGeocode({ address: val });
  const { lat, lng } = await getLatLng(results[0]);
  console.log('resultss');
  console.log(results);
  console.log(lat);

  return { lat, lng };
};

const MapsTracking = ({
  farmAddress,
  processAddress,
  warehouseAddress,
  packerAddress,
  warehouseRetAddress,
  salepointRetAddress,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const theme = useTheme();
  const [farmDir, setFarmDir] = useState('');
  const [processorDir, setProcessorDir] = useState('');
  const [warehouseDir, setWarehouseDir] = useState('');
  const [packerDir, setPackerDir] = useState('');
  const [warehouseRetDir, setWarehouseRetDir] = useState('');
  const [salepointRetDir, setSalepointRetDir] = useState('');

  const [farmMarker, setFarmMarker] = useState(null);
  const [processorMarker, setProcessorMarker] = useState(null);
  const [warehouseMarker, setWarehouseMarker] = useState(null);
  const [packerMarker, setPackerMarker] = useState(null);
  const [warehouseRetMarker, setWarehouseRetMarker] = useState(null);
  const [salepointRetMarker, setSalepointRetMarker] = useState(null);

  const [farmProcRoute, setFarmProcRoute] = useState();
  const [procWarehouseRoute, setProcWarehouseRoute] = useState();
  const [warehousePackerRoute, setWarehousePackerRoute] = useState();
  const [wareRetPackerRoute, setWareRetPackerRoute] = useState();
  const [salepointWareRoute, setSalepointWareRoute] = useState();

  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedProcessor, setSelectedProcessor] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedPacker, setSelectedPacker] = useState(null);
  const [selectedWareRet, setSelectedWareRet] = useState(null);
  const [selectedSalepoint, setSelectedSalepoint] = useState(null);

  const [center, setCenter] = useState(null);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const routeDirection = (dir1, dir2, setDirection) => {
    if (!dir2) return;
    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: dir1,
        destination: dir2,
        travelMode: 'DRIVING',
        provideRouteAlternatives: false,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirection(result);
        }
      }
    );
  };

  // LIMIT ----
  // const getRoute = (request, setDirection) => {
  //   let delayFactor = 0;
  //   const service = new window.google.maps.DirectionsService();

  //   service.route(request, (result, status) => {
  //     if (status === 'OK' && result) {
  //       setDirection(result);
  //     } else if (status === 'OVER_QUERY_LIMIT') {
  //       delayFactor = +1;
  //       setTimeout(() => {
  //         getRoute(request);
  //       }, delayFactor * 1000);
  //     }
  //   });
  // };

  // const routeDirection2 = (dir1, dir2, setDirection) => {
  //   console.log('dir1 view: ', dir1);
  //   const request = {
  //     origin: dir1,
  //     destination: dir2,
  //     travelMode: 'DRIVING',
  //     provideRouteAlternatives: false,
  //   };
  //   getRoute(request, setDirection);
  // };
  // ---

  // const latLng = async () => {
  //   const farmRes = await getCoordinates(farmDir);
  //   const processorRes = await getCoordinates(processorDir);
  //   const warehouseRes = await getCoordinates(warehouseDir);
  //   const packerRes = await getCoordinates(packerDir);
  //   const warehouseRetRes = await getCoordinates(warehouseRetDir);
  //   const salepointRetRes = await getCoordinates(salepointRetDir);
  //   setFarmMarker(farmRes);
  //   setProcessorMarker(processorRes);
  //   setWarehouseMarker(warehouseRes);
  //   setPackerMarker(packerRes);
  //   setWarehouseRetMarker(warehouseRetRes);
  //   setSalepointRetMarker(salepointRetRes);
  //   console.log('farm res:', farmRes);
  //   console.log('type lat: ', typeof farmRes.lat);
  //   console.log('lat: ', farmRes.lat);
  // };

  const latLngAssign = async () => {
    setFarmMarker({
      lat: parseFloat(farmAddress[1]),
      lng: parseFloat(farmAddress[2]),
    });
    setProcessorMarker({
      lat: parseFloat(processAddress[1]),
      lng: parseFloat(processAddress[2]),
    });
    setWarehouseMarker({
      lat: parseFloat(warehouseAddress[1]),
      lng: parseFloat(warehouseAddress[2]),
    });
    setPackerMarker({
      lat: parseFloat(packerAddress[1]),
      lng: parseFloat(packerAddress[2]),
    });
    setWarehouseRetMarker({
      lat: parseFloat(warehouseRetAddress[1]),
      lng: parseFloat(warehouseRetAddress[2]),
    });
    setSalepointRetMarker({
      lat: parseFloat(salepointRetAddress[1]),
      lng: parseFloat(salepointRetAddress[2]),
    });
  };

  // const defineCenter = async () => {
  //   const farmRes = await getCoordinates(farmDir);
  //   setCenter(farmRes);
  // };

  const defineCenterAssign = async () => {
    setCenter({ lat: parseFloat(farmAddress[1]), lng: parseFloat(farmAddress[2]) });
  };

  const routes = () => {
    routeDirection(farmMarker, processorMarker, setFarmProcRoute);
    routeDirection(processorMarker, warehouseMarker, setProcWarehouseRoute);
    routeDirection(warehouseMarker, packerMarker, setWarehousePackerRoute);
    routeDirection(packerMarker, warehouseRetMarker, setWareRetPackerRoute);
    routeDirection(warehouseRetMarker, salepointRetMarker, setSalepointWareRoute);
  };

  useEffect(() => {
    defineCenterAssign();
    setFarmDir(farmAddress[0]);
    setProcessorDir(processAddress[0]);
    setWarehouseDir(warehouseAddress[0]);
    setPackerDir(packerAddress[0]);
    setWarehouseRetDir(warehouseRetAddress[0]);
    setSalepointRetDir(salepointRetAddress[0]);

    latLngAssign();
    if (window.google) routes();
  }, [window.google, farmDir, processorDir, warehouseDir, packerDir, warehouseRetDir, salepointRetDir]);

  if (loadError) return 'Error';
  if (!isLoaded) return 'Cargando...';

  return (
    <div className="map-track">
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={9}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {farmMarker && (
          <>
            <Marker
              position={farmMarker}
              onClick={() => {
                setSelectedFarm(farmMarker);
              }}
              icon={{
                url: '/static/illustrations/Farm.svg',
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(10, 10),
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          </>
        )}

        {selectedFarm ? (
          <InfoWindow
            position={{ lat: selectedFarm.lat, lng: selectedFarm.lng }}
            onCloseClick={() => {
              setSelectedFarm(null);
            }}
          >
            <Box>
              <Typography variant="subttitle2" className="stage-title">
                Granja de Cafeto
              </Typography>
              <Typography variant="body2" className="stage-address">
                {' '}
                Dirección: {farmAddress[0]}
              </Typography>
              <Typography variant="body2" className="stage-address">
                {' '}
                Geolocalización: {Number(farmAddress[1]).toFixed(6)}, {Number(farmAddress[2]).toFixed(6)}
              </Typography>
            </Box>
          </InfoWindow>
        ) : null}

        {processorMarker && (
          <>
            <Marker
              position={processorMarker}
              onClick={() => {
                setSelectedProcessor(processorMarker);
              }}
              icon={{
                url: '/static/illustrations/processor.svg',
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(10, 10),
                scaledSize: new window.google.maps.Size(70, 70),
              }}
            />
          </>
        )}

        {selectedProcessor ? (
          <InfoWindow
            position={{ lat: selectedProcessor.lat, lng: selectedProcessor.lng }}
            onCloseClick={() => {
              setSelectedProcessor(null);
            }}
          >
            <Box>
              <Typography variant="subttitle2" className="stage-title">
                Procesador
              </Typography>
              <Typography variant="body2" className="stage-address">
                {' '}
                Dirección: {processAddress[0]}
              </Typography>
              <Typography variant="body2" className="stage-address">
                {' '}
                Geolocalización: {Number(processAddress[1]).toFixed(6)}, {Number(processAddress[2]).toFixed(6)}
              </Typography>
            </Box>
          </InfoWindow>
        ) : null}

        {warehouseMarker && (
          <>
            <Marker
              position={warehouseMarker}
              onClick={() => {
                setSelectedWarehouse(warehouseMarker);
              }}
              icon={{
                url: '/static/illustrations/warehouse1.svg',
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(10, 10),
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          </>
        )}

        {selectedWarehouse ? (
          <InfoWindow
            position={{ lat: selectedWarehouse.lat, lng: selectedWarehouse.lng }}
            onCloseClick={() => {
              setSelectedWarehouse(null);
            }}
          >
            <Box>
              <Typography variant="subttitle2" className="stage-title">
                Bodega
              </Typography>
              <Typography variant="body2" className="stage-address">
                {' '}
                Dirección: {warehouseAddress[0]}
              </Typography>
              <Typography variant="body2" className="stage-address">
                {' '}
                Geolocalización: {Number(warehouseAddress[1]).toFixed(6)}, {Number(warehouseAddress[2]).toFixed(6)}
              </Typography>
            </Box>
          </InfoWindow>
        ) : null}

        {packerMarker && (
          <>
            <Marker
              position={packerMarker}
              onClick={() => {
                setSelectedPacker(packerMarker);
              }}
              icon={{
                url: '/static/illustrations/pack1.png',
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(10, 10),
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
          </>
        )}

        {selectedPacker ? (
          <InfoWindow
            position={{ lat: selectedPacker.lat, lng: selectedPacker.lng }}
            onCloseClick={() => {
              setSelectedPacker(null);
            }}
          >
            <Box>
              <Typography variant="subttitle2" className="stage-title">
                Empacador
              </Typography>
              <Typography variant="body2" className="stage-address">
                {' '}
                Dirección: {packerAddress[0]}
              </Typography>
              <Typography variant="body2" className="stage-address">
                {' '}
                Geolocalización: {Number(packerAddress[1]).toFixed(6)}, {Number(packerAddress[2]).toFixed(6)}
              </Typography>
            </Box>
          </InfoWindow>
        ) : null}

        {warehouseRetMarker && (
          <>
            <Marker
              position={warehouseRetMarker}
              onClick={() => {
                setSelectedWareRet(warehouseRetMarker);
              }}
              icon={{
                url: '/static/illustrations/logistica_16.svg',
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(10, 10),
                scaledSize: new window.google.maps.Size(45, 45),
              }}
            />
          </>
        )}

        {selectedWareRet ? (
          <InfoWindow
            position={{ lat: selectedWareRet.lat, lng: selectedWareRet.lng }}
            onCloseClick={() => {
              setSelectedWareRet(null);
            }}
          >
            <Box>
              <Typography variant="subttitle2" className="stage-title">
                Almacén del Retailer
              </Typography>
              <Typography variant="body2" className="stage-address">
                {' '}
                Dirección: {warehouseRetAddress[0]}
              </Typography>
              <Typography variant="body2" className="stage-address">
                {' '}
                Geolocalización: {Number(warehouseRetAddress[1]).toFixed(6)},{' '}
                {Number(warehouseRetAddress[2]).toFixed(6)}
              </Typography>
            </Box>
          </InfoWindow>
        ) : null}

        {salepointRetMarker && (
          <>
            <Marker
              position={salepointRetMarker}
              onClick={() => {
                setSelectedSalepoint(salepointRetMarker);
              }}
              icon={{
                url: '/static/illustrations/salepoint.png',
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(10, 10),
                scaledSize: new window.google.maps.Size(45, 45),
              }}
            />
          </>
        )}

        {selectedSalepoint ? (
          <InfoWindow
            position={{ lat: selectedSalepoint.lat, lng: selectedSalepoint.lng }}
            onCloseClick={() => {
              setSelectedSalepoint(null);
            }}
          >
            <Box>
              <Typography variant="subttitle2" className="stage-title">
                Punto de Venta del Retailer
              </Typography>
              <Typography variant="body2" className="stage-address">
                {' '}
                Dirección: {salepointRetAddress[0]}
              </Typography>
              <Typography variant="body2" className="stage-address">
                {' '}
                Geolocalización: {Number(salepointRetAddress[1]).toFixed(6)},{' '}
                {Number(salepointRetAddress[2]).toFixed(6)}
              </Typography>
            </Box>
          </InfoWindow>
        ) : null}

        {farmProcRoute && (
          <DirectionsRenderer
            directions={farmProcRoute}
            options={{
              polylineOptions: {
                zIndex: 47,
                strokeColor: '#826AF9',
                strokeWeight: 4,
                strokeOpacity: 1,
              },
              suppressMarkers: true,
            }}
          />
        )}

        {procWarehouseRoute && (
          <DirectionsRenderer
            directions={procWarehouseRoute}
            options={{
              polylineOptions: {
                zIndex: 48,
                strokeColor: '#a44a31',
                strokeWeight: 4,
                strokeOpacity: 1,
              },
              suppressMarkers: true,
            }}
          />
        )}
        {warehousePackerRoute && (
          <DirectionsRenderer
            directions={warehousePackerRoute}
            options={{
              polylineOptions: {
                zIndex: 49,
                strokeColor: '#0A575C',
                strokeWeight: 4,
                strokeOpacity: 1,
              },
              suppressMarkers: true,
            }}
          />
        )}
        {wareRetPackerRoute && (
          <DirectionsRenderer
            directions={wareRetPackerRoute}
            options={{
              polylineOptions: {
                zIndex: 50,
                strokeColor: '#ff2f00',
                strokeWeight: 4,
                strokeOpacity: 1,
              },
              suppressMarkers: true,
            }}
          />
        )}
        {salepointWareRoute && (
          <DirectionsRenderer
            directions={salepointWareRoute}
            options={{
              polylineOptions: {
                zIndex: 51,
                strokeColor: '#B78103',
                strokeWeight: 4,
                strokeOpacity: 1,
              },
              suppressMarkers: true,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default MapsTracking;
