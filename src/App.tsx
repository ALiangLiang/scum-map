import React from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, LayersControl, LayerGroup, Marker, Popup } from 'react-leaflet'
import parse from 'html-react-parser'
import './App.css';
import 'leaflet/dist/leaflet.css';
import markers from './markers.json'

function App() {
  const crs = Object.assign({}, L.CRS.Simple, {
    projection: L.Projection.LonLat,
    transformation: new L.Transformation(0.0002133333333333333, 0, -0.0002133333333333333, 0),
    scale: function(zoom: number) {
      return Math.pow(2, zoom)
    },

    zoom: function(scale: number) {
      return Math.log(scale) / Math.LN2
    },

    distance: function(latlng1: L.LatLng, latlng2: L.LatLng) {
      const dx = latlng2.lng - latlng1.lng
      const dy = latlng2.lat - latlng1.lat

      return Math.sqrt(dx * dx + dy * dy)
    },

    infinite: true,
  })

  const bounds: L.LatLngBounds = L.latLngBounds(
    L.latLng(-0, 0),
    L.latLng(-1200000, 1200000)
  )

  const overlays = Object.entries(markers).map((entry: [string, any]) => {
    const [markerGroupName, markerGroup] = entry
    const markerGroupDisplayName = markerGroup.name
    const overlayName = `<img src='./assets/Layercontrol%20Icons/mgi_${markerGroupName}.png' height='20' />  ${markerGroupDisplayName}`
    
    const markers = markerGroup.markers.map((marker: any) => {
      const markerIcon = marker.icon
      const icon = L.icon({
        iconUrl: `assets/Markers%20Icons/${markerIcon}.png`,
        iconSize: [42, 42],
        iconAnchor: [21, 42],
      })

      return (
        <Marker position={marker.position} icon={icon}>
          <Popup>
            {parse(marker.popup)}
          </Popup>
        </Marker>
      )
    })

    return (
      <LayersControl.Overlay name={overlayName}>
        <LayerGroup>
          {markers}
        </LayerGroup>
      </LayersControl.Overlay>
    )
  })

  return (
    <div className="App">
      <MapContainer
        className="map"
        center={[-597949.21875, 600146.484375]}
        zoom={2}
        crs={crs}
      >
        <TileLayer
          url="./map/{z}/{x}/{y}.png"
          minZoom={1}
          maxZoom={5}
          bounds={bounds}
          noWrap={true}
        />
        <LayersControl
          position="topright"
          collapsed={false}
        >
          {overlays}
        </LayersControl>
      </MapContainer>
    </div>
  );
}

export default App;
