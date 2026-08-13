import { motion } from 'framer-motion'
import { Droplet, Thermometer, Wind, Trash2, Waves, BatteryCharging, AlertTriangle, Radar, Activity } from 'lucide-react'
import Gauge from '../components/Gauge'
import SensorCard from '../components/SensorCard'

export default function LiveView({ telemetry, history, alerts }) {
  const { pH, temp, turbidity, oxygen, bin, battery, trash } = telemetry

  const binColor = bin > 85 ? '#f59e0b' : '#22d3ee'
  const battColor = battery < 20 ? '#f43f5e' : battery < 45 ? '#f59e0b' : '#34d399'

  const sensorHistory = (key) => history.map((h) => h[key])

  return (
    <div className="space-y-10">
      {/* Hero gauges */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-500/10 text-aqua-400 ring-1 ring-aqua-400/20">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Critical Metrics</h2>
              <p className="text-xs font-medium text-slate-500">Real-time telemetry stream from Pond A-01</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua-400" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-aqua-400">Live · 10 Hz</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[
            { value: pH, min: 0, max: 14, unit: '', label: 'pH Level', color: '#f43f5e', warnLow: 6.8, warnHigh: 8.2 },
            { value: temp, min: 0, max: 50, unit: '°C', label: 'Water Temp', color: '#fb923c', warnHigh: 32, warnLow: 18 },
            { value: turbidity, min: 0, max: 100, unit: 'NTU', label: 'Turbidity', color: '#eab308', warnHigh: 30 },
            { value: bin, min: 0, max: 100, unit: '%', label: 'Bin Full', color: binColor, warnHigh: 85 },
            { value: battery, min: 0, max: 100, unit: '%', label: 'Battery', color: battColor, warnLow: 45, warnHigh: 20 },
          ].map((g, i) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border-gradient glass flex flex-col items-center justify-center rounded-2xl p-6"
            >
              <Gauge {...g} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sensor cards */}
      <section>
        <div className="mb-6">
          <h2 className="font-display text-lg font-bold text-white">Advanced Sensor Array</h2>
          <p className="text-xs font-medium text-slate-500">Comprehensive environment monitoring</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SensorCard
            icon={<Droplet size={20} />}
            label="Water pH"
            value={pH.toFixed(2)}
            unit="pH"
            sub="Optical sensor · Optimal 6.8 – 8.2 range"
            history={sensorHistory('pH')}
            color="#f43f5e"
            status={pH < 6.8 || pH > 8.2 ? 'bad' : 'good'}
            lastSync="0.2 s"
          />
          <SensorCard
            icon={<Thermometer size={20} />}
            label="Temperature"
            value={temp.toFixed(1)}
            unit="°C"
            sub="High-precision DS18B20 · Depth 0.5 m"
            history={sensorHistory('temp')}
            color="#fb923c"
            status={temp > 32 || temp < 18 ? 'bad' : 'good'}
            lastSync="0.2 s"
          />
          <SensorCard
            icon={<Waves size={20} />}
            label="Turbidity"
            value={turbidity.toFixed(0)}
            unit="NTU"
            sub="Infrared light scatter · 880 nm wavelength"
            history={sensorHistory('turbidity')}
            color="#eab308"
            status={turbidity > 30 ? 'warn' : 'good'}
            lastSync="0.2 s"
          />
          <SensorCard
            icon={<Wind size={20} />}
            label="Dissolved O₂"
            value={oxygen.toFixed(1)}
            unit="mg/L"
            sub="Polarographic probe · Auto-aeration active"
            history={sensorHistory('oxygen')}
            color="#34d399"
            status={oxygen < 5 ? 'warn' : 'good'}
            lastSync="0.5 s"
          />
          <SensorCard
            icon={<Radar size={20} />}
            label="Obstacle Range"
            value={trash.obstacle}
            unit="cm"
            sub="Ultrasonic proximity · Safety brake enabled"
            history={trash.history}
            color="#a78bfa"
            status={trash.obstacle < 40 ? 'warn' : 'good'}
            lastSync="0.3 s"
          />
          <SensorCard
            icon={<Trash2 size={20} />}
            label="Debris Status"
            value={trash.detected ? 'DETECTED' : 'CLEAR'}
            unit=""
            sub="Vision-based debris identification in sweep zone"
            history={trash.history}
            color="#f472b6"
            status={trash.detected ? 'warn' : 'good'}
            lastSync="0.3 s"
          />
        </div>
      </section>

      {/* Bottom section: Alerts + Power */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="border-gradient glass flex flex-col rounded-2xl p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-bold text-white">Active System Alerts</h3>
              <p className="text-[11px] text-slate-500">Latest automated diagnostics</p>
            </div>
            <span className="rounded-full bg-rose-500/15 px-3 py-1 text-[10px] font-black tracking-widest text-rose-400 ring-1 ring-rose-500/20">
              {alerts.filter((a) => a.level === 'critical').length} CRITICAL
            </span>
          </div>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-4 rounded-xl border p-4 transition-all hover:bg-white/5 ${
                  a.level === 'critical'
                    ? 'border-rose-500/20 bg-rose-500/5'
                    : a.level === 'warning'
                      ? 'border-amber-500/20 bg-amber-500/5'
                      : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  a.level === 'critical' ? 'bg-rose-500/20 text-rose-400' : a.level === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-aqua-500/20 text-aqua-300'
                }`}>
                  <AlertTriangle size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white">{a.title}</p>
                    <span className="font-mono text-[9px] font-bold text-slate-600">{a.time}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{a.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border-gradient glass flex flex-col rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-white">
              <BatteryCharging size={18} className="text-aqua-400" /> Power Management
            </h3>
            <p className="text-[11px] text-slate-500">Smart Li-ion power monitoring</p>
          </div>

          <div className="flex-1 space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-display text-4xl font-black tracking-tight text-white">{battery}%</p>
                <p className="mt-1 text-[11px] font-bold text-slate-500">11.1 V NOMINAL · 3S2P</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg font-bold text-aqua-400">{(battery * 0.111).toFixed(1)} V</p>
                <p className="text-[10px] font-bold text-slate-500">~4h 20m REMAINING</p>
              </div>
            </div>

            <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-900 ring-1 ring-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${battery}%` }}
                className="h-full rounded-full bg-gradient-to-r from-aqua-600 via-aqua-400 to-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'ESC 1', status: 'NOMINAL', color: 'text-emerald-400' },
                { label: 'ESC 2', status: 'NOMINAL', color: 'text-emerald-400' },
                { label: 'SERVO 1', status: 'IDLE', color: 'text-slate-500' },
                { label: 'SERVO 2', status: 'IDLE', color: 'text-slate-500' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                  <p className={`mt-1 font-mono text-[10px] font-black ${s.color}`}>{s.status}</p>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-8 w-full rounded-xl bg-white/5 py-3 text-xs font-black uppercase tracking-widest text-slate-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
            System Diagnostics
          </button>
        </div>
      </section>
    </div>
  )
}
