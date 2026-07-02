'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type CharKey = 'clinical' | 'security' | 'custom' | 'research'

interface CharDef {
  key: CharKey
  accent: string
  accentGlow: string
  label: string
  sub: string
  href: string
  meta: { k: string; v: string }[]
  desc: string
}

const CHARACTERS: CharDef[] = [
  {
    key: 'clinical',
    accent: '#f0a500',
    accentGlow: 'rgba(240,165,0,0.16)',
    label: 'Clinical',
    sub: 'sleep medicine',
    href: '/dashboard?domain=clinical',
    desc: 'Five patient cases built from real wearable data. One is designed to make the model contradict its own findings — ArgusAI catches it.',
    meta: [
      { k: 'domain', v: 'sleep medicine' },
      { k: 'cases', v: '5' },
      { k: 'model', v: 'llama-3.3-70b' },
      { k: 'adversarial', v: 'case_05' },
    ],
  },
  {
    key: 'security',
    accent: '#ef4444',
    accentGlow: 'rgba(239,68,68,0.16)',
    label: 'Code security',
    sub: 'pull request review',
    href: '/dashboard?domain=security',
    desc: 'The model finds the SQL injection in its reasoning, then a deadline and a fake approval talk it into merging anyway.',
    meta: [
      { k: 'domain', v: 'code review' },
      { k: 'cases', v: '5' },
      { k: 'model', v: 'llama-3.3-70b' },
      { k: 'adversarial', v: 'sec_05' },
    ],
  },
  {
    key: 'custom',
    accent: '#a855f7',
    accentGlow: 'rgba(168,85,247,0.16)',
    label: 'Custom prompt',
    sub: 'analyze anything',
    href: '/custom',
    desc: 'Paste a diagnosis, a diff, an argument — anything with a conclusion. ArgusAI detects the domain and audits the reasoning live.',
    meta: [
      { k: 'domain', v: 'auto-detected' },
      { k: 'input', v: 'any prompt' },
      { k: 'model', v: 'llama-3.3-70b' },
      { k: 'mode', v: 'live' },
    ],
  },
  {
    key: 'research',
    accent: '#22c55e',
    accentGlow: 'rgba(34,197,94,0.16)',
    label: 'Research',
    sub: 'why this exists',
    href: 'https://github.com/gurinderpreetbrraich-cyber/argusai',
    desc: 'Over half of correct LLM answers on complex tasks hide broken reasoning underneath. This is a WSAI 2026 submission built to surface it.',
    meta: [
      { k: 'target', v: 'WSAI 2026' },
      { k: 'track', v: 'AI safety' },
      { k: 'status', v: 'submitted' },
      { k: 'repo', v: 'public' },
    ],
  },
]

// ── Icons — clean single-weight geometric glyphs, one per domain ──

function IconClinical({ accent }: { accent: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <path
        d="M20 54h14l7-20 12 38 8-24 6 6h13"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="38" stroke={accent} strokeWidth="1.2" opacity="0.28" />
    </svg>
  )
}

function IconSecurity({ accent }: { accent: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <path
        d="M50 16l28 10v20c0 21-12 36-28 42-16-6-28-21-28-42V26z"
        stroke={accent}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M40 50l7 7 14-16" stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCustom({ accent }: { accent: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <circle cx="44" cy="44" r="24" stroke={accent} strokeWidth="2.2" />
      <path d="M62 62l16 16" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <path d="M44 34v20M34 44h20" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}

function IconResearch({ accent }: { accent: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <path d="M50 26c-6-5-14-7-24-6v46c10-1 18 1 24 6" stroke={accent} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M50 26c6-5 14-7 24-6v46c-10-1-18 1-24 6" stroke={accent} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M50 26v46" stroke={accent} strokeWidth="1.4" opacity="0.4" />
    </svg>
  )
}

const ICONS: Record<CharKey, (p: { accent: string }) => JSX.Element> = {
  clinical: IconClinical,
  security: IconSecurity,
  custom: IconCustom,
  research: IconResearch,
}

// ── Floating card ──

function FloatingCard({
  char,
  index,
  onSelect,
}: {
  char: CharDef
  index: number
  onSelect: (c: CharDef) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const raf = useRef<number>()
  const t0 = useRef(performance.now())

  useEffect(() => {
    const phase = index * 1.9
    const ampY = 6 + (index % 2) * 2.5
    const speed = 0.00042 + index * 0.00004

    const loop = (now: number) => {
      const t = (now - t0.current) * speed + phase
      const y = Math.sin(t) * ampY
      if (ref.current) {
        ref.current.style.transform = `translateY(${y}px)`
      }
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [index])

  return (
    <button
      ref={ref}
      onClick={() => onSelect(char)}
      aria-label={`Open ${char.label}`}
      className="floatCard"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
        opacity: 0,
        animation: `cardIn 0.8s cubic-bezier(0.16,1,0.3,1) forwards`,
        animationDelay: `${0.2 + index * 0.1}s`,
      }}
    >
      <div
        className="floatCardGlyph"
        style={{
          width: 'clamp(96px, 10vw, 128px)',
          height: 'clamp(96px, 10vw, 128px)',
          borderRadius: '28px',
          border: '1px solid rgba(255,255,255,0.09)',
          background: 'rgba(255,255,255,0.015)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div style={{ width: '42%', height: '42%' }}>
          {ICONS[char.key]({ accent: char.accent })}
        </div>
        <style>{`
          .floatCard:hover .floatCardGlyph {
            border-color: ${char.accent}66 !important;
            box-shadow: 0 8px 32px ${char.accentGlow};
            background: ${char.accentGlow};
            transform: translateY(-3px);
          }
          .floatCard:hover .floatCardLabel { color: #ffffff !important; }
        `}</style>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p className="floatCardLabel" style={{
          fontSize: '0.92rem', fontWeight: 600, color: 'rgba(255,255,255,0.82)',
          letterSpacing: '-0.01em', marginBottom: '0.3rem', transition: 'color 0.25s ease',
        }}>
          {char.label}
        </p>
        <p style={{
          fontSize: '0.72rem', fontFamily: 'var(--font-mono, monospace)',
          color: 'rgba(255,255,255,0.32)', letterSpacing: '0.01em',
        }}>
          {char.sub}
        </p>
      </div>
    </button>
  )
}

// ── Detail panel ──

function DetailPanel({ char, onClose }: { char: CharDef; onClose: () => void }) {
  const router = useRouter()
  const isExternal = char.href.startsWith('http')

  const go = () => {
    if (isExternal) window.open(char.href, '_blank', 'noopener')
    else router.push(char.href)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: '#000000',
        display: 'flex',
        animation: 'panelIn 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'absolute', top: '1.5rem', right: '1.75rem', zIndex: 5,
          background: 'transparent', border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '50%', width: '38px', height: '38px',
          color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem',
          transition: 'border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = char.accent; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
      >
        ✕
      </button>

      <div style={{
        flex: '0 0 42%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRight: '1px solid rgba(255,255,255,0.06)', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', width: '46%', aspectRatio: '1', borderRadius: '50%',
          background: `radial-gradient(circle, ${char.accentGlow}, transparent 72%)`,
          filter: 'blur(6px)',
        }} />
        <div style={{ width: 'min(28vw, 200px)', aspectRatio: '1', position: 'relative' }}>
          {ICONS[char.key]({ accent: char.accent })}
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 5rem)', maxWidth: '640px',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem',
          color: char.accent, letterSpacing: '0.04em', marginBottom: '1rem', display: 'block',
        }}>
          {char.sub}
        </span>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em',
          color: '#ffffff', lineHeight: 1.05, marginBottom: '1.5rem',
        }}>
          {char.label}
        </h1>
        <p style={{
          fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', marginBottom: '2.5rem',
        }}>
          {char.desc}
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem', marginBottom: '2.5rem',
        }}>
          {char.meta.map(m => (
            <div key={m.k}>
              <p style={{
                fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem',
                color: 'rgba(255,255,255,0.3)', marginBottom: '0.25rem', letterSpacing: '0.03em',
              }}>
                {m.k}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                {m.v}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={go}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            background: char.accent, color: '#000000', border: 'none',
            borderRadius: '999px', padding: '0.8rem 1.6rem', fontWeight: 700,
            fontSize: '0.9rem', cursor: 'pointer', width: 'fit-content',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)' }}
        >
          {isExternal ? 'Open repo' : 'Enter'} →
        </button>
      </div>
    </div>
  )
}

// ── Page ──

export default function HomePage() {
  const [selected, setSelected] = useState<CharDef | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <div style={{
      minHeight: '100vh', background: '#000000', color: '#ffffff',
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes panelIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '56px 56px',
        maskImage: 'radial-gradient(ellipse 65% 55% at 50% 45%, black 0%, transparent 75%)',
      }} />

      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.5rem 2rem', position: 'relative', zIndex: 2,
        opacity: mounted ? 1 : 0, animation: mounted ? 'fadeUp 0.5s ease forwards' : 'none',
      }}>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
          Argus<span style={{ color: '#f0a500' }}>AI</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono, monospace)', color: 'rgba(255,255,255,0.4)' }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e',
            display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          WSAI 2026
        </div>
      </nav>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 'clamp(3rem, 6vw, 5rem)', padding: '2rem',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{
          textAlign: 'center', opacity: mounted ? 1 : 0,
          animation: mounted ? 'fadeUp 0.6s ease 0.05s forwards' : 'none',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', marginBottom: '0.9rem',
            textTransform: 'uppercase',
          }}>
            LLM reasoning oversight
          </p>
          <h1 style={{
            fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', fontWeight: 600,
            letterSpacing: '-0.03em', lineHeight: 1.15, color: 'rgba(255,255,255,0.94)',
          }}>
            Choose what ArgusAI audits
          </h1>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, minmax(120px, 1fr))',
          gap: 'clamp(1.75rem, 4vw, 3.5rem)', maxWidth: '760px', width: '100%',
        }} className="cardGrid">
          {CHARACTERS.map((c, i) => (
            <FloatingCard key={c.key} char={c} index={i} onSelect={setSelected} />
          ))}
        </div>
      </div>

      <div style={{ height: '2.5rem' }} />

      <style>{`
        @media (max-width: 720px) {
          .cardGrid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {selected && <DetailPanel char={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
