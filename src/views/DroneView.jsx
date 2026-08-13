import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, Fish, Trash2, Delete, CircleDot, Pause, MapPin, Navigation, Cpu, Activity } from 'lucide-react'
import { LOG_FEED } from '../data'

const feedColors = { nav: '#22d3ee', sensor: '#eab308', feed: '#34d399', sys: '#a78bfa' }

export default function DroneView({ onAction, lastCommand }) {
  const stickRef = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [speed, setSpeed] = useState(45)
  const [log, setLog] = useState(LOG_FEED)

  const radius = 78
  const clamp = (v) => Math.min(1, Math.max(-1, v))

  const handleMove = (e) => {
    if (!dragging || !stickRef.current) return
    const rect = stickRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    let dx = e.clientX - cx
    let dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)
    if (dist > radius) {
      dx = (dx / dist) * radius
      dy = (dy / dist) * radius
    }
    setPos({ x: clamp(dx / radius), y: clamp(dy / radius) })
  }

  const reset = () => {
    setDragging(false)
    setPos({ x: 0, y: 0 })
    setLog((l) => [{ time: 'now', type: 'sys', msg: 'Throttle neutral · motors idle' }, ...l].slice(0, 8))
  }

  const pushLog = (type, msg) => setLog((l) => [{ time: 'now', type, msg }, ...l].slice(0, 8))

  const fire = (cmd) => {
    onAction(cmd)
    pushLog('feed', cmd.label)
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-400/20">
            <Cpu size={20} />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white">Manual Drone Interface</h2>
            <p className="text-xs font-medium text-slate-500">Low-latency direct propulsion and actuator control</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 ring-1 ring-emerald-500/30">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Manual Mode</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 ring-1 ring-white/10">
            <Compass size={14} className="text-slate-400" />
            <span className="font-mono text-[11px] font-bold text-slate-300">214° NW · 0.8 M/S</span>
          </div>
        </div>
      </div>

      {/* Simulated Camera Feed */}
      <section className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl lg:aspect-[21/9]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-black/40" />
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="animate-scan absolute inset-0 bg-gradient-to-b from-transparent via-aqua-400/20 to-transparent h-1/2 w-full" />
        </div>
        
        {/* HUD Elements */}
        <div className="absolute inset-0 flex flex-col justify-between p-8 font-mono pointer-events-none">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-aqua-400 font-bold text-sm">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                REC 00:14:42:09
              </div>
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">CAM-01 · LENS 14MM</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-white uppercase tracking-widest">Telemetry Link</div>
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Signal Peak · 42ms RTT</div>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            {/* Crosshair */}
            <div className="relative h-48 w-48 border border-white/5 rounded-full flex items-center justify-center">
              <div className="absolute h-[1px] w-8 bg-aqua-400/60 left-0" />
              <div className="absolute h-[1px] w-8 bg-aqua-400/60 right-0" />
              <div className="absolute w-[1px] h-8 bg-aqua-400/60 top-0" />
              <div className="absolute w-[1px] h-8 bg-aqua-400/60 bottom-0" />
              <div className="h-1 w-1 bg-aqua-400 rounded-full" />
              
              {/* Dynamic indicators based on joystick */}
              <motion.div 
                animate={{ x: pos.x * 20, y: pos.y * 20 }}
                className="absolute h-4 w-4 border-2 border-aqua-400 rounded-sm"
              />
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden ring-1 ring-white/5">
                  <motion.div 
                    animate={{ width: `${60 + pos.y * 40}%` }}
                    className="h-full bg-aqua-400"
                  />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Pitch Control</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden ring-1 ring-white/5">
                  <motion.div 
                    animate={{ width: `${50 + pos.x * 50}%` }}
                    className="h-full bg-aqua-400"
                  />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Yaw/Roll Axis</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-500 uppercase">Alt MSL</div>
                <div className="text-xl font-bold text-white tabular-nums">0.82M</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-500 uppercase">Spd Gnd</div>
                <div className="text-xl font-bold text-white tabular-nums">1.2KT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scanlines overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Joystick + d-pad */}
        <div className="border-gradient glass flex flex-col items-center rounded-2xl p-8 lg:col-span-2">
          <div className="mb-10 flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-aqua-400" />
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-widest">Motion Controller</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Throttle</span>
                <span className="font-mono text-xs font-black text-aqua-400">{speed}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="w-32 accent-aqua-400"
              />
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center justify-around gap-12">
            <div className="relative flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-aqua-400/5 blur-3xl" />
                <svg
                  ref={stickRef}
                  width={240}
                  height={240}
                  className="touch-none cursor-grab select-none active:cursor-grabbing relative z-10"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId)
                    setDragging(true)
                  }}
                  onPointerMove={handleMove}
                  onPointerUp={reset}
                  onPointerCancel={reset}
                >
                  <circle cx={120} cy={120} r={110} fill="rgba(15,23,42,0.4)" stroke="rgba(103,232,249,0.15)" strokeWidth="2" strokeDasharray="4 8" />
                  <circle cx={120} cy={120} r={85} fill="none" stroke="rgba(103,232,249,0.25)" strokeWidth="1" />
                  {[
                    [0, -1.05, 'N'],
                    [1.05, 0, 'E'],
                    [0, 1.05, 'S'],
                    [-1.05, 0, 'W'],
                  ].map(([dx, dy, a]) => {
                    const x = 120 + dx * 95
                    const y = 120 + dy * 95
                    return (
                      <g key={a} className="opacity-40">
                        <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fill="#a5f3fc" fontFamily="JetBrains Mono" fontWeight="800">
                          {a}
                        </text>
                      </g>
                    )
                  })}
                  <motion.circle
                    cx={120 + pos.x * 60}
                    cy={120 + pos.y * 60}
                    r={35}
                    fill="rgba(34,211,238,0.2)"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    animate={dragging ? {} : { cx: 120, cy: 120 }}
                    transition={{ type: 'spring', damping: 15 }}
                  />
                  <motion.circle
                    cx={120 + pos.x * 60}
                    cy={120 + pos.y * 60}
                    r={12}
                    fill="#22d3ee"
                    animate={dragging ? {} : { cx: 120, cy: 120 }}
                    transition={{ type: 'spring', damping: 12 }}
                  />
                </svg>
              </div>
              <div className="mt-8 flex gap-4 font-mono text-[10px] font-bold uppercase">
                <span className="text-slate-500">X-AXIS <span className="text-aqua-400">{pos.x.toFixed(2)}</span></span>
                <span className="text-slate-500">Y-AXIS <span className="text-aqua-400">{pos.y.toFixed(2)}</span></span>
                <span className={dragging ? 'text-rose-400 animate-pulse' : 'text-slate-600'}>{dragging ? 'ARMED' : 'NEUTRAL'}</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <DpadButton dir="N" onClick={() => pushLog('nav', 'Heading North · thrust 60%')} />
              <div className="flex gap-3">
                <DpadButton dir="W" onClick={() => pushLog('nav', 'Turning West')} />
                <DpadButton dir="S" onClick={() => pushLog('nav', 'Heading South · thrust 60%')} />
                <DpadButton dir="E" onClick={() => pushLog('nav', 'Turning East')} />
              </div>
              <button
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-aqua-400/20 bg-aqua-400/5 px-6 py-3.5 text-[11px] font-black uppercase tracking-widest text-aqua-400 transition hover:bg-aqua-400/10 active:scale-95 ring-1 ring-aqua-400/30"
                onClick={() => pushLog('nav', 'Auto-return to dock activated')}
              >
                <Navigation size={14} /> Return Home
              </button>
            </div>
          </div>

          {/* Action triggers */}
          <div className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            <ActionButton
              icon={<Fish size={18} />}
              label="DISPENSE FOOD"
              desc="Hopper-A · 200g Load"
              color="#34d399"
              onClick={() => fire({ cmd: 'FEED', label: 'Fish food dispensed · 200 g' })}
            />
            <ActionButton
              icon={<Trash2 size={18} />}
              label="DEPLOY CLAW"
              desc="Actuator-C · Precision"
              color="#22d3ee"
              onClick={() => fire({ cmd: 'PICKUP', label: 'Trash scoop deployed · grabber closed' })}
            />
            <ActionButton
              icon={<Delete size={18} />}
              label="EMPTY BIN"
              desc="Collection Dock-01"
              color="#fb923c"
              onClick={() => fire({ cmd: 'EMPTY', label: 'Trash bin emptied at dock' })}
            />
          </div>
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-6">
          <div className="border-gradient glass rounded-2xl p-6">
            <h3 className="mb-5 flex items-center gap-3 font-display text-sm font-bold text-white uppercase tracking-widest">
              <MapPin size={16} className="text-aqua-400" /> Mission Status
            </h3>
            <div className="space-y-4">
              {[
                { k: 'Telemetry Link', v: 'NOMINAL · 42ms', c: 'text-emerald-400' },
                { k: 'Propulsion', v: 'IDLE · 0.0A', c: 'text-slate-400' },
                { k: 'Vision Feed', v: '1080P · 24FPS', c: 'text-slate-300' },
                { k: 'GPS Lock', v: '3D · 8 SATS', c: 'text-slate-300' },
                { k: 'Last Action', v: lastCommand || 'NONE', c: 'text-aqua-400' },
              ].map((item) => (
                <div key={item.k} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.k}</span>
                  <span className={`font-mono text-[11px] font-bold ${item.c}`}>{item.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-gradient glass flex flex-1 flex-col rounded-2xl p-6 overflow-hidden">
            <h3 className="mb-5 flex items-center gap-3 font-display text-sm font-bold text-white uppercase tracking-widest">
              <CircleDot size={16} className="text-aqua-400" /> Event Feed
            </h3>
            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {log.map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/5"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: feedColors[e.type] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] leading-tight text-slate-300 font-medium">{e.msg}</p>
                    <span className="mt-1 block font-mono text-[9px] text-slate-600 font-bold uppercase tracking-widest">{e.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="border-gradient glass rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-3 font-display text-sm font-bold text-white uppercase tracking-widest">
                <Pause size={16} className="text-aqua-400" /> Fail-Safes
              </h3>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black tracking-widest text-emerald-400 ring-1 ring-emerald-500/20">ACTIVE</span>
            </div>
            <div className="space-y-2">
              {['Auto-hover on link loss', 'Obstacle collision brake', 'Geofence hard-boundary', 'Low-battery return-to-home'].map((s) => (
                <div key={s} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  <div className="h-1 w-1 rounded-full bg-aqua-400" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DpadButton({ dir, onClick }) {
  const deg = { N: 0, E: 90, S: 180, W: 270 }[dir]
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-slate-900/80 text-slate-400 shadow-2xl transition hover:border-aqua-400/40 hover:text-aqua-400 ring-1 ring-white/10 active:bg-aqua-400/10"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform={`rotate(${deg})`}>
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </motion.button>
  )
}

function ActionButton({ icon, label, desc, color, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-5 text-left transition hover:border-white/10 ring-1 ring-white/10 active:bg-white/5"
    >
      <div
        className="absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ background: color }}
      />
      <div className="relative flex items-center gap-3 font-black text-[11px] tracking-widest" style={{ color }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
          {icon}
        </div>
        {label}
      </div>
      <p className="relative mt-3 block text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{desc}</p>
    </motion.button>
  )
}
