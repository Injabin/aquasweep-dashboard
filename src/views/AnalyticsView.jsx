import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ReferenceLine,
} from 'recharts'
import { TrendingUp, Calendar, Activity, BarChart3, Clock } from 'lucide-react'

const METRICS = {
  pH: { color: '#f43f5e', label: 'pH', unit: '', ref: 7.0 },
  temp: { color: '#fb923c', label: 'Temperature', unit: '°C', ref: 26 },
  turbidity: { color: '#eab308', label: 'Turbidity', unit: 'NTU', ref: 15 },
  oxygen: { color: '#34d399', label: 'Dissolved O₂', unit: 'mg/L', ref: 5.5 },
}

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(15, 23, 42, 0.9)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  fontSize: '11px',
  color: '#f1f5f9',
  backdropFilter: 'blur(10px)',
}

export default function AnalyticsView({ history }) {
  const [range, setRange] = useState('24h')
  const [metric, setMetric] = useState('pH')

  const m = METRICS[metric]
  const data = history

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-500/10 text-aqua-400 ring-1 ring-aqua-400/20">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white">Historical Analytics</h2>
            <p className="text-xs font-medium text-slate-500">Long-term trend analysis and predictive profiles</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-slate-900/50 p-1 ring-1 ring-white/5">
          {['6h', '24h', '7d', '30d'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                range === r
                  ? 'bg-aqua-500/20 text-aqua-400 ring-1 ring-aqua-400/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Object.entries(METRICS).map(([k, v], i) => {
          const cur = history[history.length - 1]?.[k]
          const prev = history[Math.max(0, history.length - 13)]?.[k]
          const delta = cur != null && prev != null ? cur - prev : 0
          const good = Math.abs(delta) < 0.6
          return (
            <motion.div
              key={k}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="border-gradient glass flex flex-col rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{v.label}</p>
                <div className={`flex h-6 w-6 items-center justify-center rounded-md ${good ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  <TrendingUp size={14} />
                </div>
              </div>
              <p className="mt-2 font-display text-2xl font-bold tabular-nums text-white">
                {cur}
                <span className="ml-1 text-xs font-bold text-slate-500">{v.unit}</span>
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`font-mono text-[10px] font-bold ${delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-slate-600">VS 6H AGO</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Main trend chart */}
      <div className="border-gradient glass rounded-2xl p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-aqua-400" />
            <h3 className="font-display text-sm font-bold text-white">
              {m.label} Time-Series Analysis
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(METRICS).map((k) => (
              <button
                key={k}
                onClick={() => setMetric(k)}
                className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  metric === k ? 'text-slate-950' : 'bg-white/5 text-slate-500 hover:text-slate-300 ring-1 ring-white/10'
                }`}
                style={metric === k ? { background: METRICS[k].color } : undefined}
              >
                {METRICS[k].label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="t" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} minTickGap={50} tick={{ fill: '#64748b', fontWeight: 600 }} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} tick={{ fill: '#64748b', fontWeight: 600 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              <ReferenceLine y={m.ref} stroke={m.color} strokeDasharray="4 4" strokeOpacity={0.3} label={{ value: 'OPTIMAL', fontSize: 9, fill: m.color, position: 'insideTopRight', fontWeight: 900, letterSpacing: '0.1em' }} />
              <Line type="monotone" dataKey={metric} stroke={m.color} strokeWidth={3} dot={false} activeDot={{ r: 6, fill: m.color, stroke: '#fff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Area chart */}
        <div className="border-gradient glass flex flex-col rounded-2xl p-8 lg:col-span-2">
          <div className="mb-8">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-white">
              <Calendar size={16} className="text-aqua-400" /> Multi-Variable Daily Profile
            </h3>
            <p className="mt-1 text-[11px] text-slate-500">Correlating pH stability with thermal oscillation</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gpH" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb923c" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="t" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} minTickGap={50} tick={{ fill: '#64748b', fontWeight: 600 }} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} yAxisId="left" tick={{ fill: '#64748b', fontWeight: 600 }} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontWeight: 600 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 700 }} />
                <Area yAxisId="left" type="monotone" dataKey="pH" stroke="#f43f5e" strokeWidth={2} fill="url(#gpH)" name="pH LEVEL" />
                <Area yAxisId="right" type="monotone" dataKey="temp" stroke="#fb923c" strokeWidth={2} fill="url(#gTemp)" name="TEMP °C" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly comparison bar chart */}
        <div className="border-gradient glass flex flex-col rounded-2xl p-8">
          <div className="mb-8">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-white">
              <TrendingUp size={16} className="text-aqua-400" /> Weekly Delta
            </h3>
            <p className="mt-1 text-[11px] text-slate-500">Comparative efficiency vs previous period</p>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekCompare} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontWeight: 600 }} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontWeight: 600 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 700 }} />
                <Bar dataKey="this" fill="#22d3ee" radius={[4, 4, 0, 0]} name="CURRENT" />
                <Bar dataKey="last" fill="rgba(148,163,184,0.1)" radius={[4, 4, 0, 0]} name="PREVIOUS" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

const weekCompare = [
  { day: 'MON', this: 7.1, last: 7.2 },
  { day: 'TUE', this: 6.9, last: 7.0 },
  { day: 'WED', this: 6.7, last: 7.1 },
  { day: 'THU', this: 6.6, last: 6.9 },
  { day: 'FRI', this: 6.5, last: 7.0 },
  { day: 'SAT', this: 6.6, last: 6.8 },
  { day: 'SUN', this: 6.5, last: 7.0 },
]
