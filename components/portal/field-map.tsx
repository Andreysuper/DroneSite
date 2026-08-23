import { cn } from '@/lib/utils'
import type { MapVariant } from '@/lib/portal/types'

/* ---------------------------------------------------------------------------
 * Deterministic pseudo-random helpers.
 * The same (seed, variant) pair always renders the exact same map, so field
 * cards, detail pages and reports stay visually consistent between renders
 * and between server and client.
 * ------------------------------------------------------------------------ */

function hashSeed(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Index-addressed noise. This is intentionally *stateless*: value `n` depends
 * only on the seed and `n`, never on how many times the function was called
 * before. A stateful counter would make every layer's geometry depend on the
 * order layers happened to render in, which desynchronises SSR from hydration.
 */
type Rand = (n: number) => number

function makeRandom(seed: string): Rand {
  const base = hashSeed(seed) || 1
  return (n: number) => {
    let t = (base + n * 0x6d2b79f5) >>> 0
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Irregular closed blob used for vigour / stress / prescription zones.
 * `slot` reserves a unique block of the noise sequence for this shape.
 */
function blobPath(
  rand: Rand,
  slot: number,
  cx: number,
  cy: number,
  radius: number,
  points = 9,
) {
  const coords: Array<[number, number]> = []
  for (let i = 0; i < points; i += 1) {
    const angle = (i / points) * Math.PI * 2
    const r = radius * (0.62 + rand(slot * 16 + i) * 0.58)
    coords.push([cx + Math.cos(angle) * r * 1.35, cy + Math.sin(angle) * r])
  }
  // Closed Catmull-Rom-ish smoothing via quadratic midpoints.
  let d = ''
  for (let i = 0; i < coords.length; i += 1) {
    const [x, y] = coords[i]
    const [nx, ny] = coords[(i + 1) % coords.length]
    const mx = (x + nx) / 2
    const my = (y + ny) / 2
    d += i === 0 ? `M ${mx} ${my}` : ` Q ${x} ${y} ${mx} ${my}`
  }
  return `${d} Z`
}

/* Scientific palettes. These are data-visualisation ramps rather than brand
 * colours, so they are intentionally defined locally. */
const NDVI_RAMP = [
  '#8c2d12',
  '#c2410c',
  '#d97706',
  '#eab308',
  '#a3b823',
  '#4d9a2a',
  '#256d2a',
  '#14532d',
]
const HEALTH_RAMP = ['#166534', '#3f8f2e', '#84a814', '#c98a08', '#b45309']
const TREATMENT_RAMP = ['#0c4a52', '#116169', '#1c7f6b', '#2f9e5f', '#57b046']

type FieldMapViewProps = {
  variant: MapVariant
  /** Any stable string (field id, report id) — drives the generated geometry. */
  seed: string
  className?: string
  /** Renders a subtle north arrow + scale bar. */
  showDecorations?: boolean
}

export function FieldMapView({
  variant,
  seed,
  className,
  showDecorations = false,
}: FieldMapViewProps) {
  const rand = makeRandom(`${seed}:${variant}`)
  const uid = `${variant}-${hashSeed(seed).toString(36)}`

  // Field boundary — a slightly irregular quadrilateral so it reads as a real
  // surveyed parcel rather than a perfect rectangle.
  const inset = 16
  const jitter = (n: number) => (rand(n) - 0.5) * 14
  const boundary = [
    [inset + jitter(0), inset + jitter(1)],
    [400 - inset + jitter(2), inset + jitter(3) * 0.6],
    [400 - inset + jitter(4) * 0.8, 300 - inset + jitter(5)],
    [inset + jitter(6), 300 - inset + jitter(7) * 0.6],
  ]
  const boundaryPath = `M ${boundary.map(([x, y]) => `${x} ${y}`).join(' L ')} Z`

  return (
    <svg
      viewBox="0 0 400 300"
      className={cn('size-full', className)}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${variant.toUpperCase()} field map`}
    >
      <defs>
        <clipPath id={`clip-${uid}`}>
          <path d={boundaryPath} />
        </clipPath>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2417" />
          <stop offset="100%" stopColor="#131a12" />
        </linearGradient>
      </defs>

      {/* Surrounding terrain */}
      <rect width="400" height="300" fill={`url(#sky-${uid})`} />
      {Array.from({ length: 26 }).map((_, i) => (
        <circle
          key={`grain-${i}`}
          cx={rand(100 + i * 3) * 400}
          cy={rand(101 + i * 3) * 300}
          r={rand(102 + i * 3) * 26 + 6}
          fill="#2a3522"
          opacity={0.35}
        />
      ))}

      <g clipPath={`url(#clip-${uid})`}>
        {variant === 'rgb' && <RgbLayer rand={rand} />}
        {variant === 'ndvi' && <RampLayer rand={rand} ramp={NDVI_RAMP} />}
        {variant === 'health' && <RampLayer rand={rand} ramp={HEALTH_RAMP} />}
        {variant === 'coverage' && <CoverageLayer rand={rand} uid={uid} />}
        {variant === 'treatment' && <TreatmentLayer rand={rand} />}
        {variant === 'problem' && <ProblemLayer rand={rand} />}
      </g>

      {/* Surveyed boundary */}
      <path
        d={boundaryPath}
        fill="none"
        stroke="#f5f1e6"
        strokeOpacity={0.85}
        strokeWidth={2}
        strokeDasharray={variant === 'rgb' ? undefined : '7 5'}
      />

      {showDecorations && (
        <g opacity={0.8}>
          <path
            d="M 372 40 L 377 26 L 382 40 L 377 35 Z"
            fill="#f5f1e6"
            opacity={0.9}
          />
          <rect x="340" y="276" width="44" height="3" fill="#f5f1e6" />
          <rect x="340" y="272" width="2" height="10" fill="#f5f1e6" />
          <rect x="382" y="272" width="2" height="10" fill="#f5f1e6" />
        </g>
      )}
    </svg>
  )
}

/* ----------------------------- variant layers ---------------------------- */

function RgbLayer({ rand }: { rand: Rand }) {
  const rowGap = 7
  return (
    <>
      <rect width="400" height="300" fill="#4a6b1f" />
      {/* soil / vigour mottling */}
      {Array.from({ length: 9 }).map((_, i) => (
        <path
          key={`mottle-${i}`}
          d={blobPath(
            rand,
            60 + i,
            rand(300 + i * 4) * 400,
            rand(301 + i * 4) * 300,
            34 + rand(302 + i * 4) * 46,
          )}
          fill={rand(303 + i * 4) > 0.5 ? '#5c7f26' : '#3d5a19'}
          opacity={0.55}
        />
      ))}
      {/* crop rows */}
      {Array.from({ length: Math.ceil(300 / rowGap) }).map((_, i) => (
        <rect
          key={`row-${i}`}
          x="0"
          y={i * rowGap}
          width="400"
          height={2.4}
          fill="#6f9430"
          opacity={0.4}
        />
      ))}
      {/* sprayer tramlines */}
      {[64, 148, 232].map((y) => (
        <rect
          key={`tram-${y}`}
          x="0"
          y={y}
          width="400"
          height={3}
          fill="#8a7a4a"
          opacity={0.75}
        />
      ))}
      {/* shelterbelt + access road */}
      <rect x="0" y="0" width="400" height="13" fill="#24401c" />
      <rect x="0" y="286" width="400" height="14" fill="#8d7c5b" />
    </>
  )
}

function RampLayer({
  rand,
  ramp,
}: {
  rand: Rand
  ramp: readonly string[]
}) {
  const zones = Array.from({ length: 16 }).map((_, i) => ({
    cx: rand(400 + i * 4) * 400,
    cy: rand(401 + i * 4) * 300,
    r: 38 + rand(402 + i * 4) * 62,
    color: ramp[Math.floor(rand(403 + i * 4) * ramp.length)],
  }))
  return (
    <>
      <rect width="400" height="300" fill={ramp[Math.floor(ramp.length / 2)]} />
      {zones.map((z, i) => (
        <path
          key={`zone-${i}`}
          d={blobPath(rand, 80 + i, z.cx, z.cy, z.r)}
          fill={z.color}
          opacity={0.78}
        />
      ))}
      {/* faint tramline structure so it still reads as farmland */}
      {[70, 150, 230].map((y) => (
        <rect
          key={`tl-${y}`}
          x="0"
          y={y}
          width="400"
          height={1.6}
          fill="#0b0f08"
          opacity={0.25}
        />
      ))}
    </>
  )
}

function CoverageLayer({
  rand,
  uid,
}: {
  rand: Rand
  uid: string
}) {
  const swathH = 17
  const rows = Math.ceil(300 / swathH)
  return (
    <>
      <rect width="400" height="300" fill="#232c1c" />
      {Array.from({ length: 7 }).map((_, i) => (
        <path
          key={`base-${i}`}
          d={blobPath(
            rand,
            120 + i,
            rand(500 + i * 3) * 400,
            rand(501 + i * 3) * 300,
            40 + rand(502 + i * 3) * 50,
          )}
          fill="#2f3a24"
          opacity={0.7}
        />
      ))}
      {/* applied swaths, with a deliberate skipped buffer strip */}
      {Array.from({ length: rows }).map((_, i) => {
        const skipped = i === rows - 2
        return (
          <rect
            key={`swath-${uid}-${i}`}
            x={i % 2 === 0 ? 6 : 12}
            y={i * swathH + 2}
            width={i % 2 === 0 ? 388 : 380}
            height={swathH - 3}
            fill={skipped ? 'transparent' : '#2dd4bf'}
            opacity={skipped ? 0 : 0.42}
          />
        )
      })}
      {/* flight centrelines */}
      {Array.from({ length: rows }).map((_, i) =>
        i === rows - 2 ? null : (
          <rect
            key={`line-${i}`}
            x="6"
            y={i * swathH + swathH / 2}
            width="388"
            height="1"
            fill="#5eead4"
            opacity={0.75}
          />
        ),
      )}
    </>
  )
}

function TreatmentLayer({ rand }: { rand: Rand }) {
  const cols = 5
  const rows = 4
  const cw = 400 / cols
  const ch = 300 / rows
  return (
    <>
      <rect width="400" height="300" fill="#0f1a17" />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <rect
            key={`cell-${r}-${c}`}
            x={c * cw}
            y={r * ch}
            width={cw}
            height={ch}
            fill={
              TREATMENT_RAMP[
                Math.floor(
                  rand(600 + r * cols + c) * TREATMENT_RAMP.length,
                )
              ]
            }
            stroke="#0b1210"
            strokeWidth={1.2}
          />
        )),
      )}
    </>
  )
}

function ProblemLayer({ rand }: { rand: Rand }) {
  const patches = Array.from({ length: 5 }).map((_, i) => ({
    cx: 50 + rand(700 + i * 4) * 300,
    cy: 45 + rand(701 + i * 4) * 210,
    r: 24 + rand(702 + i * 4) * 30,
    hot: rand(703 + i * 4) > 0.45,
  }))
  return (
    <>
      <rect width="400" height="300" fill="#3a4433" />
      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={`bg-${i}`}
          d={blobPath(
            rand,
            160 + i,
            rand(800 + i * 3) * 400,
            rand(801 + i * 3) * 300,
            36 + rand(802 + i * 3) * 44,
          )}
          fill="#46523c"
          opacity={0.75}
        />
      ))}
      {patches.map((p, i) => {
        const d = blobPath(rand, 200 + i, p.cx, p.cy, p.r)
        return (
          <g key={`patch-${i}`}>
            <path
              d={d}
              fill={p.hot ? '#dc2626' : '#ea8a0c'}
              opacity={0.55}
            />
            <path
              d={d}
              fill="none"
              stroke={p.hot ? '#fca5a5' : '#fcd34d'}
              strokeWidth={1.8}
              strokeDasharray="5 3"
            />
          </g>
        )
      })}
    </>
  )
}
