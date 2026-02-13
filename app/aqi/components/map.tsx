// @ts-nocheck
'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

interface MapComponentProps {
  cities: Array<{
    id: number
    name: string
    lat: number
    lng: number
    aqi: number
    status: string
  }>
  onCityClick: (city: any) => void
  selectedCity: any
  mapRef: React.RefObject<any>
}

export default function MapComponent({ cities, onCityClick, selectedCity, mapRef }: MapComponentProps) {
  return (
    <>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        className="rounded-[2rem]"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.lat, city.lng]}
            eventHandlers={{
              click: () => onCityClick(city),
            }}
          >
            <Popup>
              <div className="text-sm font-medium">
                <p className="font-bold text-[#050505]">{city.name}</p>
                <p className="text-xs text-gray-600">AQI: {city.aqi}</p>
                <p className="text-xs text-gray-600">{city.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  )
}