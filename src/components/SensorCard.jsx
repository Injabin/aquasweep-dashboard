import { motion } from 'framer-motion'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

export default function SensorCard({ icon, label, value, unit, sub, history = [], color = '#22d3ee', status = 'good', lastSync = '0s' }) {
  const chartData = history.map((v, i) => ({ v, i }))

  const statusColors = {
    good: 'bg-emerald-500/10 text-emerald-400 ring-emerald-400/20',
    warn: 'bg-amber-500/10 text-amber-400 ring-amber-400/20',
    bad: 'bg-rose-500/10 text-rose-400 ring-rose-400/20',
  }

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="group border-gradient glass relative flex flex-col overflow-hidden rounded-2xl p-6"
    >
      {/* Dynamic Glow Overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at top right, ${color}, transparent)` }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-300 ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
            {icon}
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400 transition-colors">{label}</h3>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-black tabular-nums text-white tracking-tight">{value}</span>
              <span className="text-xs font-bold text-slate-500">{unit}</span>
            </div>
          </div>
        </div>
        <div className={`rounded-full px-2.5 py-1 text-[9px] font-black tracking-widest ring-1 ${statusColors[status]}`}>
          {status.toUpperCase()}
        </div>
      </div>

      <div className="relative z-10 mt-5 flex-1">
        <p className="text-[11px] font-medium leading-relaxed text-slate-400 line-clamp-2 group-hover:text-slate-300 transition-colors">
          {sub}
        </p>
      </div>

      {/* Sparkline with more contrast */}
      <div className="absolute inset-x-0 bottom-0 h-20 opacity-40 group-hover:opacity-60 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={3}
              fill={`url(#grad-${label})`}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">SYNC: {lastSync}</span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1 w-4 rounded-full transition-all duration-300 ${
                i <= (status === 'good' ? 3 : status === 'warn' ? 2 : 1) 
                  ? 'bg-aqua-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' 
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

