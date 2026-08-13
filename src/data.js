export const SPECIES = [
  {
    id: 'carp',
    name: 'Carp',
    image: '🐟',
    ideal: { pH: 7.2, temp: 25, turbidity: 10, oxygen: 6, ammonia: 0.05, nitrite: 0.5 },
    ranges: {
      pH: [6.8, 7.6],
      temp: [22, 28],
      turbidity: [0, 20],
      oxygen: [5, 8],
      ammonia: [0, 0.1],
      nitrite: [0, 1.0],
    },
    growthDays: 210,
    maxWeightKg: 4.2,
    description: 'Hardy, bottom-feeding freshwater fish tolerant of low oxygen but sensitive to rapid pH swings.',
  },
  {
    id: 'tilapia',
    name: 'Tilapia',
    image: '🐠',
    ideal: { pH: 7.4, temp: 28, turbidity: 15, oxygen: 5.5, ammonia: 0.1, nitrite: 0.75 },
    ranges: {
      pH: [7.0, 8.0],
      temp: [25, 31],
      turbidity: [0, 25],
      oxygen: [4.5, 7],
      ammonia: [0, 0.2],
      nitrite: [0, 1.5],
    },
    growthDays: 150,
    maxWeightKg: 1.5,
    description: 'Fast-growing warm-water species. Thrives on plant-based feed and tolerates higher ammonia.',
  },
  {
    id: 'catfish',
    name: 'Catfish',
    image: '🐱‍🐟',
    ideal: { pH: 7.0, temp: 27, turbidity: 25, oxygen: 5, ammonia: 0.15, nitrite: 0.6 },
    ranges: {
      pH: [6.5, 7.6],
      temp: [24, 30],
      turbidity: [0, 40],
      oxygen: [4, 6.5],
      ammonia: [0, 0.3],
      nitrite: [0, 1.2],
    },
    growthDays: 180,
    maxWeightKg: 2.8,
    description: 'Dense-stocking champion. Sturdy and omnivorous, best suited to turbid pond conditions.',
  },
  {
    id: 'rohu',
    name: 'Rohu',
    image: '🎏',
    ideal: { pH: 7.4, temp: 27, turbidity: 18, oxygen: 6, ammonia: 0.08, nitrite: 0.4 },
    ranges: {
      pH: [7.0, 7.9],
      temp: [24, 30],
      turbidity: [0, 30],
      oxygen: [5, 8],
      ammonia: [0, 0.15],
      nitrite: [0, 0.8],
    },
    growthDays: 200,
    maxWeightKg: 3.5,
    description: 'Indian major carp feeding on plankton. Prefers clean water with rich natural feed.',
  },
]

export const WATER_HISTORY = (() => {
  const rows = []
  const now = Date.now()
  let pH = 7.1
  let temp = 26
  let turb = 14
  for (let i = 47; i >= 0; i--) {
    pH = clamp(pH + rand(-0.04, 0.04), 6.4, 7.4)
    temp = clamp(temp + rand(-0.15, 0.15), 23.5, 28.5)
    turb = clamp(turb + rand(-0.8, 0.8), 6, 32)
    const d = new Date(now - i * 3 * 3600 * 1000)
    rows.push({
      t: d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' }),
      time: d.getTime(),
      pH: round(pH),
      temp: round(temp),
      turbidity: round(turb),
      oxygen: round(clamp(5.2 + (7 - pH) * 0.6 + rand(-0.2, 0.2), 3.5, 7.5)),
    })
  }
  return rows
})()

export const DAILY_ALERTS = [
  {
    level: 'critical',
    title: 'pH dropping below safe threshold',
    detail: 'pH at 6.51. Model projects 85% probability of critical fish mortality within 48h without intervention.',
    time: '2 min ago',
  },
  {
    level: 'warning',
    title: 'Turbidity rising rapidly',
    detail: '+9 NTU in the last hour. Possible silt inflow or waste accumulation near the inlet.',
    time: '18 min ago',
  },
  {
    level: 'info',
    title: 'Feeding cycle completed',
    detail: '1.5 kg feed dispensed via scheduled routine at 09:00. Consumption rate nominal.',
    time: '1 h ago',
  },
]

export const LOG_FEED = [
  { time: '09:41', type: 'nav', msg: 'Waypoint WP-04 reached · trash pickup triggered' },
  { time: '09:38', type: 'sensor', msg: 'Bin fullness at 78% — unload advised on return' },
  { time: '09:31', type: 'feed', msg: 'Feed dispensed · 1.5 kg · servo OK' },
  { time: '09:12', type: 'sensor', msg: 'pH dip detected (7.02 → 6.78) · auto re-check armed' },
  { time: '08:57', type: 'nav', msg: 'Obstacle cleared · clearance 38 cm' },
  { time: '08:40', type: 'sys', msg: 'Telemetry link re-established · RTT 42 ms' },
]

function rand(min, max) {
  return Math.random() * (max - min) + min
}
function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}
function round(v) {
  return Math.round(v * 100) / 100
}
