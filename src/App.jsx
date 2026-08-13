import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Waves, Gauge as GaugeIcon, Crosshair, BrainCircuit, LineChart, Wifi, WifiOff, Menu, X, Bell, User, Settings } from 'lucide-react'
import LiveView from './views/LiveView'
import DroneView from './views/DroneView'
import AnalyticsView from './views/AnalyticsView'
import FungAiView from './views/FungAiView'
import { DAILY_ALERTS } from './data'

const NAV = [
  { id: 'live', label: 'Live Telemetry', icon: GaugeIcon, color: '#22d3ee' },
  { id: 'drone', label: 'Drone Control', icon: Crosshair, color: '#f43f5e' },
  { id: 'analytics', label: 'Analytics', icon: LineChart, color: '#eab308' },
  { id: 'fungai', label: 'FungAi Assistant', icon: BrainCircuit, color: '#a78bfa' },
]

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const rand = (lo, hi) => Math.random() * (hi - lo) + lo
const round1 = (v) => Math.round(v * 10) / 10

function walk(v, delta, lo, hi) {
  return clamp(v + rand(-delta, delta), lo, hi)
}

export default function App() {
  const [view, setView] = useState('live')
  const [menuOpen, setMenuOpen] = useState(false)
  const [connected, setConnected] = useState(true)
  const [lastCommand, setLastCommand] = useState(null)
  const [clock, setClock] = useState(new Date())

  const [telemetry, setTelemetry] = useState({
    pH: 6.51,
    temp: 27.3,
    turbidity: 24,
    oxygen: 4.8,
    bin: 78,
    battery: 82,
    trash: { detected: true, obstacle: 38, history: [42, 40, 39, 38, 41, 38, 37, 38] },
  })

  const [history, setHistory] = useState([])

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((t) => {
        const newT = {
          pH: round1(walk(t.pH, 0.05, 6.3, 7.3)),
          temp: round1(walk(t.temp, 0.12, 25, 29)),
          turbidity: Math.round(walk(t.turbidity, 0.6, 8, 34)),
          oxygen: round1(walk(t.oxygen, 0.08, 4, 6.5)),
          bin: Math.round(walk(t.bin, 0.4, 40, 92)),
          battery: round1(Math.max(0, t.battery - 0.01)),
          trash: {
            ...t.trash,
            detected: Math.random() < 0.82,
            obstacle: Math.round(walk(t.trash.obstacle, 4, 15, 120)),
            history: [...t.trash.history.slice(-15), Math.round(clamp(t.trash.obstacle + rand(-3, 3), 10, 100))],
          },
        }
        setHistory((h) => [
          ...h.slice(-71),
          {
            t: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            pH: newT.pH,
            temp: newT.temp,
            turbidity: newT.turbidity,
            oxygen: newT.oxygen,
          },
        ])
        return newT
      })
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setConnected((c) => (Math.random() > 0.92 ? !c : c)), 8000)
    return () => clearInterval(timer)
  }, [])

  const handleAction = (cmd) => setLastCommand(cmd.label)

  const history48 = useMemo(() => {
    const rows = []
    let pH = 6.9
    let temp = 26.5
    let turb = 16
    for (let i = 47; i >= 0; i--) {
      pH = clamp(pH + rand(-0.045, 0.045), 6.4, 7.4)
      temp = clamp(temp + rand(-0.16, 0.16), 23.5, 28.5)
      turb = clamp(turb + rand(-0.9, 0.9), 6, 32)
      const d = new Date(Date.now() - i * 3 * 3600 * 1000)
      rows.push({
        t: d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' }),
        pH: Math.round(pH * 100) / 100,
        temp: Math.round(temp * 10) / 10,
        turbidity: Math.round(turb),
        oxygen: Math.round(clamp(5.2 + (7 - pH) * 0.6 + rand(-0.2, 0.2), 3.5, 7.5) * 10) / 10,
      })
    }
    return rows
  }, [])

  const chartHistory = history.length >= 6 ? history : history48

  const renderView = () => {
    switch (view) {
      case 'drone':
        return <DroneView onAction={handleAction} lastCommand={lastCommand} />
      case 'analytics':
        return <AnalyticsView history={chartHistory} />
      case 'fungai':
        return <FungAiView telemetry={telemetry} />
      default:
        return <LiveView telemetry={telemetry} history={chartHistory} alerts={DAILY_ALERTS} />
    }
  }

  return (
    <div className="flex min-h-screen bg-abyss-950 font-sans text-slate-200">
      <div className="grid-bg pointer-events-none fixed inset-0 opacity-20" />

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass-strong fixed inset-y-0 left-0 z-50 w-72 flex flex-col lg:hidden"
            >
              <SidebarContent view={view} setView={setView} setMenuOpen={setMenuOpen} telemetry={telemetry} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="glass-strong hidden w-72 flex-col border-r border-white/5 lg:flex">
        <SidebarContent view={view} setView={setView} setMenuOpen={setMenuOpen} telemetry={telemetry} />
      </aside>

      {/* Main Content Area */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        <header className="glass sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 ring-1 ring-white/10 hover:text-white lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <motion.h1
                key={view}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-display text-2xl font-bold tracking-tight text-white"
              >
                {NAV.find((n) => n.id === view)?.label}
              </motion.h1>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Pond A-01
                </span>
                <span className="text-white/10">|</span>
                <span>Monsoon Bay</span>
                <span className="text-white/10">|</span>
                <span className="tabular-nums">{clock.toLocaleTimeString([], { hour12: false })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status Badges */}
            <div className="hidden items-center gap-3 md:flex">
              <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ${
                connected ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-400/20' : 'bg-rose-500/10 text-rose-400 ring-rose-400/20'
              }`}>
                {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
                {connected ? 'LINK STABLE' : 'RECONNECTING'}
              </div>

              <div className="flex items-center gap-3 rounded-full bg-slate-900/50 px-4 py-1.5 ring-1 ring-white/5">
                <div className="flex h-4 w-7 overflow-hidden rounded-sm bg-slate-800 ring-1 ring-white/10">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${telemetry.battery}%` }}
                    className={`mt-auto w-full rounded-sm ${telemetry.battery < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  />
                </div>
                <span className="font-mono text-xs font-bold text-slate-200">{Math.round(telemetry.battery)}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-white/5 pl-4">
              <HeaderAction icon={<Bell size={18} />} hasDot />
              <HeaderAction icon={<User size={18} />} />
              <HeaderAction icon={<Settings size={18} />} />
            </div>
          </div>
        </header>

        <div className="relative flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

function SidebarContent({ view, setView, setMenuOpen, telemetry }) {
  return (
    <>
      <div className="flex items-center gap-4 px-8 py-8">
        <div className="border-gradient relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-aqua-400 to-cyan-600 shadow-xl shadow-aqua-500/20">
          <Waves size={24} className="text-slate-950" />
        </div>
        <div>
          <h2 className="font-display text-xl font-black tracking-tight text-white">AquaSweep</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-aqua-400">Dashboard v2.0</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {NAV.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => {
              setView(id)
              setMenuOpen(false)
            }}
            className={`group relative flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${
              view === id
                ? 'bg-white/5 text-white ring-1 ring-white/10'
                : 'text-slate-500 hover:bg-white/[0.02] hover:text-slate-300'
            }`}
          >
            {view === id && (
              <motion.div
                layoutId="nav-glow"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-aqua-500/10 to-transparent opacity-50"
              />
            )}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 transition-all ${
                view === id ? 'bg-white/10 ring-white/20' : 'bg-transparent ring-transparent group-hover:ring-white/10'
              }`}
            >
              <Icon size={18} style={{ color: view === id ? color : 'currentColor' }} />
            </div>
            {label}
            {view === id && (
              <motion.div
                layoutId="active-indicator"
                className="absolute right-4 h-1.5 w-1.5 rounded-full bg-aqua-400 shadow-[0_0_8px_#22d3ee]"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto px-6 py-8">
        <div className="border-gradient glass-strong rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Unit</span>
            <span className="rounded-md bg-aqua-400/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-aqua-400">A-01</span>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-[11px] font-bold text-slate-500">UPTIME</span>
              <span className="font-mono text-[11px] font-bold text-emerald-400">6d 11h 42m</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900/50 ring-1 ring-white/5">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-aqua-600 to-aqua-400" />
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] font-bold text-slate-500">SIGNAL</span>
              <span className="font-mono text-[11px] font-bold text-aqua-400">-48 dBm</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function HeaderAction({ icon, hasDot }) {
  return (
    <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
      {icon}
      {hasDot && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-abyss-900 bg-rose-500" />}
    </button>
  )
}
