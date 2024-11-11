import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { Map } from 'leaflet' 
import 'leaflet/dist/leaflet.css'

interface Location {
  loaded: boolean
  error: boolean
  coordinates: {
    lat: number
    lng: number
  }
}

const MapUpdater = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap() as Map

  useEffect(() => {
    if (map) {
      if (map !== undefined) {
        map.remove(); 
      }
      map.setView([lat, lng], 9);
      console.log("Map updated to", lat, lng);
    }
  }, [lat, lng, map]);
  

  return null
}

const OpenStreetMap: React.FC = () => {
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: -4.043477, lng: 39.668205 })
  const ZOOM_LEVEL = 9
  const [location, setLocation] = useState<Location>({
    loaded: false,
    error: false,
    coordinates: { lat: 0, lng: 0 }
  })

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            loaded: true,
            error: false,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        },
        () => {
          setLocation((prev) => ({ ...prev, error: true }))
        }
      )
    }
  }, [])

  return (
    <div className='container'>
      <h1 className='text-center mt-5'>OpenStreetMap Embedded</h1>
      <MapContainer center={center} zoom={ZOOM_LEVEL} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <MapUpdater lat={location.coordinates.lat} lng={location.coordinates.lng} />
        {location.loaded && !location.error && (
          <Marker position={[location.coordinates.lat, location.coordinates.lng]} />
        )}
      </MapContainer>
    </div>
  )
}

export default OpenStreetMap
