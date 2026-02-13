import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { 
  Wind, 
  Droplets, 
  Factory, 
  Car, 
  Activity, 
  Zap, 
  Map as MapIcon, 
  ArrowUpRight, 
  Flame,
  Trees,
  AlertCircle
} from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={`min-h-screen bg-[#050505] text-[#e1e1e1] selection:bg-emerald-900 selection:text-white ${inter.className}`}>
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-lg font-bold tracking-tighter">PARISAR</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest uppercase text-neutral-400">
            <Link href="/aqi" className="hover:text-white transition-colors"> Air Quality </Link>
           </div>

          <button className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold tracking-wide hover:bg-emerald-400 transition-colors">
            TRACK NOW
          </button>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative h-[80vh] w-full rounded-[2.5rem] overflow-hidden group">
            <Image 
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2674&auto=format&fit=crop"
              alt="India Environmental"
              fill
              className="object-cover opacity-50 transition-transform duration-[2s] group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            
            <div className="relative h-full flex flex-col justify-end p-8 md:p-20">
              <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.85] mb-8 text-white">
                BREATHE <br />
                CLEAN
              </h1>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-t border-white/10 pt-8">
                <div className="max-w-xl">
                  <p className="text-xl md:text-2xl text-neutral-300 font-light leading-relaxed">
                    Real-time environmental intelligence across India. From Delhi's winter smog to Mumbai's coastal winds. We track what matters.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {['PM2.5', 'CROP BURN', 'INDUSTRIAL', 'TRAFFIC'].map((tag) => (
                    <span key={tag} className="px-5 py-2 border border-white/10 rounded-full text-xs font-bold tracking-widest uppercase bg-black/20 backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0a0a0a] p-10 rounded-[2rem] border border-white/5 flex flex-col justify-between min-h-[280px]">
            <div className="flex justify-between items-start">
              <span className="text-emerald-500 text-xs font-mono">01 — SCALE</span>
              <MapIcon className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <h3 className="text-6xl font-medium tracking-tighter mb-2">150<span className="text-emerald-500">+</span></h3>
              <p className="text-neutral-500 text-sm">Cities across India. Live data. Every minute.</p>
            </div>
          </div>

          <div className="bg-[#0a0a0a] p-10 rounded-[2rem] border border-white/5 flex flex-col justify-between min-h-[280px]">
             <div className="flex justify-between items-start">
              <span className="text-emerald-500 text-xs font-mono">02 — ACCURACY</span>
              <AlertCircle className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <h3 className="text-6xl font-medium tracking-tighter mb-2">97<span className="text-emerald-500">%</span></h3>
              <p className="text-neutral-500 text-sm">Validation against ground truth instruments.</p>
            </div>
          </div>

          <div className="bg-emerald-900/20 p-10 rounded-[2rem] border border-emerald-500/10 md:col-span-2 flex flex-col justify-between relative overflow-hidden group cursor-pointer">
             <div className="flex justify-between items-start relative z-10">
              <span className="text-emerald-400 text-xs font-mono">03 — WHAT WE MONITOR</span>
              <ArrowUpRight className="w-6 h-6 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl font-medium tracking-tighter mb-2 text-white">Crop burns, <br/> factory smoke, <br/> traffic chaos.</h3>
              <p className="text-emerald-200/60 text-sm max-w-md">Every source of pollution detected, analyzed, and mapped across seasons and regions.</p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]" />
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row gap-16 mb-16">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
              INDIA'S <br />
              AIR PROBLEM <br />
              SOLVED
            </h2>
            <div className="flex flex-col justify-end pb-4">
              <p className="text-neutral-400 max-w-sm text-lg">
                Not just measurements. We decode the complex web of industrial emissions, crop burning, traffic, and geography that defines India's air quality crisis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-800 rounded-[2rem] overflow-hidden border border-neutral-800">
            {[
              { 
                icon: Wind, 
                title: "Particulate Matter", 
                desc: "PM2.5, PM10, NOx, SO₂, O₃", 
                val: "Real-time" 
              },
              { 
                icon: Flame, 
                title: "Crop Burning", 
                desc: "Agricultural Fire Index, Intensity Maps", 
                val: "Seasonal Alert" 
              },
              { 
                icon: Factory, 
                title: "Industrial", 
                desc: "Factory Emissions, Waste Burning, Coal Sites", 
                val: "High Impact" 
              },
              { 
                icon: Car, 
                title: "Vehicular", 
                desc: "Traffic Density, Road Emissions, Congestion Index", 
                val: "Peak Hours" 
              },
              { 
                icon: Droplets, 
                title: "Meteorology", 
                desc: "Wind Speed, Humidity, Temperature, Inversion Layer", 
                val: "Hourly" 
              },
              { 
                icon: MapIcon, 
                title: "Topography", 
                desc: "Basin Effects, Valley Trapping, Altitude Impact", 
                val: "Static" 
              },
              { 
                icon: Trees, 
                title: "Green Cover", 
                desc: "Forest Density, Urban Vegetation, NDVI Index", 
                val: "Seasonal" 
              },
              { 
                icon: Activity, 
                title: "Population", 
                desc: "City Size, Migration Patterns, Peak Season Data", 
                val: "Dynamic" 
              },
              { 
                icon: Zap, 
                title: "Energy", 
                desc: "Diesel Gen Usage, Coal Power Plants, Night Lights", 
                val: "Consumption" 
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#080808] p-10 hover:bg-[#0f0f0f] transition-colors group">
                <div className="flex justify-between items-start mb-12">
                  <div className="p-3 bg-neutral-900 rounded-xl group-hover:bg-emerald-900/20 group-hover:text-emerald-400 transition-colors">
                    <item.icon size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 border border-neutral-800 px-2 py-1 rounded-md">
                    {item.val}
                  </span>
                </div>
                <h4 className="text-2xl font-bold tracking-tight mb-2 text-neutral-200">{item.title}</h4>
                <p className="text-neutral-500 text-sm leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { city: "Delhi NCR", metric: "142 µg/m³", status: "Critical", color: "red" },
            { city: "Mumbai", metric: "58 µg/m³", status: "Moderate", color: "amber" },
            { city: "Bangalore", metric: "42 µg/m³", status: "Satisfactory", color: "emerald" },
            { city: "Kolkata", metric: "89 µg/m³", status: "Poor", color: "orange" },
            { city: "Chennai", metric: "51 µg/m³", status: "Moderate", color: "amber" },
            { city: "Ahmedabad", metric: "128 µg/m³", status: "Very Poor", color: "red" }
          ].map((item, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 hover:border-white/10 transition-colors">
              <h3 className="text-2xl font-bold mb-2 text-neutral-100">{item.city}</h3>
              <p className="text-sm text-neutral-500 mb-6">Current AQI</p>
              <div className="flex items-end justify-between">
                <div className={`text-5xl font-bold text-${item.color}-400`}>{item.metric}</div>
                <span className={`text-xs font-bold uppercase px-3 py-2 rounded-full border border-${item.color}-500/30 bg-${item.color}-500/10 text-${item.color}-300`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-[1400px] mx-auto bg-[#e1e1e1] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row relative">
          <div className="p-12 md:p-24 md:w-1/2 flex flex-col justify-center text-black z-10">
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] mb-8">
              STAY <br />
              INFORMED
            </h2>
            <p className="text-neutral-600 text-lg mb-10 max-w-md">
              Get daily air quality updates for your city. Alerts before pollution spikes. Data you can trust.
            </p>
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="City or Pin Code" 
                className="bg-transparent border-b-2 border-neutral-400 py-2 w-full max-w-[250px] text-black placeholder:text-neutral-500 focus:outline-none focus:border-black transition-colors font-medium"
              />
              <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-colors whitespace-nowrap">
                TRACK
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 h-[400px] md:h-auto relative">
             <Image 
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2574&auto=format&fit=crop"
              alt="India Cities"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#e1e1e1]/20" />
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12">Why it matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-10">
              <p className="text-neutral-400 text-lg leading-relaxed">
                <span className="text-emerald-400 font-bold">900,000+ premature deaths annually</span> in India linked to air pollution. More than malaria, TB, and AIDS combined.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-10">
              <p className="text-neutral-400 text-lg leading-relaxed">
                <span className="text-emerald-400 font-bold">44 days</span> of hazardous air quality in Delhi every winter. Hospitals see 50% spike in respiratory cases.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-10">
              <p className="text-neutral-400 text-lg leading-relaxed">
                <span className="text-emerald-400 font-bold">Crop burning season (Oct-Nov)</span> causes <span className="text-emerald-400 font-bold">40-50% pollution surge</span> in Northern India.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-10">
              <p className="text-neutral-400 text-lg leading-relaxed">
                <span className="text-emerald-400 font-bold">Urban traffic</span> accounts for 20-30% of particulate matter in metro areas. Real solutions demand real data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="text-xs font-bold tracking-widest uppercase text-neutral-500">
            Parisar © 2026 — India's Air Intelligence Network
          </div>
          <div className="flex gap-8">
            {['Data', 'API', 'Team', 'Contact'].map((link) => (
              <Link href="#" key={link} className="text-xs font-bold tracking-widest uppercase text-neutral-500 hover:text-emerald-400 transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}