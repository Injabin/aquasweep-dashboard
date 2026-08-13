import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'
import { Fish, BrainCircuit, AlertTriangle, Sparkles, ShieldAlert, Droplets, Zap, ShieldCheck } from 'lucide-react'
import { SPECIES } from '../data'

const METRIC_LABELS = {
  pH: 'pH',
  temp: 'Temp °C',
  turbidity: 'Turbidity NTU',
  oxygen: 'O₂ mg/L',
  ammonia: 'NH₃ mg/L',
  nitrite: 'NO₂ mg/L',
}

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(15, 23, 42, 0.9)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  fontSize: '11px',
  color: '#f1f5f9',
  backdropFilter: 'blur(10px)',
}

export default function FungAiView({ telemetry }) {
  const [speciesId, setSpeciesId] = useState('carp')
  const [intervention, setIntervention] = useState('pH buffer dosing')
  const species = SPECIES.find((s) => s.id === speciesId)

  const current = {
    pH: telemetry.pH,
    temp: telemetry.temp,
    turbidity: telemetry.turbidity,
    oxygen: telemetry.oxygen,
    ammonia: 0.18,
    nitrite: 0.9,
  }

  const radarData = (() => {
    const norm = (key) => {
      const ideal = species.ideal[key]
      const [lo, hi] = species.ranges[key]
      const span = hi - lo
      const normVal = Math.max(0, Math.min(1, 1 - Math.abs(current[key] - ideal) / span))
      return Math.round(normVal * 100)
    }
    return Object.keys(METRIC_LABELS).map((k) => ({
      metric: METRIC_LABELS[k],
      ideal: 100,
      current: norm(k),
    }))
  })()

  const outOfRange = Object.keys(METRIC_LABELS).filter((k) => {
    const [lo, hi] = species.ranges[k]
    return current[k] < lo || current[k] > hi
  })

  const severity = outOfRange.length >= 3 ? 'critical' : outOfRange.length >= 1 ? 'warning' : 'healthy'
  const riskPct = Math.min(94, 20 + outOfRange.length * 22 + (telemetry.pH < 6.7 ? 15 : 0))

  const barData = Object.keys(METRIC_LABELS).map((k) => ({
    metric: METRIC_LABELS[k],
    ideal: species.ideal[k],
    current: current[k],
    range: species.ranges[k],
  }))

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-400/20">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white">FungAi Aquaculture Core</h2>
            <p className="text-xs font-medium text-slate-500">Neural-net predictive modelling and species optimization</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-slate-900/50 px-4 py-2 ring-1 ring-white/10">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-aqua-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Model: PG-V2.4</span>
          </div>
          <span className="text-white/10">|</span>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Conf: 87%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Species selector + radar */}
        <div className="border-gradient glass flex flex-col rounded-2xl p-6 lg:col-span-2">
          <div className="mb-6">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-widest">Species Target Profile</h3>
            <p className="text-[11px] text-slate-500 mt-1">Select active stock for specialized risk analysis</p>
          </div>
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SPECIES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSpeciesId(s.id)}
                className={`rounded-xl border p-3 text-center transition-all ${
                  speciesId === s.id
                    ? 'border-aqua-400/50 bg-aqua-400/10 text-aqua-400 ring-1 ring-aqua-400/30'
                    : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                }`}
              >
                <span className="block text-2xl mb-1">{s.image}</span>
                <span className="block text-[10px] font-black uppercase tracking-widest">{s.name}</span>
              </button>
            ))}
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="CURRENT" dataKey="current" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} strokeWidth={3} />
                  <Radar name="IDEAL" dataKey="ideal" stroke="#10b981" fill="none" strokeWidth={2} strokeDasharray="4 4" />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2 text-aqua-400">
                <span className="h-1.5 w-4 rounded bg-aqua-400" /> Current state
              </span>
              <span className="flex items-center gap-2 text-emerald-500">
                <span className="h-1.5 w-4 rounded bg-emerald-500/50 border border-emerald-500/50 border-dashed" /> Ideal band
              </span>
            </div>
          </div>
        </div>

        {/* Ideal vs current comparison */}
        <div className="border-gradient glass flex flex-col rounded-2xl p-6 lg:col-span-2">
          <div className="mb-6">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-widest">Precision Alignment</h3>
            <p className="text-[11px] text-slate-500 mt-1">Parameter delta vs species-specific optimums</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 10 }}>
                <XAxis type="number" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontWeight: 600 }} />
                <YAxis type="category" dataKey="metric" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} width={85} tick={{ fill: '#f1f5f9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="current" name="CURRENT" radius={[0, 4, 4, 0]} barSize={14}>
                  {barData.map((d, i) => {
                    const [lo, hi] = d.range
                    const ok = d.current >= lo && d.current <= hi
                    return <Cell key={i} fill={ok ? '#22d3ee' : '#f43f5e'} />
                  })}
                </Bar>
                <Bar dataKey="ideal" name="IDEAL" fill="rgba(16,185,129,0.15)" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {Object.entries(METRIC_LABELS).map(([k, label]) => {
              const [lo, hi] = species.ranges[k]
              const ok = current[k] >= lo && current[k] <= hi
              return (
                <div key={k} className={`flex items-center justify-between rounded-xl px-4 py-3 ring-1 ${ok ? 'bg-white/5 ring-white/5' : 'bg-rose-500/10 ring-rose-500/20'}`}>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</span>
                  <span className={`font-mono text-[11px] font-bold ${ok ? 'text-slate-200' : 'text-rose-400'}`}>
                    {current[k]} <span className="text-[9px] text-slate-600 ml-1">({lo}-{hi})</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Predictive alert system */}
      <motion.div
        layout
        className={`border-gradient glass-strong relative overflow-hidden rounded-3xl p-8 ${
          severity === 'critical' ? 'ring-2 ring-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.15)]' : severity === 'warning' ? 'ring-2 ring-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.1)]' : ''
        }`}
      >
        <div className="grid-bg absolute inset-0 opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-10">
          <div className="flex-1 flex items-start gap-6">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-xl ${
              severity === 'critical' ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30' : severity === 'warning' ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
            }`}>
              {severity === 'critical' ? <ShieldAlert size={32} /> : severity === 'warning' ? <AlertTriangle size={32} /> : <Sparkles size={32} />}
            </div>
            <div className="max-w-2xl">
              <h3 className="font-display text-2xl font-black text-white tracking-tight">
                {severity === 'critical'
                  ? 'CRITICAL ECO-SYSTEM COLLAPSE RISK'
                  : severity === 'warning'
                    ? 'ADVERSE ENVIRONMENTAL TREND DETECTED'
                    : 'ECO-SYSTEM HARMONY MAINTAINED'}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400 font-medium">
                {severity === 'critical'
                  ? `Immediate intervention required. pH levels at ${telemetry.pH.toFixed(2)} are below critical survival threshold for ${species.name}. Predictive models suggest exponential stress increase within 4 hours.`
                  : severity === 'warning'
                    ? `Deterioration detected in ${outOfRange.length} parameters. Negative trends in ${outOfRange.map((k) => METRIC_LABELS[k]).join(', ')} indicate a developing stress event. Monitor closely.`
                    : `Optimal conditions confirmed. ${species.name} metabolism is peak for current growth day. No environmental stressors identified in active window.`}
              </p>
              
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-xl bg-gradient-to-r from-aqua-500 to-cyan-400 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-950 shadow-xl shadow-aqua-500/25 transition hover:brightness-110 active:scale-95">
                  Execute Intervention
                </button>
                <button className="rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-white/10 active:scale-95">
                  Regenerate Model
                </button>
                <button className="rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-white/10 active:scale-95">
                  Export Diagnostics
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 rounded-3xl bg-slate-950/60 p-8 ring-1 ring-white/10 min-w-[240px]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">48H Mortality Risk</p>
            <div className="relative flex items-center justify-center">
              <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={severity === 'critical' ? '#f43f5e' : severity === 'warning' ? '#fb923c' : '#10b981'}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 40) * (1 - riskPct / 100) }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`font-display text-4xl font-black ${severity === 'critical' ? 'text-rose-400' : severity === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {riskPct}%
                </span>
              </div>
            </div>
            <div className="text-center">
              <p className={`text-[10px] font-black uppercase tracking-widest ${severity === 'critical' ? 'text-rose-400' : 'text-slate-500'}`}>
                {severity === 'critical' ? 'HIGH RISK DETECTED' : 'LOW RISK PROFILE'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 border-t border-white/5 pt-8">
          <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/5">
            <p className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Droplets size={14} className="text-aqua-400" /> AI recommendation
            </p>
            <select
              value={intervention}
              onChange={(e) => setIntervention(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-aqua-400/50"
            >
              <option>pH buffer dosing (sodium bicarbonate)</option>
              <option>Partial water exchange · 20%</option>
              <option>Increase aeration duty cycle</option>
              <option>Reduce feeding rate by 30%</option>
              <option>Add bio-filter / probiotics</option>
            </select>
            <p className="mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Est dose: 1.8 kg · Automated dispatch available</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/5">
            <p className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Zap size={14} className="text-aqua-400" /> Model Intelligence
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                <span className="text-slate-500">TRAINING LOAD</span>
                <span className="text-white">4,100 HRS</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
                <motion.div initial={{ width: 0 }} animate={{ width: '87%' }} className="h-full rounded-full bg-aqua-400" />
              </div>
              <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest">
                <span>Last Retrain: 3D Ago</span>
                <span className="text-aqua-400">V2.4 Stable</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/5">
            <p className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Fish size={14} className="text-aqua-400" /> Stock Profile
            </p>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase">Growth Stage</span>
                <span className="text-xs font-bold text-white">Day {species.growthDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase">Est. Weight</span>
                <span className="text-xs font-bold text-aqua-400">{(species.maxWeightKg * 0.62).toFixed(1)} kg</span>
              </div>
              <div className="mt-2 rounded-lg bg-emerald-500/10 p-2 text-center ring-1 ring-emerald-500/20">
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Harvest Window: 3-4 Weeks</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
