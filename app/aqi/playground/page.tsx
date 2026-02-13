'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { 
  Sparkles, 
  Zap,
  Wind,
  Droplet,
  Thermometer,
  Factory,
  Car,
  Activity,
  TrendingUp,
  Loader,
  ArrowLeft,
  Sun,
  Cloud,
  Plus,
  Minus
} from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

interface PredictionState {
  status: 'idle' | 'analyzing' | 'calculating' | 'predicting' | 'complete'
  result: number | null
}

interface Variables {
  temperature: number
  humidity: number
  wind_speed: number
  traffic_index: number
  industrial_score: number
  construction_activity: number
  green_cover: number
  population_density: number
  time_of_day: number
  season: number
}

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return { label: 'Good', color: 'emerald' }
  if (aqi <= 100) return { label: 'Satisfactory', color: 'emerald' }
  if (aqi <= 150) return { label: 'Moderate', color: 'amber' }
  if (aqi <= 200) return { label: 'Poor', color: 'orange' }
  if (aqi <= 300) return { label: 'Very Poor', color: 'red' }
  return { label: 'Severe', color: 'red' }
}

export default function Playground() {
  const [variables, setVariables] = useState<Variables>({
    temperature: 25,
    humidity: 60,
    wind_speed: 5,
    traffic_index: 50,
    industrial_score: 40,
    construction_activity: 30,
    green_cover: 25,
    population_density: 50,
    time_of_day: 12,
    season: 1
  })

  const [prediction, setPrediction] = useState<PredictionState>({
    status: 'idle',
    result: null
  })

  const handlePredict = async () => {
    setPrediction({ status: 'analyzing', result: null })
    
    await new Promise(resolve => setTimeout(resolve, 800))
    setPrediction({ status: 'calculating', result: null })
    
    await new Promise(resolve => setTimeout(resolve, 800))
    setPrediction({ status: 'predicting', result: null })
    
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const baseAQI = 50
    const tempFactor = (variables.temperature - 25) * 2
    const humidityFactor = (70 - variables.humidity) * 0.5
    const windFactor = (10 - variables.wind_speed) * 3
    const trafficFactor = variables.traffic_index * 0.8
    const industrialFactor = variables.industrial_score * 1.2
    const constructionFactor = variables.construction_activity * 0.6
    const greenFactor = (50 - variables.green_cover) * 0.8
    const densityFactor = variables.population_density * 0.4
    
    const predictedAQI = Math.max(0, Math.min(500, 
      baseAQI + tempFactor + humidityFactor + windFactor + 
      trafficFactor + industrialFactor + constructionFactor + 
      greenFactor + densityFactor
    ))
    
    setPrediction({ status: 'complete', result: Math.round(predictedAQI) })
  }

  const handleReset = () => {
    setVariables({
      temperature: 25,
      humidity: 60,
      wind_speed: 5,
      traffic_index: 50,
      industrial_score: 40,
      construction_activity: 30,
      green_cover: 25,
      population_density: 50,
      time_of_day: 12,
      season: 1
    })
    setPrediction({ status: 'idle', result: null })
  }

  const updateVariable = (key: keyof Variables, value: number) => {
    setVariables(prev => ({ ...prev, [key]: value }))
    if (prediction.status === 'complete') {
      setPrediction({ status: 'idle', result: null })
    }
  }

  const increment = (key: keyof Variables, max: number) => {
    if (variables[key] < max) {
      updateVariable(key, variables[key] + 1)
    }
  }

  const decrement = (key: keyof Variables, min: number = 0) => {
    if (variables[key] > min) {
      updateVariable(key, variables[key] - 1)
    }
  }

  const getStatusDisplay = () => {
    switch (prediction.status) {
      case 'analyzing':
        return 'Analyzing variables'
      case 'calculating':
        return 'Computing factors'
      case 'predicting':
        return 'Predicting AQI'
      case 'complete':
        return 'Prediction complete'
      default:
        return 'Ready to predict'
    }
  }

  const aqiStatus = prediction.result !== null ? getAQIStatus(prediction.result) : null

  return (
    <main className={`min-h-screen bg-[#050505] text-[#e1e1e1] ${inter.className}`}>
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-[2000px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-lg font-bold tracking-tighter">PARISAR</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/aqi" className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <button className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold tracking-wide hover:bg-emerald-400 transition-colors">
              SIGN IN
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-3">AI Playground</h1>
            <p className="text-neutral-400 text-lg">Predict air quality with machine learning</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4 h-fit">
              
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Thermometer className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Temp</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => decrement('temperature')}
                    className="w-8 h-8 rounded-lg bg-[#080808] hover:bg-[#0f0f0f] border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-bold font-mono">{variables.temperature}</span>
                  <button
                    onClick={() => increment('temperature', 45)}
                    className="w-8 h-8 rounded-lg bg-[#080808] hover:bg-[#0f0f0f] border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-neutral-600 text-center">°C</p>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Droplet className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Humidity</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => decrement('humidity')}
                    className="w-8 h-8 rounded-lg bg-[#080808] hover:bg-[#0f0f0f] border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-bold font-mono">{variables.humidity}</span>
                  <button
                    onClick={() => increment('humidity', 100)}
                    className="w-8 h-8 rounded-lg bg-[#080808] hover:bg-[#0f0f0f] border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-neutral-600 text-center">%</p>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Wind className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Wind</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => decrement('wind_speed')}
                    className="w-8 h-8 rounded-lg bg-[#080808] hover:bg-[#0f0f0f] border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-bold font-mono">{variables.wind_speed}</span>
                  <button
                    onClick={() => increment('wind_speed', 20)}
                    className="w-8 h-8 rounded-lg bg-[#080808] hover:bg-[#0f0f0f] border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-neutral-600 text-center">m/s</p>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Car className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Traffic</span>
                </div>
                <div className="mb-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={variables.traffic_index}
                    onChange={(e) => updateVariable('traffic_index', Number(e.target.value))}
                    className="w-full h-1.5 bg-[#080808] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                <p className="text-2xl font-bold font-mono text-center">{variables.traffic_index}</p>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Factory className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Industrial</span>
                </div>
                <div className="mb-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={variables.industrial_score}
                    onChange={(e) => updateVariable('industrial_score', Number(e.target.value))}
                    className="w-full h-1.5 bg-[#080808] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                <p className="text-2xl font-bold font-mono text-center">{variables.industrial_score}</p>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Construction</span>
                </div>
                <div className="mb-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={variables.construction_activity}
                    onChange={(e) => updateVariable('construction_activity', Number(e.target.value))}
                    className="w-full h-1.5 bg-[#080808] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                <p className="text-2xl font-bold font-mono text-center">{variables.construction_activity}</p>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Cloud className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Green Cover</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => decrement('green_cover')}
                    className="w-8 h-8 rounded-lg bg-[#080808] hover:bg-[#0f0f0f] border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-bold font-mono">{variables.green_cover}</span>
                  <button
                    onClick={() => increment('green_cover', 100)}
                    className="w-8 h-8 rounded-lg bg-[#080808] hover:bg-[#0f0f0f] border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-neutral-600 text-center">%</p>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Population</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => decrement('population_density')}
                    className="w-8 h-8 rounded-lg bg-[#080808] hover:bg-[#0f0f0f] border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-bold font-mono">{variables.population_density}</span>
                  <button
                    onClick={() => increment('population_density', 100)}
                    className="w-8 h-8 rounded-lg bg-[#080808] hover:bg-[#0f0f0f] border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-neutral-600 text-center">density</p>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <Sun className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Time</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => decrement('time_of_day')}
                    className="w-8 h-8 rounded-lg bg-[#080808] hover:bg-[#0f0f0f] border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-bold font-mono">{String(variables.time_of_day).padStart(2, '0')}:00</span>
                  <button
                    onClick={() => increment('time_of_day', 23)}
                    className="w-8 h-8 rounded-lg bg-[#080808] hover:bg-[#0f0f0f] border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-neutral-600 text-center">hour</p>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Season</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['Winter', 'Spring', 'Summer', 'Fall'].map((season, idx) => (
                    <button
                      key={season}
                      onClick={() => updateVariable('season', idx)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                        variables.season === idx
                          ? 'bg-emerald-500 text-black'
                          : 'bg-[#080808] text-neutral-400 hover:bg-[#0f0f0f] border border-white/10'
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">AI Prediction</h3>
                </div>

                <div className="bg-[#080808] rounded-2xl p-8 mb-6 min-h-[280px] flex flex-col items-center justify-center">
                  {prediction.status !== 'idle' && prediction.status !== 'complete' ? (
                    <div className="text-center">
                      <div className="mb-6 flex justify-center">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-neutral-800 rounded-full" />
                          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
                        </div>
                      </div>
                      <p className="text-neutral-400 text-sm mb-2">{getStatusDisplay()}</p>
                      <div className="flex gap-1 justify-center">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  ) : prediction.result !== null ? (
                    <div className="text-center w-full">
                      <p className="text-neutral-500 text-xs mb-4 uppercase tracking-widest">Predicted AQI</p>
                      <div className="text-8xl font-bold mb-6 bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
                        {prediction.result}
                      </div>
                      <div className={`inline-block px-6 py-2 rounded-full border text-sm font-bold uppercase ${
                        aqiStatus?.color === 'emerald' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                        aqiStatus?.color === 'amber' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                        aqiStatus?.color === 'orange' ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' :
                        'text-red-400 border-red-500/30 bg-red-500/10'
                      }`}>
                        {aqiStatus?.label}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mb-6 flex justify-center">
                        <Sparkles className="w-16 h-16 text-neutral-800" />
                      </div>
                      <p className="text-neutral-500 text-sm">Configure variables</p>
                      <p className="text-neutral-600 text-xs mt-2">and run prediction</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handlePredict}
                    disabled={prediction.status !== 'idle' && prediction.status !== 'complete'}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    {prediction.status !== 'idle' && prediction.status !== 'complete' ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Run Prediction
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full bg-[#080808] hover:bg-[#0f0f0f] border border-white/10 text-neutral-300 font-bold py-4 rounded-xl transition-colors text-sm"
                  >
                    Reset Variables
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    ML model trained on 50K+ historical data points across environmental, urban, and temporal factors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}