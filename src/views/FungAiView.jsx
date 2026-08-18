import { useState } from 'react'
import {
  ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts'
import { Fish, BrainCircuit, AlertTriangle, Sparkles, ShieldAlert, Droplets } from 'lucide-react'
import { SPECIES } from '../data'
import { FishArt } from '../components/FishArtwork'

const METRIC_LABELS = { pH: 'pH', temp: 'Temp °C', turbidity: 'Turbidity NTU', oxygen: 'O₂ mg/L', ammonia: 'NH₃ mg/L', nitrite: 'NO₂ mg/L' }
const TOOLTIP_STYLE = { backgroundColor: 'rgba(11, 22, 40, 0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, fontSize: 12, color: '#e2e8f0' }

const DEFAULT_SPECIES = {
  id: 'custom',
  name: '',
  image: '',
  ideal: { pH: 7.0, temp: 26, turbidity: 15, oxygen: 5.5, ammonia: 0.1, nitrite: 0.5 },
  ranges: {
    pH: [6.5, 8.0], temp: [22, 30], turbidity: [0, 30], oxygen: [4, 7],
    ammonia: [0, 0.2], nitrite: [0, 1.0],
  },
  growthDays: 180, maxWeightKg: 2.0,
  description: 'Custom species — enter the name of any farmable fish to run a health assessment against current pond conditions.',
}

export default function FungAiView({ telemetry }) {
  const [speciesId, setSpeciesId] = useState('carp')
  const [customName, setCustomName] = useState('')
  const [intervention, setIntervention] = useState('pH buffer dosing (sodium bicarbonate)')
  const isCustom = speciesId === 'custom'
  const species = isCustom ? { ...DEFAULT_SPECIES, name: customName || 'Unknown Species' } : SPECIES.find((s) => s.id === speciesId)

  const current = { pH: telemetry.pH, temp: telemetry.temp, turbidity: telemetry.turbidity, oxygen: telemetry.oxygen, ammonia: 0.18, nitrite: 0.9 }

  const radarData = (() => {
    const norm = (key) => {
      const ideal = species.ideal[key]
      const [lo, hi] = species.ranges[key]
      return Math.round(Math.max(0, Math.min(1, 1 - Math.abs(current[key] - ideal) / (hi - lo))) * 100)
    }
    return Object.keys(METRIC_LABELS).map((k) => ({ metric: METRIC_LABELS[k], ideal: 100, current: norm(k) }))
  })()

  const outOfRange = Object.keys(METRIC_LABELS).filter((k) => { const [lo, hi] = species.ranges[k]; return current[k] < lo || current[k] > hi })
  const severity = outOfRange.length >= 3 ? 'critical' : outOfRange.length >= 1 ? 'warning' : 'healthy'
  const riskPct = Math.min(94, 20 + outOfRange.length * 22 + (telemetry.pH < 6.7 ? 15 : 0))

  const barData = Object.keys(METRIC_LABELS).map((k) => ({
    metric: METRIC_LABELS[k], ideal: species.ideal[k], current: current[k], range: species.ranges[k],
  }))

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-100">
            <BrainCircuit size={20} className="text-aqua-400" /> FungAi Aquaculture Assistant
          </h2>
          <p className="text-xs text-slate-500">AI-driven species guidance and predictive risk modelling</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-aqua-500/10 px-3 py-1 text-xs font-medium text-aqua-300 ring-1 ring-aqua-400/30">
          Model: pondguard-v2 · <span className="h-1.5 w-1.5 rounded-full bg-aqua-400" />
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="mb-3 font-display text-sm font-semibold text-slate-200">Species Profile</h3>
          <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {SPECIES.map((s) => {
              const sel = speciesId === s.id
              return (
                <button key={s.id} onClick={() => setSpeciesId(s.id)}
                  className={`rounded-xl border px-2 py-3 text-center transition-all duration-300 ${
                    sel
                      ? 'border-cyan-400/90 bg-cyan-950/30 shadow-[0_0_18px_rgba(34,211,238,0.2)] text-aqua-300'
                      : 'border-slate-800/80 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}>
                  <span className="block mx-auto"><FishArt type={s.id} active={sel} className="w-14 h-9" /></span>
                  <span className="mt-1 block text-[11px] font-semibold">{s.name}</span>
                </button>
              )
            })}
            <button onClick={() => setSpeciesId('custom')}
              className={`rounded-xl border px-2 py-3 text-center transition-all duration-300 ${
                isCustom
                  ? 'border-cyan-400/90 bg-cyan-950/30 shadow-[0_0_18px_rgba(34,211,238,0.2)] text-aqua-300'
                  : 'border-slate-800/80 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:bg-slate-900/60'
              }`}>
              <span className="block mx-auto"><FishArt type="custom" active={isCustom} className="w-14 h-9" /></span>
              <span className="mt-1 block text-[11px] font-semibold">Custom</span>
            </button>
          </div>
          {isCustom && (
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Fish size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter any farmable fish species…"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-9 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-aqua-400/40"
                />
              </div>
              <span className="shrink-0 rounded-full bg-aqua-500/10 px-2.5 py-1 text-[10px] font-medium text-aqua-300 ring-1 ring-aqua-400/20">
                AI Ready
              </span>
            </div>
          )}
          <p className="mb-4 text-xs leading-relaxed text-slate-400">{species.description}</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Current" dataKey="current" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Ideal" dataKey="ideal" stroke="#475569" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-5 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-aqua-400" /> Current</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded border-t border-dashed border-slate-500" /> Ideal</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="mb-1 font-display text-sm font-semibold text-slate-200">Ideal vs Current</h3>
          <p className="mb-3 text-[11px] text-slate-500">Actual readings vs optimum for {species.name}</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 10 }}>
                <XAxis type="number" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="metric" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={80} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="current" name="Current" radius={[0, 4, 4, 0]} barSize={12}>
                  {barData.map((d, i) => {
                    const [lo, hi] = d.range
                    return <Cell key={i} fill={d.current >= lo && d.current <= hi ? '#22d3ee' : '#f43f5e'} />
                  })}
                </Bar>
                <Bar dataKey="ideal" name="Ideal" fill="rgba(148,163,184,0.3)" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 grid grid-cols-2 gap-2 text-[11px]">
            {Object.entries(METRIC_LABELS).map(([k, label]) => {
              const [lo, hi] = species.ranges[k]
              const ok = current[k] >= lo && current[k] <= hi
              return (
                <span key={k} className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 ${
                  ok ? 'bg-slate-800/60 text-slate-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {label}
                  <span className="font-mono">{ok ? `${current[k]} (${lo}–${hi})` : `${current[k]} ! ${lo}–${hi}`}</span>
                </span>
              )
            })}
          </div>
        </div>
      </div>

      <div className={`glass relative overflow-hidden rounded-2xl p-6 ${
        severity === 'critical' ? 'ring-2 ring-rose-500/30'
        : severity === 'warning' ? 'ring-1 ring-amber-500/20'
        : ''
      }`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              severity === 'critical' ? 'bg-rose-500/15 text-rose-400'
              : severity === 'warning' ? 'bg-amber-500/15 text-amber-400'
              : 'bg-emerald-500/15 text-emerald-400'
            }`}>
              {severity === 'critical' ? <ShieldAlert size={24} /> : severity === 'warning' ? <AlertTriangle size={24} /> : <Sparkles size={24} />}
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-100">
                {severity === 'critical' ? 'Critical risk zone detected' : severity === 'warning' ? 'Risk factors present' : 'Conditions within safe range'}
              </h3>
              <p className="mt-1 max-w-xl text-sm text-slate-400">
                {severity === 'critical'
                  ? `pH is ${telemetry.pH.toFixed(2)} — below the ${species.name} safe band (${species.ranges.pH[0]}–${species.ranges.pH[1]}). Rising turbidity compounds stress.`
                  : severity === 'warning'
                  ? `${outOfRange.length} parameter(s) out of band: ${outOfRange.map((k) => METRIC_LABELS[k]).join(', ')}. Trending unfavourably over the last 6 hours.`
                  : 'All monitored parameters are within the optimal band for your species.'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-5 text-center ring-1 ring-white/5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Mortality risk · 48 h</p>
            <p className={`font-display text-4xl font-bold ${
              severity === 'critical' ? 'text-rose-400' : severity === 'warning' ? 'text-amber-400' : 'text-emerald-400'
            }`}>{riskPct}%</p>
            <div className="mt-2 h-1.5 w-36 overflow-hidden rounded-full bg-slate-700">
              <div className="h-full rounded-full" style={{ width: `${riskPct}%`, background: 'linear-gradient(90deg, #34d399, #fb923c, #f43f5e)' }} />
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-800/40 p-4 ring-1 ring-white/5">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Droplets size={13} className="text-aqua-300" /> Recommended Intervention
            </p>
            <select value={intervention} onChange={(e) => setIntervention(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-aqua-400/40">
              <option>pH buffer dosing (sodium bicarbonate)</option>
              <option>Partial water exchange · 20%</option>
              <option>Increase aeration duty cycle</option>
              <option>Reduce feeding rate by 30%</option>
              <option>Add bio-filter / probiotics</option>
            </select>
            <p className="mt-2 text-[11px] text-slate-500">Dose estimate: 1.8 kg · auto-dispatch available</p>
          </div>
          <div className="rounded-xl bg-slate-800/40 p-4 ring-1 ring-white/5">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <BrainCircuit size={13} className="text-aqua-300" /> Model Confidence
            </p>
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700">
                <div className="h-full rounded-full bg-gradient-to-r from-aqua-400 to-emerald-400" style={{ width: '87%' }} />
              </div>
              <span className="font-mono text-sm font-semibold text-aqua-300">87%</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Trained on 4,100 pond-hours · last retrain 3 days ago</p>
          </div>
          <div className="rounded-xl bg-slate-800/40 p-4 ring-1 ring-white/5">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Fish size={13} className="text-aqua-300" /> Stock Advisory
            </p>
            <p className="text-sm text-slate-200">
              Growth day {species.growthDays} · est. mean weight <span className="font-mono text-aqua-300">{(species.maxWeightKg * 0.62).toFixed(1)} kg</span>
            </p>
            <p className="mt-2 text-[11px] text-slate-500">Harvest window: 3–4 weeks at current trajectory</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button className="rounded-xl bg-gradient-to-r from-aqua-500 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-aqua-500/20 transition hover:shadow-aqua-500/30">
            Dispatch Drone with Treatment
          </button>
          <button className="rounded-xl border border-white/10 bg-slate-800/60 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20">Re-run Prediction</button>
          <button className="rounded-xl border border-white/10 bg-slate-800/60 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20">Export Health Report</button>
        </div>
      </div>
    </div>
  )
}
