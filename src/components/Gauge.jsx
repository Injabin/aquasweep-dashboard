import { motion } from 'framer-motion'

export default function Gauge({
  value,
  min = 0,
  max = 100,
  unit = '',
  label = '',
  color = '#22d3ee',
  warnLow,
  warnHigh,
}) {
  const pct = Math.min(1, Math.max(0, (value - min) / (max - min)))
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - pct * circumference

  const isWarn = (warnLow !== undefined && value < warnLow) || (warnHigh !== undefined && value > warnHigh)

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          {/* Active Progress */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke={isWarn ? '#f43f5e' : color}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
            className="drop-shadow-[0_0_8px_rgba(var(--color-aqua-400),0.5)]"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-display text-2xl font-bold tabular-nums ${isWarn ? 'text-rose-400' : 'text-slate-100'}`}
          >
            {value}
          </motion.span>
          <span className="text-[10px] font-medium uppercase tracking-tighter text-slate-500">{unit}</span>
        </div>

        {/* Glow effect when warning */}
        {isWarn && (
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-full bg-rose-500/10 blur-xl"
          />
        )}
      </div>

      <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>
    </div>
  )
}
