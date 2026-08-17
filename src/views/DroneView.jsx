import { useRef, useState } from 'react'
import { Compass, Fish, Trash2, Delete, CircleDot, Pause, MapPin, Navigation } from 'lucide-react'
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
    if (dist > radius) { dx = (dx / dist) * radius; dy = (dy / dist) * radius }
    setPos({ x: clamp(dx / radius), y: clamp(dy / radius) })
  }

  const reset = () => {
    setDragging(false)
    setPos({ x: 0, y: 0 })
    setLog((l) => [{ time: 'now', type: 'sys', msg: 'Throttle neutral · motors idle' }, ...l].slice(0, 8))
  }

  const pushLog = (type, msg) => setLog((l) => [{ time: 'now', type, msg }, ...l].slice(0, 8))
  const fire = (cmd) => { onAction(cmd); pushLog('feed', cmd.label) }

  return (
    <div className="animate-fade-up space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-slate-200">Drone Control</h2>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Manual Mode
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-slate-500/30 bg-slate-700/20 px-3 py-1 text-xs font-medium text-slate-400">
            <Compass size={12} /> 214° · 0.8 m/s
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass flex flex-col items-center rounded-2xl p-6 lg:col-span-2">
          <div className="mb-5 flex w-full items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-slate-200">Motion Controller</h3>
            <label className="flex items-center gap-2 text-xs text-slate-400">
              Speed
              <input type="range" min={10} max={90} value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-24 accent-cyan-400" />
              <span className="font-mono text-sm text-aqua-300">{speed}%</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="relative flex flex-col items-center">
              <svg ref={stickRef} width={230} height={230} className="touch-none cursor-grab select-none active:cursor-grabbing"
                onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true) }}
                onPointerMove={handleMove} onPointerUp={reset} onPointerCancel={reset}>
                <defs>
                  <radialGradient id="padg" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="rgba(34,211,238,0.22)" />
                    <stop offset="100%" stopColor="rgba(34,211,238,0.04)" />
                  </radialGradient>
                </defs>
                <circle cx={115} cy={115} r={105} fill="url(#padg)" stroke="rgba(103,232,249,0.25)" strokeWidth="1.5" strokeDasharray="4 5" />
                <circle cx={115} cy={115} r={78} fill="none" stroke="rgba(103,232,249,0.4)" strokeWidth="1" />
                {[[0,-0.95],[0.95,0],[0,0.95],[-0.95,0]].map(([dx,dy],i) => {
                  const a = ['N','E','S','W'][i]
                  const x = 115+dx*92, y = 115+dy*92
                  return (
                    <g key={a} className="opacity-60">
                      <circle cx={x} cy={y} r={9} fill="rgba(103,232,249,0.12)" />
                      <text x={x} y={y+3.5} textAnchor="middle" fontSize="9" fill="#a5f3fc" fontFamily="JetBrains Mono, monospace" fontWeight="600">{a}</text>
                    </g>
                  )
                })}
                <circle cx={115+pos.x*55} cy={115+pos.y*55} r={30} fill="rgba(34,211,238,0.35)" stroke="#22d3ee" strokeWidth="2"
                  style={{transition: dragging?'none':'transform 0.3s'}} />
                <circle cx={115+pos.x*55} cy={115+pos.y*55} r={13} fill="#22d3ee"
                  style={{transition: dragging?'none':'transform 0.3s'}} />
              </svg>
              <div className="mt-3 font-mono text-xs text-slate-500">
                X <span className="text-aqua-300">{pos.x.toFixed(2)}</span> · Y <span className="text-aqua-300">{pos.y.toFixed(2)}</span> · {dragging ? 'ARMED' : 'NEUTRAL'}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <DpadButton dir="N" onClick={() => pushLog('nav','Heading North · thrust 60%')} />
              <div className="flex gap-2">
                <DpadButton dir="W" onClick={() => pushLog('nav','Turning West')} />
                <DpadButton dir="S" onClick={() => pushLog('nav','Heading South · thrust 60%')} />
                <DpadButton dir="E" onClick={() => pushLog('nav','Turning East')} />
              </div>
              <button className="mt-1 flex items-center gap-1.5 rounded-xl border border-aqua-400/30 bg-aqua-500/10 px-4 py-2 text-xs font-semibold text-aqua-300 transition hover:bg-aqua-500/20"
                onClick={() => pushLog('nav','Auto-return to dock activated')}>
                <Navigation size={13} /> Return Home
              </button>
            </div>
          </div>

          <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: <Fish size={16} />, label: 'Dispense Fish Food', desc: 'Servo hopper · 200 g', color: '#34d399', cmd: 'FEED' },
              { icon: <Trash2 size={16} />, label: 'Pickup Trash', desc: 'Claw scoop deploy', color: '#22d3ee', cmd: 'PICKUP' },
              { icon: <Delete size={16} />, label: 'Empty Bin', desc: 'Dump at collection dock', color: '#f59e0b', cmd: 'EMPTY' },
            ].map((a) => (
              <button key={a.cmd} onClick={() => fire({ cmd: a.cmd, label: `${a.label} triggered` })}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-800/60 p-4 text-left transition hover:-translate-y-0.5 hover:border-white/20 active:scale-[0.98]">
                <span className="relative flex items-center gap-2 font-semibold" style={{ color: a.color }}>{a.icon} {a.label}</span>
                <span className="relative mt-1 block text-[11px] text-slate-500">{a.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-slate-200">
              <MapPin size={15} className="text-aqua-300" /> Mission Status
            </h3>
            <div className="space-y-2.5 text-xs">
              {[
                ['Telemetry link', 'OK · RTT 42 ms', 'text-emerald-400'],
                ['Propulsion', 'Motors idle · ESCs nominal', 'text-slate-300'],
                ['Camera feed', '1280×720 · 12 fps', 'text-slate-300'],
                ['GPS fix', '3D · 6 satellites', 'text-slate-300'],
                ['Last command', lastCommand || '—', 'text-aqua-300'],
              ].map(([k, v, c]) => (
                <div key={k} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
                  <span className="text-slate-500">{k}</span>
                  <span className={`font-mono ${c}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-slate-200">
              <CircleDot size={15} className="text-aqua-300" /> Event Log
            </h3>
            <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
              {log.map((e, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg bg-slate-800/50 px-3 py-2">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: feedColors[e.type] }} />
                  <p className="flex-1 text-[11px] leading-snug text-slate-300">{e.msg}</p>
                  <span className="shrink-0 font-mono text-[9px] text-slate-600">{e.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-slate-200">
                <Pause size={14} className="text-aqua-300" /> Safety
              </h3>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">ENABLED</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>· Auto-hover if link lost &gt; 2 s</li>
              <li>· Obstacle brake &lt; 35 cm</li>
              <li>· No-fly within 2 m of pH probe</li>
              <li>· Emergency kill on battery &lt; 15%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function DpadButton({ dir, onClick }) {
  const deg = { N: 0, E: 90, S: 180, W: 270 }[dir]
  return (
    <button onClick={onClick} className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-800/60 text-slate-300 shadow-lg transition hover:border-aqua-400/40 hover:bg-aqua-500/10 hover:text-aqua-300 active:scale-90">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" transform={`rotate(${deg})`}>
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
