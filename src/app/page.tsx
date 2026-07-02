'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type CardId = 'clinical' | 'security' | 'custom' | 'research'

interface CardDef {
  id: CardId
  label: string
  accent: string
  accentGlow: string
  name: string
  description: string
  meta: { label: string; value: string }[]
  cta: string
  href: string
}

const CARDS: CardDef[] = [
  {
    id: 'clinical',
    label: "no cap, it's sick",
    accent: '#f0a500',
    accentGlow: 'rgba(240,165,0,0.18)',
    name: 'Clinical',
    description:
      'Five sleep-medicine cases, one of them lying to your face. ArgusAI watches the reasoning chain, not the diagnosis — and catches the model when it starts agreeing with a patient over a pulse oximeter.',
    meta: [
      { label: 'domain', value: 'sleep medicine' },
      { label: 'cases', value: '5, one adversarial' },
      { label: 'worst offender', value: 'AHI 52/hr, denied' },
    ],
    cta: 'Enter clinical',
    href: '/dashboard',
  },
  {
    id: 'security',
    label: 'bro just merged it',
    accent: '#ef4444',
    accentGlow: 'rgba(239,68,68,0.18)',
    name: 'Code Security',
    description:
      'A model finds the SQL injection, writes it down clearly, then approves the PR anyway because the description said "CEO approved, ship it." ArgusAI is the reviewer that actually reads its own review.',
    meta: [
      { label: 'domain', value: 'code review' },
      { label: 'cases', value: '5, one adversarial' },
      { label: 'worst offender', value: 'raw SQL, "internal only"' },
    ],
    cta: 'Enter security',
    href: '/dashboard',
  },
  {
    id: 'custom',
    label: 'go off',
    accent: '#a855f7',
    accentGlow: 'rgba(168,85,247,0.18)',
    name: 'Custom',
    description:
      'Paste anything — a case, a diff, a claim someone made with too much confidence. ArgusAI figures out what kind of reasoning it is and audits it live. No presets required.',
    meta: [
      { label: 'domain', value: 'auto-detected' },
      { label: 'input', value: 'any prompt' },
      { label: 'output', value: 'faithfulness + anomalies' },
    ],
    cta: 'Paste something',
    href: '/custom',
  },
  {
    id: 'research',
    label: 'the lore',
    accent: '#22c55e',
    accentGlow: 'rgba(34,197,94,0.18)',
    name: 'Research',
    description:
      'Why this exists: over half of correct model answers on hard tasks hide real reasoning errors underneath. Sounding right and being right are different problems. This is the paper about that gap.',
    meta: [
      { label: 'target', value: 'WSAI 2026, Amsterdam' },
      { label: 'track', value: 'Guardians of Tomorrow' },
      { label: 'status', value: 'in progress' },
    ],
    cta: 'Read the writeup',
    href: 'https://github.com/gurinderpreetbrraich-cyber/argusai',
  },
]

// ── Character SVGs — stroke-based, consistent rig, one accessory each ──
function Character({ id, accent, size = 120 }: { id: CardId; accent: string; size?: number }) {
  const common = {
    fill: 'none',
    stroke: accent,
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: 'visible' }}>
      {/* body */}
      <circle cx="60" cy="64" r="34" {...common} />
      {/* eyes */}
      <circle cx="49" cy="60" r="2.6" fill={accent} stroke="none" />
      <circle cx="71" cy="60" r="2.6" fill={accent} stroke="none" />

      {id === 'clinical' && (
        <>
          {/* stethoscope loop */}
          <path d="M42 40 v-10 a6 6 0 0 1 12 0 v6" {...common} />
          <path d="M66 40 v-10 a6 6 0 0 1 12 0 v10" {...common} />
          <circle cx="78" cy="46" r="5" {...common} />
          {/* content smile */}
          <path d="M50 74 q10 8 20 0" {...common} />
        </>
      )}

      {id === 'security' && (
        <>
          {/* shield accessory above head */}
          <path d="M60 18 l14 5 v9 c0 8 -6 13 -14 16 c-8 -3 -14 -8 -14 -16 v-9 z" {...common} />
          <path d="M54 32 l4 4 l8 -8" {...common} />
          {/* flat/skeptical mouth */}
          <path d="M50 76 h20" {...common} />
        </>
      )}

      {id === 'custom' && (
        <>
          {/* blinking cursor above head */}
          <rect x="55" y="20" width="10" height="16" rx="2" {...common} />
          {/* open curious mouth */}
          <ellipse cx="60" cy="76" rx="6" ry="4" {...common} />
        </>
      )}

      {id === 'research' && (
        <>
          {/* magnifying glass accessory */}
          <circle cx="76" cy="30" r="9" {...common} />
          <path d="M83 37 l8 8" {...common} />
          {/* thoughtful mouth */}
          <path d="M52 76 q8 -4 16 0" {...common} />
        </>
      )}
    </svg>
  )
}

const FLOAT_CONFIGS = [
  { dur: 6.4, delay: 0, driftX: 8, driftY: 14 },
  { dur: 7.2, delay: 0.6, driftX: -10, driftY: 10 },
  { dur: 5.8, delay: 1.1, driftX: 9, driftY: -12 },
  { dur: 6.9, delay: 0.3, driftX: -7, driftY: 12 },
]

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selected, setSelected] = useState<CardDef | null>(null)
  const [hovered, setHovered] = useState<CardId | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', overflow: 'hidden', position: 'relative' }}>
      {/* Nav */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.75rem 2.5rem', opacity: selected ? 0 : 1,
          transition: 'opacity 0.3s ease', pointerEvents: selected ? 'none' : 'auto',
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', letterSpacing: '0.02em', color: 'rgba(255,255,255,0.85)' }}>
          ◈ ArgusAI
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'ai-pulse 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
            WSAI 2026
          </span>
        </div>
      </nav>

      {/* Headline */}
      <div
        style={{
          position: 'absolute', top: '14%', left: 0, right: 0, textAlign: 'center', zIndex: 5,
          opacity: selected ? 0 : mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.3s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: 'none',
        }}
      >
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
          pick your poison
        </p>
      </div>

      {/* Floating cards field */}
      <div
        ref={containerRef}
        style={{
          position: 'relative', minHeight: '100vh',
          display: 'grid', gridTemplateColumns: 'repeat(2, minmax(160px, 220px))',
          gridTemplateRows: 'repeat(2, minmax(160px, 220px))',
          gap: '3.5rem 5rem', alignItems: 'center', justifyContent: 'center',
          placeItems: 'center', padding: '0 1.5rem',
          opacity: selected ? 0 : 1,
          transform: selected ? 'scale(0.96)' : 'scale(1)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          pointerEvents: selected ? 'none' : 'auto',
        }}
        className="argus-grid"
      >
        {CARDS.map((card, i) => {
          const cfg = FLOAT_CONFIGS[i]
          const isHovered = hovered === card.id
          return (
            <button
              key={card.id}
              onClick={() => setSelected(card)}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`${card.name} — ${card.label}`}
              style={{
                position: 'relative',
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '1rem', background: 'transparent', border: 'none', cursor: 'pointer',
                opacity: mounted ? 1 : 0,
                transitionProperty: 'opacity, transform',
                transitionDuration: '0.6s',
                transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                transitionDelay: `${0.15 + i * 0.08}s`,
                transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              }}
            >
              <div
                style={{
                  animation: reducedMotion ? 'none' : `argus-float-${i} ${cfg.dur}s ease-in-out ${cfg.delay}s infinite`,
                  transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), filter 0.35s ease',
                  transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                  filter: isHovered ? `drop-shadow(0 0 22px ${card.accentGlow})` : 'drop-shadow(0 0 0 transparent)',
                }}
              >
                <Character id={card.id} accent={card.accent} />
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.8rem',
                  color: isHovered ? card.accent : 'rgba(255,255,255,0.5)',
                  transition: 'color 0.25s ease',
                  letterSpacing: '-0.01em',
                }}
              >
                {card.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Detail overlay */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 60,
          display: selected ? 'flex' : 'none',
          opacity: selected ? 1 : 0,
          transition: 'opacity 0.35s ease',
          background: '#000',
        }}
      >
        {selected && (
          <>
            {/* Left — character, large */}
            <div
              style={{
                flex: '0 0 42%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRight: '1px solid rgba(255,255,255,0.08)', position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(circle at 50% 50%, ${selected.accentGlow}, transparent 60%)`,
                }}
              />
              <div style={{ animation: 'argus-detail-float 4.5s ease-in-out infinite', position: 'relative' }}>
                <Character id={selected.id} accent={selected.accent} size={220} />
              </div>
            </div>

            {/* Right — info panel */}
            <div
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '4rem clamp(2rem, 6vw, 5rem)', position: 'relative',
              }}
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                style={{
                  position: 'absolute', top: '2rem', right: '2rem',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.78rem', padding: '0.4rem 0.6rem',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >
                esc ✕
              </button>

              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem',
                  color: selected.accent, letterSpacing: '0.02em', marginBottom: '0.75rem',
                }}
              >
                {selected.label}
              </p>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 700,
                  letterSpacing: '-0.03em', marginBottom: '1.25rem', lineHeight: 1.05,
                }}
              >
                {selected.name}
              </h1>
              <p
                style={{
                  fontSize: '1rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.65)',
                  maxWidth: '480px', marginBottom: '2.25rem',
                }}
              >
                {selected.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2.5rem', maxWidth: '420px' }}>
                {selected.meta.map(m => (
                  <div
                    key={m.label}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                      borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem',
                    }}
                  >
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>
                      {m.label}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (selected.href.startsWith('http')) {
                    window.open(selected.href, '_blank', 'noopener')
                  } else {
                    router.push(selected.href)
                  }
                }}
                style={{
                  alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: selected.accent, color: '#000', border: 'none',
                  borderRadius: '6px', padding: '0.7rem 1.4rem', fontWeight: 700,
                  fontSize: '0.875rem', cursor: 'pointer', transition: 'transform 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(3px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(0)')}
              >
                {selected.cta} →
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes ai-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
        @keyframes argus-detail-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes argus-float-0 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(8px,-14px) rotate(-2deg); }
        }
        @keyframes argus-float-1 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(-10px,-10px) rotate(2deg); }
        }
        @keyframes argus-float-2 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(9px,12px) rotate(-1.5deg); }
        }
        @keyframes argus-float-3 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(-7px,-12px) rotate(1.5deg); }
        }
        @media (max-width: 700px) {
          .argus-grid {
            grid-template-columns: repeat(2, minmax(120px, 160px)) !important;
            gap: 2rem 2.5rem !important;
          }
        }
        @media (max-width: 480px) {
          .argus-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: repeat(4, minmax(140px, 160px)) !important;
          }
        }
      `}</style>
    </div>
  )
}
