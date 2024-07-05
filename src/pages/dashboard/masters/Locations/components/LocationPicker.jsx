import 'leaflet/dist/leaflet.css';
import React from 'react'
import { Card, Box, Grid, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MapContainer } from 'react-leaflet/MapContainer'
import { Marker } from 'react-leaflet/Marker'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMapEvents } from 'react-leaflet/hooks'
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconSize: [28, 46],
  iconAnchor: [17, 46]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ position, handleChangePosition }) => {

  return (
    <StyledWrapper>
      <StyledCard>
        <MapContainer style={{ height: '100%', width: '100%' }} center={position} zoom={10} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker handleChangePosition={handleChangePosition} position={position} />
        </MapContainer>
      </StyledCard>
      <Grid container spacing={3} marginBottom={2} marginTop={1}>
        <Grid item xs={12} md={6}>
          <span>Latitude</span>
          <TextField
            fullWidth
            name="lat"
            onChange={e => handleChangePosition({ latlng: { lng: position.lng || 0, lat: +e.target.value } })}
            value={position?.lat}
            type='number'
            placeholder='29.3808268'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <span>Longitude</span>
          <TextField
            fullWidth
            name="lng"
            onChange={e => handleChangePosition({ latlng: { lat: position.lat || 0, lng: +e.target.value } })}
            value={position?.lng}
            type='number'
            placeholder='47.9910908'
          />
        </Grid>
      </Grid>
    </StyledWrapper>
  )
}
export default LocationPicker

const LocationMarker = ({ handleChangePosition, position }) => {
  useMapEvents({
    click(e) {
      handleChangePosition(e)
    },
  })  

  return position === null ? null : (
    <Marker position={position} />
  )
}

const StyledCard = styled(Card)(
  () => `
      padding: 10px;
      width: 100%;
      height: 300px
  `
);

const StyledWrapper = styled(Box)(
  () => `
  display: flex;
  flex-direction: column;
`
);
