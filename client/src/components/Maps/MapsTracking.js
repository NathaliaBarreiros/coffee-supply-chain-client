import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Typography, IconButton, Grid, Box, Stack, Container, Button } from '@mui/material';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import { formatRelative } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import ExploreIcon from '@mui/icons-material/Explore';
import '@reach/combobox/styles.css';
import { Geolocation } from '../../logic/Maps/NavLocation';

import '../../App.css';

const libraries = ['places'];
const mapContainerStyle = {
  height: '100%',
  width: '100%',
};
const options = {
  mapId: 'c43de04e5c01e2fc',
  //   mapId: "16108b5df1a7bf0e",
  //   disableDefaultUI: false,
  scaleControl: true,
  scrollwheel: true,
  mapTypeControl: false,
  keyboardShortcuts: false,
  zoomControl: true,
};
const center = {
  lat: 0.06218317633464823,
  lng: -78.6820212451912,
};

const getLatLngGeocoder = async (address) => {
  const results = await getGeocode({ address });
  const { lat, lng } = await getLatLng(results[0]);

  return { lat, lng };
  //   const geocoder = new window.google.maps.Geocoder();

  //   const res = geocoder.geocode({ address }, (results, status) => {
  //     console.log('aqui');
  //     if (status === window.google.maps.GeocoderStatus.OK) {
  //       console.log('entre');

  //       try {
  //         const lat = results[0].geometry.location.lat();
  //         const lng = results[0].geometry.location.lng();
  //         return [lat, lng];
  //       } catch (error) {
  //         return error;
  //       }
  //     }
  //   });
};

const MapsTracking = () =>
  //     {
  //   farmAddress,
  //   processAddress,
  //   warehouseAddress,
  //   packerAddress,
  //   warehouseRetAddress,
  //   salepointRetAddress,
  // }
  {
    const google = window.google;
    const [farmMarker, setFarmMarker] = useState({});
    const [proccesorMarker, setProcessorMarker] = useState({});
    const [warehouseMarker, setWarehouseMarker] = useState({});
    const [warehouseRetMarker, setWarehouseRetMarker] = useState({});
    const [salepointRetMarker, setSalepointRetMarker] = useState({});
    const [farm, setFarm] = useState('');
    const [proccesor, setProcessor] = useState('');
    const [warehouse, setWarehouse] = useState('');
    const [packer, setPacker] = useState('');
    const [warehouseRet, setWarehouseRet] = useState('');
    const [salepointRet, setSalepointRet] = useState('');

    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries,
    });

    const onMapClick = useCallback((e) => {});

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
      mapRef.current = map;
    }, []);

    // useEffect(() => {
    //   setFarm('5223+H3V, Cuenca 010106, Ecuador');
    //   setProcessor('Del Cedron 1-52, Cuenca, Ecuador');
    //   setWarehouse('29PG+Q7 Latacunga, Ecuador');
    //   setPacker('Alcantarillas 366, Quito 170131, Ecuador');
    //   setWarehouseRet('JGVX+PMW, Sangolquí, Ecuador');
    //   setSalepointRet('17O521 Edmundo Carvajal N24-52 y Av. La Gasca, Interior C.C, Quito 170129, Ecuador');

    //   const latLng = async () => {
    //     console.log('here ');
    //     console.log('farm:', farm);

    //     setFarmMarker(await getLatLngGeocoder(farm));
    //   };

    //   latLng();
    // }, [farmMarker, farm]);

    // useEffect(() => {
    //   console.log('marker farm:', farmMarker);
    // }, [farmMarker, farm]);

    return (
      <>
        <div className="map-track">
          <GoogleMap
            id="map"
            mapContainerStyle={mapContainerStyle}
            zoom={9}
            center={center}
            options={options}
            // onClick={onMapClick}
            // onLoad={onMapLoad}
          />
          {/* <Marker
              key={uuid()}
              position={{ lat: parseFloat(markers.lat), lng: parseFloat(markers.lng) }}
                position={{ lat: parseFloat(markers.lat), lng: parseFloat(markers.lng) }}
              position={center}
              onClick={() => {
                setSelected(markers);
                setSelectedLoc(location);
              }}
              icon={{
                url: svg,
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(10, 10),
                scaledSize: new window.google.maps.Size(60, 60),
              }}
            />
          </GoogleMap> */}
        </div>
      </>
    );
  };

export default MapsTracking;
