const STROKE = '#22d3ee'
const STROKE_DIM = 'rgba(34,211,238,0.35)'

export function CarpIcon({ size = 48, color = STROKE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path d="M22 42 C22 30, 36 18, 58 16 C72 15, 86 18, 94 24 L98 28 L100 32 L100 48 L98 52 L94 56 C86 62, 72 65, 58 64 C36 62, 22 54, 22 42Z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      {/* Head detail */}
      <path d="M22 42 C20 40, 16 40, 14 42 C12 44, 12 46, 14 48 C16 50, 20 50, 22 48"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="32" cy="38" r="3.5" stroke={color} strokeWidth="1.2" />
      <circle cx="33" cy="37.5" r="1.2" fill={color} />
      {/* Mouth */}
      <path d="M14 44 L18 43" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      {/* Barbels (carp characteristic) */}
      <path d="M18 46 C14 50, 10 52, 8 50" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      <path d="M20 48 C16 52, 12 54, 10 52" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      {/* Dorsal fin */}
      <path d="M50 18 C52 12, 58 8, 66 10 C72 12, 76 14, 78 16"
        stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M54 17 L56 12" stroke={color} strokeWidth="0.6" opacity="0.4" />
      <path d="M58 16 L60 11" stroke={color} strokeWidth="0.6" opacity="0.4" />
      <path d="M62 16 L64 12" stroke={color} strokeWidth="0.6" opacity="0.4" />
      <path d="M66 16 L67 13" stroke={color} strokeWidth="0.6" opacity="0.4" />
      <path d="M70 16 L71 14" stroke={color} strokeWidth="0.6" opacity="0.4" />
      {/* Pectoral fin */}
      <path d="M34 46 C30 52, 26 56, 24 54 C22 52, 26 48, 32 44"
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Pelvic fin */}
      <path d="M50 56 C48 60, 46 64, 44 62 C42 60, 44 58, 48 54"
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Anal fin */}
      <path d="M74 58 C76 62, 80 64, 82 62 C84 60, 82 58, 78 56"
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Caudal fin (tail) */}
      <path d="M96 30 C100 26, 106 22, 110 20" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M96 50 C100 54, 106 58, 110 60" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M98 40 L112 40" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* Scale pattern */}
      <path d="M44 32 C48 30, 52 30, 56 32" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M44 36 C48 34, 52 34, 56 36" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M44 40 C48 38, 52 38, 56 40" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M52 32 C56 30, 60 30, 64 32" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M52 36 C56 34, 60 34, 64 36" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M52 40 C56 38, 60 38, 64 40" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M60 32 C64 30, 68 30, 72 32" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M60 36 C64 34, 68 34, 72 36" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M60 40 C64 38, 68 38, 72 40" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M44 44 C48 42, 52 42, 56 44" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M52 44 C56 42, 60 42, 64 44" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M60 44 C64 42, 68 42, 72 44" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      {/* Lateral line */}
      <path d="M34 40 C44 40, 54 39, 64 40 C74 41, 84 40, 92 40" stroke={STROKE_DIM} strokeWidth="0.7" strokeDasharray="2 3" />
    </svg>
  )
}

export function TilapiaIcon({ size = 48, color = STROKE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body — deeper/rounder tilapia shape */}
      <path d="M24 44 C24 28, 38 16, 56 14 C70 13, 84 16, 92 22 L96 26 L98 30 L98 50 L96 54 L92 58 C84 64, 70 67, 56 66 C38 64, 24 60, 24 44Z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      {/* Head */}
      <path d="M24 44 C22 42, 18 42, 16 44 C14 46, 14 48, 16 50 C18 52, 22 52, 24 50"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Eye — larger for tilapia */}
      <circle cx="32" cy="38" r="4" stroke={color} strokeWidth="1.2" />
      <circle cx="33.5" cy="37.5" r="1.5" fill={color} />
      {/* Mouth */}
      <path d="M16 46 L20 45" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      {/* Dorsal fin — long spiny dorsal (tilapia characteristic) */}
      <path d="M40 16 C44 8, 52 6, 62 8 C70 10, 76 12, 80 14"
        stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M42 15 L44 9" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <path d="M46 14 L48 8" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <path d="M50 14 L52 9" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <path d="M54 14 L56 9" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <path d="M58 14 L60 10" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <path d="M62 14 L63 11" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <path d="M66 14 L67 12" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <path d="M70 14 L71 13" stroke={color} strokeWidth="0.5" opacity="0.5" />
      {/* Soft dorsal */}
      <path d="M76 14 C78 14, 80 14, 82 15" stroke={color} strokeWidth="0.8" fill="none" opacity="0.5" />
      {/* Pectoral fin */}
      <path d="M32 48 C28 54, 24 58, 22 56 C20 54, 24 50, 30 46"
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Pelvic fin (inserted high — tilapia trait) */}
      <path d="M42 44 C40 50, 38 54, 36 52 C34 50, 36 46, 40 42"
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Anal fin — with spines */}
      <path d="M70 58 C72 62, 76 64, 78 62 C80 60, 78 58, 74 56"
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Caudal fin — slightly truncate for tilapia */}
      <path d="M94 30 C98 26, 104 22, 108 20" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M94 50 C98 54, 104 58, 108 60" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M96 40 L110 40" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* Vertical bars (tilapia marking) */}
      <path d="M42 26 L42 54" stroke={STROKE_DIM} strokeWidth="0.5" opacity="0.3" />
      <path d="M50 24 L50 56" stroke={STROKE_DIM} strokeWidth="0.5" opacity="0.3" />
      <path d="M58 22 L58 58" stroke={STROKE_DIM} strokeWidth="0.5" opacity="0.3" />
      <path d="M66 24 L66 56" stroke={STROKE_DIM} strokeWidth="0.5" opacity="0.3" />
      <path d="M74 26 L74 54" stroke={STROKE_DIM} strokeWidth="0.5" opacity="0.3" />
      {/* Scale hint */}
      <path d="M48 34 C52 32, 56 32, 60 34" stroke={STROKE_DIM} strokeWidth="0.4" fill="none" />
      <path d="M56 34 C60 32, 64 32, 68 34" stroke={STROKE_DIM} strokeWidth="0.4" fill="none" />
      <path d="M48 40 C52 38, 56 38, 60 40" stroke={STROKE_DIM} strokeWidth="0.4" fill="none" />
      <path d="M56 40 C60 38, 64 38, 68 40" stroke={STROKE_DIM} strokeWidth="0.4" fill="none" />
      {/* Lateral line */}
      <path d="M34 40 C44 40, 54 39, 64 40 C74 41, 84 40, 90 40" stroke={STROKE_DIM} strokeWidth="0.7" strokeDasharray="2 3" />
    </svg>
  )
}

export function CatfishIcon({ size = 48, color = STROKE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body — elongated catfish shape */}
      <path d="M18 42 C18 34, 28 24, 46 20 C60 18, 78 18, 90 22 L96 26 L100 32 L100 48 L96 54 L90 58 C78 62, 60 62, 46 60 C28 56, 18 50, 18 42Z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      {/* Head — flattened, broad */}
      <path d="M18 42 C14 40, 8 40, 6 42 C4 44, 4 46, 6 48 C8 50, 14 50, 18 48"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Eye — small (catfish characteristic) */}
      <circle cx="26" cy="38" r="2.5" stroke={color} strokeWidth="1" />
      <circle cx="27" cy="37.5" r="1" fill={color} />
      {/* Long maxillary barbels (catfish signature) */}
      <path d="M12 44 C8 42, 2 38, -2 36" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <path d="M12 46 C8 46, 2 44, -2 42" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      {/* Mandibular barbels */}
      <path d="M10 48 C8 52, 4 56, 0 58" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      <path d="M12 48 C10 52, 6 56, 2 58" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      <path d="M14 48 C12 52, 8 54, 4 54" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      {/* Mouth — wide, subterminal */}
      <path d="M8 46 C10 48, 14 48, 16 46" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      {/* Dorsal fin — short, high (catfish trait) */}
      <path d="M44 22 C46 14, 50 12, 54 14" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M46 20 L48 14" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <path d="M50 19 L51 14" stroke={color} strokeWidth="0.5" opacity="0.5" />
      {/* Adipose fin (catfish characteristic) */}
      <path d="M64 18 C66 16, 72 16, 76 18" stroke={color} strokeWidth="0.8" fill="none" opacity="0.5" />
      {/* Pectoral fins — prominent spines */}
      <path d="M30 48 C26 54, 22 60, 20 58 C18 56, 22 50, 28 44"
        stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M28 46 L22 58" stroke={color} strokeWidth="0.5" opacity="0.4" />
      {/* Pelvic fin */}
      <path d="M50 56 C48 60, 46 62, 44 60 C42 58, 44 56, 48 54"
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Anal fin — long */}
      <path d="M66 58 C68 62, 74 66, 80 64 C84 62, 86 60, 84 58 C80 56, 72 56, 68 56"
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Caudal fin — forked */}
      <path d="M96 30 C100 24, 106 18, 110 16" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M96 50 C100 56, 106 62, 110 64" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M98 38 L108 34" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
      <path d="M98 42 L108 46" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
      {/* Smooth skin texture (no scales) — subtle lateral line */}
      <path d="M28 40 C38 39, 50 38, 62 39 C74 40, 86 40, 96 40" stroke={STROKE_DIM} strokeWidth="0.6" strokeDasharray="3 4" />
    </svg>
  )
}

export function RohuIcon({ size = 48, color = STROKE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body — streamlined, torpedo-like rohu */}
      <path d="M20 42 C20 32, 32 20, 52 16 C66 14, 82 16, 92 22 L98 26 L102 32 L102 48 L98 54 L92 58 C82 64, 66 66, 52 64 C32 60, 20 52, 20 42Z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      {/* Head */}
      <path d="M20 42 C18 40, 14 40, 12 42 C10 44, 10 46, 12 48 C14 50, 18 50, 20 48"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="28" cy="38" r="3" stroke={color} strokeWidth="1.2" />
      <circle cx="29" cy="37.5" r="1.2" fill={color} />
      {/* Mouth — terminal, slightly downturned */}
      <path d="M12 44 L16 43" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <path d="M12 46 L16 46" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
      {/* No barbels (rohu has none) */}
      {/* Dorsal fin — high, falcate */}
      <path d="M46 18 C48 10, 54 8, 60 10 C64 12, 68 14, 72 16"
        stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M50 17 L52 11" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <path d="M54 16 L56 10" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <path d="M58 16 L59 11" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <path d="M62 16 L63 12" stroke={color} strokeWidth="0.5" opacity="0.5" />
      <path d="M66 16 L67 13" stroke={color} strokeWidth="0.5" opacity="0.5" />
      {/* Pectoral fin */}
      <path d="M30 46 C26 52, 22 56, 20 54 C18 52, 22 48, 28 44"
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Pelvic fin */}
      <path d="M48 54 C46 58, 44 62, 42 60 C40 58, 42 56, 46 52"
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Anal fin */}
      <path d="M72 56 C74 60, 78 62, 80 60 C82 58, 80 56, 76 54"
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Caudal fin — deeply forked (rohu) */}
      <path d="M98 28 C102 22, 108 16, 112 14" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M98 52 C102 58, 108 64, 112 66" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M100 40 L114 40" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
      {/* Scale pattern — rohu has prominent scales */}
      <path d="M40 30 C44 28, 48 28, 52 30" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M40 34 C44 32, 48 32, 52 34" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M40 38 C44 36, 48 36, 52 38" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M40 42 C44 40, 48 40, 52 42" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M40 46 C44 44, 48 44, 52 46" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M50 28 C54 26, 58 26, 62 28" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M50 32 C54 30, 58 30, 62 32" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M50 36 C54 34, 58 34, 62 36" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M50 40 C54 38, 58 38, 62 40" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M50 44 C54 42, 58 42, 62 44" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M60 28 C64 26, 68 26, 72 28" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M60 32 C64 30, 68 30, 72 32" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M60 36 C64 34, 68 34, 72 36" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M60 40 C64 38, 68 38, 72 40" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      <path d="M60 44 C64 42, 68 42, 72 44" stroke={STROKE_DIM} strokeWidth="0.5" fill="none" />
      {/* Lateral line — prominent */}
      <path d="M30 40 C40 39, 52 38, 64 39 C76 40, 88 40, 98 40" stroke={STROKE_DIM} strokeWidth="0.8" strokeDasharray="2 2" />
    </svg>
  )
}

export function GenericFishIcon({ size = 48, color = STROKE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 42 C22 30, 36 18, 58 16 C72 15, 86 18, 94 24 L98 28 L100 32 L100 48 L98 52 L94 56 C86 62, 72 65, 58 64 C36 62, 22 54, 22 42Z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M22 42 C20 40, 16 40, 14 42 C12 44, 12 46, 14 48 C16 50, 20 50, 22 48"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="32" cy="38" r="3" stroke={color} strokeWidth="1.2" />
      <circle cx="33" cy="37.5" r="1" fill={color} />
      <path d="M14 44 L18 43" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <path d="M48 18 C50 10, 58 8, 66 10 C72 12, 76 14, 78 16"
        stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M32 46 C28 52, 24 56, 22 54 C20 52, 24 48, 30 44"
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M96 30 C100 26, 106 22, 110 20" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M96 50 C100 54, 106 58, 110 60" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M34 40 C44 40, 54 39, 64 40 C74 41, 84 40, 92 40" stroke={STROKE_DIM} strokeWidth="0.6" strokeDasharray="2 3" />
    </svg>
  )
}
