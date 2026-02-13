// @ts-nocheck
'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

interface MapComponentProps {
  cities: Array<{
    id: number
    name: string
    lat: number
    lng: number
    aqi: number
    status: string
    color: string
  }>
  onCityClick: (city: any) => void
  selectedCity: any
  mapRef: React.RefObject<any>
}

function MapUpdater({ selectedCity }: { selectedCity: any }) {
  const map = useMap()
  
  useEffect(() => {
    if (selectedCity && map) {
      map.setView([selectedCity.lat, selectedCity.lng], 11)
    }
  }, [selectedCity, map])
  
  return null
}

const getMarkerColor = (status: string): string => {
  const colors: Record<string, string> = {
    'Good': '#10b981',
    'Satisfactory': '#10b981',
    'Moderate': '#f59e0b',
    'Moderately Polluted': '#fb923c',
    'Poor': '#fb923c',
    'Very Poor': '#ef4444',
    'Critical': '#ef4444',
    'Severe': '#ef4444'
  }
  return colors[status] || '#10b981'
}

export default function MapComponent({ cities, onCityClick, selectedCity, mapRef }: MapComponentProps) {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
  }, [])

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: '100%', width: '100%', background: '#080808' }}
      className="rounded-[2rem] z-0"
      ref={mapRef}
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      
      <MapUpdater selectedCity={selectedCity} />
      
      {cities.map((city) => (
        <CircleMarker
          key={city.id}
          center={[city.lat, city.lng]}
          radius={selectedCity?.id === city.id ? 12 : 8}
          fillColor={getMarkerColor(city.status)}
          color="#fff"
          weight={selectedCity?.id === city.id ? 3 : 2}
          opacity={1}
          fillOpacity={0.8}
          eventHandlers={{
            click: () => onCityClick(city),
          }}
        >
          <Popup>
            <div className="text-sm font-medium">
              <p className="font-bold text-[#050505] mb-1">{city.name}</p>
              <p className="text-xs text-gray-600">AQI: {city.aqi}</p>
              <p className="text-xs text-gray-600">{city.status}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}