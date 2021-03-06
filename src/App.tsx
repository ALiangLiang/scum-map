/// <reference path="../types/react-leaflet-div-icon.d.ts"/> 

import React from 'react';
import { renderToStaticMarkup } from "react-dom/server"
import L from 'leaflet';
import { MapContainer, useMapEvent, ImageOverlay, LayersControl, LayerGroup, Marker, Tooltip } from 'react-leaflet'
import parse from 'html-react-parser'
import './App.css';
import 'leaflet/dist/leaflet.css';
import markers from './markers.json'
import localization from './localizations/zh_tw.json'

const GROUP_NAMES: {[index: string]: string} = localization['groupName']
const MARK_NAMES: {[index: string]: string} = localization['marker']

function App() {
  const bounds: L.LatLngBounds = L.latLngBounds(
    L.latLng(620000, -620000),
    L.latLng(-900000, 900000)
  )

  const overlays = Object.entries(markers).map((entry: [string, any]) => {
    const [markerGroupName, markerGroup] = entry
    const translatedMarkerGroupName = GROUP_NAMES[markerGroupName]
    const overlayName = `<img src='./assets/Layercontrol%20Icons/${markerGroupName}.png' height='20' />  ${translatedMarkerGroupName}`
    
    const markers = markerGroup.markers.map((marker: {position: [number, number], icon: string, id: string, tooltip: string}) => {
      const markerIcon = marker.icon
      const tooltipContent = MARK_NAMES[marker.id] || marker.tooltip
      const icon = L.divIcon({
        html: renderToStaticMarkup(
          <div className="marker-stack">
            <div className="marker-pointer">
              <img
                src="https://icons-for-free.com/iconfiles/png/512/map+marker+icon-1320166582858325800.png"
                alt=""
              />
            </div>
            <div className="marker-icon">
              <img
                // src={`assets/Markers%20Icons/${markerIcon}.png`}
                src={`assets/marker_icons/${markerIcon}.svg`}
                alt={tooltipContent}
              />
            </div>
          </div>
        ),
        // iconUrl: `assets/marker_icons/${markerIcon}.svg`,
        // iconSize: [42, 42],
        // iconAnchor: [21, 42],
        // popupAnchor: [-3, -76]
      })

      return (
        <Marker position={marker.position} icon={icon}>
          <Tooltip className="globalmarker">
            {parse(tooltipContent)}
          </Tooltip>
        </Marker>
      )
    })

    return (
      <LayersControl.Overlay name={overlayName} checked={markerGroup.checked}>
        <LayerGroup>
          {markers}
        </LayerGroup>
      </LayersControl.Overlay>
    )
  })

  function ShowCoordinates() {
    const map = useMapEvent('click', (e) => {
      const oldLat = e.latlng.lat
      const oldLng = e.latlng.lng
      const newLat = oldLat
      const newLng = oldLng * -1
      L.popup()
      .setLatLng(e.latlng)
      .setContent("<b>?????????</b><br>-????????????<br><text style=color:#0062ff>" + e.latlng +
      "</text><br><br>-????????????<br><text style=color:#0062ff>" + newLng + " " + newLat + " test: " + e.latlng.lat + " test: " + -e.latlng.lng +
      "</text><br><br>-???????????????<br><text style=color:#ff2a00>#teleport " + newLng.toFixed(8) + " " + newLat.toFixed(8) + " 0</text>")
      .openOn(map);
    })
    return null
  }

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
        <ShowCoordinates />
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
