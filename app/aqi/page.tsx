'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import { 
  Search, 
  MapPin, 
  Wind, 
  AlertCircle, 
  TrendingUp, 
  Navigation2,
  Zap,
  Clock,
  Loader,
  X
} from 'lucide-react'

const MapComponent = dynamic(() => import('./components/map'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

interface CityData {
  id: number
  city_name: string
  pincode: string | null
  latitude: number
  longitude: number
  aqi: number
  pm25: number | null
  pm10: number | null
  temperature: number | null
  humidity: number | null
  visibility: number | null
  weather_condition: string | null
  no2: number | null
  so2: number | null
  o3: number | null
  wind_speed: number | null
  wind_direction: string | null
  pressure: number | null
  status: 'Good' | 'Satisfactory' | 'Moderate' | 'Moderately Polluted' | 'Poor' | 'Very Poor' | 'Critical' | 'Severe'
  created_at: string
  updated_at: string
}

interface City {
  id: number
  name: string
  lat: number
  lng: number
  aqi: number
  pm25: number
  pm10: number
  status: 'Good' | 'Satisfactory' | 'Moderate' | 'Moderately Polluted' | 'Poor' | 'Very Poor' | 'Critical' | 'Severe'
  color: string
  temp: number
  humidity: number
  visibility: number
  weatherCondition: string
  no2: number
  so2: number
  o3: number
  windSpeed: number
  windDirection: string
  pressure: number
  pincode: string
  updatedAt: string
}

const getStatusColor = (status: City['status']): string => {
  const colors: Record<City['status'], string> = {
    'Good': 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    'Satisfactory': 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    'Moderate': 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    'Moderately Polluted': 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    'Poor': 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    'Very Poor': 'text-red-400 border-red-500/30 bg-red-500/10',
    'Critical': 'text-red-400 border-red-500/30 bg-red-500/10',
    'Severe': 'text-red-400 border-red-500/30 bg-red-500/10'
  }
  return colors[status]
}

const getStatusColorClass = (status: City['status']): string => {
  const colors: Record<City['status'], string> = {
    'Good': 'emerald',
    'Satisfactory': 'emerald',
    'Moderate': 'amber',
    'Moderately Polluted': 'orange',
    'Poor': 'orange',
    'Very Poor': 'red',
    'Critical': 'red',
    'Severe': 'red'
  }
  return colors[status]
}

const mapSupabaseToCity = (data: CityData): City => ({
  id: data.id,
  name: data.city_name,
  lat: data.latitude,
  lng: data.longitude,
  aqi: data.aqi,
  pm25: data.pm25 || 0,
  pm10: data.pm10 || 0,
  status: data.status,
  color: getStatusColorClass(data.status),
  temp: data.temperature || 0,
  humidity: data.humidity || 0,
  visibility: data.visibility || 0,
  weatherCondition: data.weather_condition || '',
  no2: data.no2 || 0,
  so2: data.so2 || 0,
  o3: data.o3 || 0,
  windSpeed: data.wind_speed || 0,
  windDirection: data.wind_direction || '',
  pressure: data.pressure || 0,
  pincode: data.pincode || '',
  updatedAt: data.updated_at
})

export default function AQIDashboard() {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [sortBy, setSortBy] = useState<'aqi-high' | 'aqi-low' | 'name'>('aqi-high')
  const [isHydrated, setIsHydrated] = useState(false)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/get/aqi', {
          headers: {
            'Cache-Control': 'public, max-age=3600',
          },
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch AQI data')
        }

        const data: CityData[] = await response.json()
        const mappedCities = data.map(mapSupabaseToCity)
        
        setCities(mappedCities)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setCities([])
      } finally {
        setLoading(false)
      }
    }

    fetchCities()

    const interval = setInterval(fetchCities, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedCity && mapRef.current && isHydrated) {
      mapRef.current.setView([selectedCity.lat, selectedCity.lng], 11)
    }
  }, [selectedCity, isHydrated])

  const filteredAndSorted = useMemo<City[]>(() => {
    let result = cities.filter(city =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.pincode.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (sortBy === 'aqi-high') result.sort((a, b) => b.aqi - a.aqi)
    if (sortBy === 'aqi-low') result.sort((a, b) => a.aqi - b.aqi)
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name))

    return result
  }, [searchQuery, sortBy, cities])

  const topCritical = cities.filter(c => c.aqi > 100).slice(0, 3)
  const isSearching = searchQuery.trim() !== ''

  const handleCityClick = (city: City) => {
    setSelectedCity(city)
    setSearchQuery('')
    if (mapRef.current && isHydrated) {
      mapRef.current.setView([city.lat, city.lng], 11)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleCloseSidePanel = () => {
    setSelectedCity(null)
  }

  if (!isHydrated) {
    return (
      <main className={`min-h-screen bg-[#050505] text-[#e1e1e1] ${inter.className}`}>
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
          <div className="max-w-[2000px] mx-auto px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-lg font-bold tracking-tighter">PARISAR</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/aqi/playground" className="text-xs font-medium tracking-widest uppercase text-neutral-400 hover:text-white transition-colors">
                Playground
              </Link>
              <button className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold tracking-wide hover:bg-emerald-400 transition-colors">
                SIGN IN
              </button>
            </div>
          </div>
        </nav>
        <div className="pt-40 flex items-center justify-center h-screen">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
            <p className="text-neutral-400">Loading application...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen bg-[#050505] text-[#e1e1e1] ${inter.className}`} suppressHydrationWarning>
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-[2000px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-lg font-bold tracking-tighter">PARISAR</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/aqi/playground" className="text-xs font-medium tracking-widest uppercase text-neutral-400 hover:text-white transition-colors">
              Playground
            </Link>
            <button className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold tracking-wide hover:bg-emerald-400 transition-colors">
              SIGN IN
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-8 px-8">
        <div className="max-w-[2000px] mx-auto">
          
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-3">Air Quality Now</h1>
            <p className="text-neutral-400 text-lg">Real-time pollution levels across India</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search city or pin code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] pl-14 pr-6 py-4 text-[#e1e1e1] placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:bg-[#0f0f0f] transition-all"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'aqi-high' | 'aqi-low' | 'name')}
              className="bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] px-6 py-4 text-[#e1e1e1] text-sm focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
            >
              <option value="aqi-high">Worst First</option>
              <option value="aqi-low">Best First</option>
              <option value="name">A-Z</option>
            </select>
          </div>

          {!isSearching && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px] mb-12">
              <div className="lg:col-span-3 bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden">
                <div className="relative w-full h-full bg-[#080808]">
                  {isHydrated && (
                    <MapComponent 
                      cities={filteredAndSorted}
                      onCityClick={handleCityClick}
                      selectedCity={selectedCity}
                      mapRef={mapRef}
                    />
                  )}

                  {!loading && filteredAndSorted.length > 0 && (
                    <div className="absolute bottom-6 left-6 right-6 flex gap-2 overflow-x-auto z-10">
                      {filteredAndSorted.slice(0, 8).map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleCityClick(city)}
                          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                            selectedCity?.id === city.id
                              ? 'bg-emerald-500 text-black'
                              : 'bg-[#050505] border border-white/20 hover:border-emerald-500/50'
                          }`}
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedCity ? (
                <div className="lg:col-span-1 bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 overflow-y-auto">
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="text-2xl font-bold">{selectedCity.name}</h2>
                    <button
                      onClick={handleCloseSidePanel}
                      className="text-neutral-500 hover:text-white transition-colors text-2xl leading-none"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <p className="text-neutral-500 text-xs mb-6">
                    Updated: {new Date(selectedCity.updatedAt).toLocaleString()}
                  </p>

                  <div className="bg-[#080808] rounded-xl p-4 mb-6">
                    <p className="text-neutral-500 text-xs mb-2 uppercase tracking-widest font-medium">Air Quality</p>
                    <div className="flex items-end gap-3">
                      <span className="text-5xl font-bold">{selectedCity.aqi}</span>
                      <div className="mb-1">
                        <p className={`font-bold uppercase text-xs ${getStatusColor(selectedCity.status)}`}>
                          {selectedCity.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="bg-[#080808] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-4 h-4 text-emerald-400" />
                        <p className="text-xs text-neutral-500 uppercase font-medium">PM2.5</p>
                      </div>
                      <p className="text-xl font-bold">{selectedCity.pm25.toFixed(1)} <span className="text-xs text-neutral-600">µg/m³</span></p>
                    </div>

                    <div className="bg-[#080808] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-4 h-4 text-blue-400" />
                        <p className="text-xs text-neutral-500 uppercase font-medium">PM10</p>
                      </div>
                      <p className="text-xl font-bold">{selectedCity.pm10.toFixed(1)} <span className="text-xs text-neutral-600">µg/m³</span></p>
                    </div>

                    <div className="bg-[#080808] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <p className="text-xs text-neutral-500 uppercase font-medium">Temperature</p>
                      </div>
                      <p className="text-xl font-bold">{selectedCity.temp.toFixed(1)}°C</p>
                    </div>

                    <div className="bg-[#080808] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Navigation2 className="w-4 h-4 text-cyan-400" />
                        <p className="text-xs text-neutral-500 uppercase font-medium">Humidity</p>
                      </div>
                      <p className="text-xl font-bold">{selectedCity.humidity}%</p>
                    </div>

                    <div className="bg-[#080808] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-orange-400" />
                        <p className="text-xs text-neutral-500 uppercase font-medium">NO₂</p>
                      </div>
                      <p className="text-xl font-bold">{selectedCity.no2.toFixed(1)} <span className="text-xs text-neutral-600">ppb</span></p>
                    </div>

                    <div className="bg-[#080808] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-4 h-4 text-rose-400" />
                        <p className="text-xs text-neutral-500 uppercase font-medium">SO₂</p>
                      </div>
                      <p className="text-xl font-bold">{selectedCity.so2.toFixed(1)} <span className="text-xs text-neutral-600">ppb</span></p>
                    </div>

                    <div className="bg-[#080808] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-4 h-4 text-purple-400" />
                        <p className="text-xs text-neutral-500 uppercase font-medium">O₃</p>
                      </div>
                      <p className="text-xl font-bold">{selectedCity.o3.toFixed(1)} <span className="text-xs text-neutral-600">ppb</span></p>
                    </div>

                    <div className="bg-[#080808] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-4 h-4 text-teal-400" />
                        <p className="text-xs text-neutral-500 uppercase font-medium">Wind Speed</p>
                      </div>
                      <p className="text-xl font-bold">{selectedCity.windSpeed.toFixed(1)} <span className="text-xs text-neutral-600">m/s</span></p>
                    </div>

                    <div className="bg-[#080808] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <p className="text-xs text-neutral-500 uppercase font-medium">Pressure</p>
                      </div>
                      <p className="text-xl font-bold">{selectedCity.pressure.toFixed(1)} <span className="text-xs text-neutral-600">mb</span></p>
                    </div>

                    <div className="bg-[#080808] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-4 h-4 text-pink-400" />
                        <p className="text-xs text-neutral-500 uppercase font-medium">Weather</p>
                      </div>
                      <p className="text-xl font-bold capitalize">{selectedCity.weatherCondition || 'N/A'}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleCloseSidePanel}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2 rounded-lg transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {topCritical.length > 0 && (
                    <div className="bg-red-900/20 border border-red-500/20 rounded-[2rem] p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-red-400">Critical Areas</span>
                      </div>
                      <div className="space-y-3">
                        {topCritical.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => handleCityClick(city)}
                            className="w-full text-left hover:bg-red-500/10 p-2 rounded transition-colors"
                          >
                            <p className="font-medium text-neutral-100 mb-1">{city.name}</p>
                            <p className="text-red-300 text-xs font-mono">{city.aqi} AQI</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                      <h3 className="font-bold text-sm tracking-widest uppercase">Statistics</h3>
                      <Clock className="w-4 h-4 text-neutral-500" />
                    </div>
                    
                    {loading ? (
                      <div className="flex items-center justify-center h-24">
                        <Loader className="w-5 h-5 animate-spin text-emerald-500" />
                      </div>
                    ) : error ? (
                      <p className="text-red-400 text-xs">{error}</p>
                    ) : (
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-neutral-500 text-xs mb-2">Avg AQI</p>
                          <p className="text-3xl font-bold">{Math.round(cities.reduce((a, b) => a + b.aqi, 0) / (cities.length || 1))}</p>
                        </div>
                        
                        <div>
                          <p className="text-neutral-500 text-xs mb-2">Worst City</p>
                          <p className="font-medium">{cities.length > 0 ? cities.reduce((a, b) => a.aqi > b.aqi ? a : b).name : 'N/A'}</p>
                        </div>
                        
                        <div>
                          <p className="text-neutral-500 text-xs mb-2">Best City</p>
                          <p className="font-medium">{cities.length > 0 ? cities.reduce((a, b) => a.aqi < b.aqi ? a : b).name : 'N/A'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold tracking-tighter">
                {isSearching ? 'Search Results' : 'All Cities'}
              </h2>
              <span className="text-neutral-500 text-sm">
                {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'city' : 'cities'}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
                  <p className="text-neutral-400">Loading air quality data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-500/20 rounded-[2rem] p-8">
                <p className="text-red-300 text-center">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAndSorted.map((city) => (
                  <div
                    key={city.id}
                    onClick={() => handleCityClick(city)}
                    className={`group bg-[#0a0a0a] border rounded-[1.5rem] p-6 hover:bg-[#0f0f0f] transition-all cursor-pointer ${
                      selectedCity?.id === city.id
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{city.name}</h3>
                        <p className="text-xs text-neutral-500">{city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°</p>
                      </div>
                      <MapPin className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 transition-colors" />
                    </div>

                    <div className="space-y-4">
                      <div className="border-t border-white/5 pt-4">
                        <p className="text-neutral-500 text-xs mb-2 uppercase tracking-widest font-medium">AQI</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold">{city.aqi}</span>
                          <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full border ${getStatusColor(city.status)}`}>
                            {city.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                        <div>
                          <p className="text-neutral-600 text-xs mb-1">PM2.5</p>
                          <p className="font-bold text-sm">{city.pm25.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-neutral-600 text-xs mb-1">Temp</p>
                          <p className="font-bold text-sm">{city.temp.toFixed(1)}°C</p>
                        </div>
                        <div>
                          <p className="text-neutral-600 text-xs mb-1">RH</p>
                          <p className="font-bold text-sm">{city.humidity}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && filteredAndSorted.length === 0 && (
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-16 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
                <p className="text-neutral-400 text-lg">No cities found</p>
                <p className="text-neutral-500 text-sm mt-2">Try searching with a different query</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}