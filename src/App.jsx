import { useState, useEffect, useMemo } from 'react'
import { Waves, Gauge as GaugeIcon, Crosshair, BrainCircuit, LineChart, Wifi, WifiOff, Menu } from 'lucide-react'
import LiveView from './views/LiveView'
import DroneView from './views/DroneView'
import AnalyticsView from './views/AnalyticsView'
import FungAiView from './views/FungAiView'
import { DAILY_ALERTS } from './data'

const NAV = [
  { id: 'live', label: 'Live Telemetry', icon: GaugeIcon },
  { id: 'drone', label: 'Drone Control', icon: Crosshair },
  { id: 'analytics', label: 'Analytics', icon: LineChart },
  { id: 'fungai', label: 'FungAi Assistant', icon: BrainCircuit },
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
          battery: Math.round(Math.max(0, t.battery - 0.01)),
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
    <div className="flex min-h-screen">
      {menuOpen && <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMenuOpen(false)} />}

      <aside
        className={`glass-strong fixed inset-y-0 left-0 z-40 flex w-64 flex-col transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aqua-400 to-cyan-600 shadow-lg shadow-aqua-500/30">
            <Waves size={22} className="text-slate-950" />
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-abyss-900 bg-emerald-400" />
            </span>
          </div>
          <div>
            <p className="font-display text-lg font-bold leading-tight text-slate-100">AquaSweep</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-aqua-400/80">Control Center</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setView(id); setMenuOpen(false) }}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                view === id
                  ? 'bg-gradient-to-r from-aqua-500/20 to-transparent text-aqua-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {view === id && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-aqua-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />}
              <Icon size={18} className={view === id ? 'text-aqua-300' : 'text-slate-500 group-hover:text-slate-300'} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mx-3 mb-4 rounded-xl bg-slate-800/50 p-3.5 ring-1 ring-white/5">
          <p className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-500">
            Pond Unit <span className="text-aqua-300">A-01</span>
          </p>
          <div className="space-y-1.5 text-[11px]">
            {[
              ['Firmware', 'v1.4.2', 'text-slate-300'],
              ['Uptime', '6d 11h 42m', 'text-emerald-400'],
              ['RSSI', '-48 dBm', 'text-aqua-300'],
            ].map(([k, v, c]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-500">{k}</span>
                <span className={`font-mono ${c}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="relative flex min-h-screen flex-1 flex-col">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <header className="glass relative z-10 sticky top-0 flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 lg:hidden" onClick={() => setMenuOpen(true)}>
              <Menu size={18} />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-slate-100">{NAV.find((n) => n.id === view)?.label}</h1>
              <p className="hidden text-[11px] text-slate-500 sm:block">
                Pond A-01 · Monsoon Bay · last telemetry {clock.toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold sm:flex ${
              connected ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/30' : 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-400/30'
            }`}>
              {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
              {connected ? 'Online' : 'Reconnecting'}
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-slate-800/70 px-3 py-1.5 ring-1 ring-white/10 md:flex">
              <div className="relative h-5 w-8 overflow-hidden rounded-sm border border-emerald-400/40 p-0.5">
                <div
                  className="absolute bottom-0 left-0 w-full rounded-sm bg-gradient-to-t from-emerald-500 to-emerald-300"
                  style={{ height: `${telemetry.battery}%` }}
                />
              </div>
              <span className="font-mono text-xs font-semibold text-slate-200">{telemetry.battery}%</span>
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1 px-5 py-6 lg:px-8">{renderView()}</main>
      </div>
    </div>
  )
}
