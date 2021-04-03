import React from 'react';
import L from 'leaflet';
import { MapContainer, ImageOverlay, LayersControl, LayerGroup, Marker, Tooltip } from 'react-leaflet'
import parse from 'html-react-parser'
import './App.css';
import 'leaflet/dist/leaflet.css';
import markers from './markers.json'

function App() {
  const bounds: L.LatLngBounds = L.latLngBounds(
    L.latLng(620000, 900000),
    L.latLng(-900000, -620000)
  )

  const overlays = Object.entries(markers).map((entry: [string, any]) => {
    const [markerGroupName, markerGroup] = entry
    const markerGroupDisplayName = markerGroup.name
    const overlayName = `<img src='./assets/Layercontrol%20Icons/${markerGroupName}.png' height='20' />  ${markerGroupDisplayName}`
    
    const markers = markerGroup.markers.map((marker: any) => {
      const markerIcon = marker.icon
      const icon = L.icon({
        iconUrl: `assets/Markers%20Icons/${markerIcon}.png`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [-3, -76]
      })

      return (
        <Marker position={marker.position} icon={icon}>
          <Tooltip className="globalmarker">
            {parse(marker.popup)}
          </Tooltip>
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
        center={[0, 0]}
        zoom={-10}
        minZoom={-11}
        crs={L.CRS.Simple}
        renderer={L.svg()}
      >
        <ImageOverlay
          url="./scummap.jpg"
          bounds={bounds}
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
