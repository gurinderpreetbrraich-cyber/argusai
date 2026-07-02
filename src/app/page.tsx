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
    sub: 'diagnosis vs. ground truth',
    href: '/dashboard?domain=clinical',
    desc: 'Five cases built on real wearable telemetry. Case 5 is adversarial on purpose \u2014 SpO\u2082 82%, AHI 52, patient vibes: \u201cI feel fine.\u201d Watch the model pick a side.',
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
    sub: 'found, then quietly un-found',
    href: '/dashboard?domain=security',
    desc: 'The model spots the SQL injection in its own reasoning trace \u2014 then un-spots it the moment someone says \u201cCTO approved, ship it.\u201d A textbook faithfulness collapse.',
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
    sub: 'bring your own chain-of-thought',
    href: '/custom',
    desc: 'Paste a diagnosis, a diff, an argument \u2014 anything with a verdict attached. Domain auto-detected, reasoning audited, zero config.',
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
    sub: 'the paper behind the panic',
    href: 'https://github.com/gurinderpreetbrraich-cyber/argusai',
    desc: 'Over half of \u201ccorrect\u201d LLM answers on complex tasks hide broken reasoning underneath (ProcessBench, 2025). This is the WSAI 2026 submission built to prove it, one adversarial case at a time.',
    meta: [
      { k: 'target', v: 'WSAI 2026' },
      { k: 'track', v: 'AI safety' },
      { k: 'status', v: 'submitted' },
      { k: 'repo', v: 'public' },
    ],
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Reason',
    desc: 'Groq\u2019s llama-3.3-70b thinks out loud, one step at a time. Every claim, hedge, and vibe-based leap gets logged \u2014 not just the final take.',
  },
  {
    n: '02',
    title: 'Audit',
    desc: 'A second pass cross-examines the first: faithfulness score, contradiction detection, evidence gaps. A peer reviewer that never gets tired and never gets bribed.',
  },
  {
    n: '03',
    title: 'Probe',
    desc: 'For every anomaly, ArgusAI writes the counterfactual question that would expose it \u2014 the \u201cwait, actually\u2014\u201d moment, automated.',
  },
]

// ── Icons ──

function IconClinical({ accent }: { accent: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <path d="M20 54h14l7-20 12 38 8-24 6 6h13" stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="38" stroke={accent} strokeWidth="1.2" opacity="0.28" />
    </svg>
  )
}
function IconSecurity({ accent }: { accent: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <path d="M50 16l28 10v20c0 21-12 36-28 42-16-6-28-21-28-42V26z" stroke={accent} strokeWidth="2.2" strokeLinejoin="round" />
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

function FloatingCard({ char, index, onSelect }: { char: CharDef; index: number; onSelect: (c: CharDef) => void }) {
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
      if (ref.current) ref.current.style.transform = `translateY(${y}px)`
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
        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.4rem',
        opacity: 0, animation: `cardIn 0.8s cubic-bezier(0.16,1,0.3,1) forwards`,
        animationDelay: `${0.2 + index * 0.1}s`,
      }}
    >
      <div
        className="floatCardGlyph"
        style={{
          width: 'clamp(130px, 13vw, 172px)',
          height: 'clamp(130px, 13vw, 172px)',
          borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.09)',
          background: 'rgba(255,255,255,0.015)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div style={{ width: '54%', height: '54%' }}>
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
          fontSize: '1rem', fontWeight: 500, color: 'rgba(255,255,255,0.82)',
          letterSpacing: '-0.01em', marginBottom: '0.3rem', transition: 'color 0.25s ease',
        }}>
          {char.label}
        </p>
        <p style={{
          fontSize: '0.72rem', fontFamily: 'var(--font-mono, monospace)',
          color: 'rgba(255,255,255,0.32)', letterSpacing: '0.01em', maxWidth: '160px', lineHeight: 1.4,
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
  const go = () => { isExternal ? window.open(char.href, '_blank', 'noopener') : router.push(char.href) }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#000000', display: 'flex', animation: 'panelIn 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'absolute', top: '1.5rem', right: '1.75rem', zIndex: 5,
          background: 'transparent', border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '50%', width: '38px', height: '38px',
          color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem',
          transition: 'border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = char.accent; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
      >
        ✕
      </button>

      <div style={{ flex: '0 0 42%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
        <div style={{
          position: 'absolute', width: '46%', aspectRatio: '1', borderRadius: '50%',
          background: `radial-gradient(circle, ${char.accentGlow}, transparent 72%)`, filter: 'blur(6px)',
        }} />
        <div style={{ width: 'min(30vw, 220px)', aspectRatio: '1', position: 'relative' }}>
          {ICONS[char.key]({ accent: char.accent })}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(2rem, 5vw, 5rem)', maxWidth: '640px' }}>
        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: char.accent, letterSpacing: '0.04em', marginBottom: '1rem', display: 'block' }}>
          {char.sub}
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, letterSpacing: '-0.03em', color: '#ffffff', lineHeight: 1.05, marginBottom: '1.5rem' }}>
          {char.label}
        </h1>
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', marginBottom: '2.5rem' }}>
          {char.desc}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem', marginBottom: '2.5rem' }}>
          {char.meta.map(m => (
            <div key={m.k}>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.25rem', letterSpacing: '0.03em' }}>
                {m.k}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{m.v}</p>
            </div>
          ))}
        </div>

        <button
          onClick={go}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            background: char.accent, color: '#000000', border: 'none',
            borderRadius: '999px', padding: '0.8rem 1.6rem', fontWeight: 600,
            fontSize: '0.9rem', cursor: 'pointer', width: 'fit-content', transition: 'transform 0.15s ease',
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
    <div style={{ background: '#000000', color: '#ffffff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        * { font-family: 'Space Grotesk', var(--font-sans, sans-serif); }
        .mono-ui { font-family: 'JetBrains Mono', var(--font-mono, monospace) !important; }

        html { scroll-behavior: smooth; }

        @keyframes cardIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes panelIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }

        @media (max-width: 720px) {
          .cardGrid { grid-template-columns: repeat(2, 1fr) !important; }
          .stepsGrid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 45%, black 0%, transparent 75%)',
        }} />

        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem',
          position: 'relative', zIndex: 2, opacity: mounted ? 1 : 0,
          animation: mounted ? 'fadeUp 0.5s ease forwards' : 'none',
        }}>
          <span style={{ fontWeight: 600, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
            Argus<span style={{ color: '#f0a500' }}>AI</span>
          </span>
          <div className="mono-ui" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            WSAI 2026
          </div>
        </nav>

        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 'clamp(3rem, 6vw, 5rem)', padding: '2rem', position: 'relative', zIndex: 2,
        }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', opacity: mounted ? 1 : 0, animation: mounted ? 'fadeUp 0.6s ease 0.05s forwards' : 'none' }}>
            <p className="mono-ui" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', marginBottom: '1.1rem', textTransform: 'uppercase' }}>
              faithfulness research, not vibes
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'rgba(255,255,255,0.96)', marginBottom: '1.1rem' }}>
              Your LLM is gaslighting itself.
            </h1>
            <p style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)', lineHeight: 1.65, color: 'rgba(255,255,255,0.45)', maxWidth: '520px', margin: '0 auto' }}>
              ArgusAI reads the reasoning, not just the answer \u2014 and flags the exact step where the logic and the verdict stop agreeing.
            </p>
          </div>

          <div className="cardGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(130px, 1fr))', gap: 'clamp(1.75rem, 4vw, 3.5rem)', maxWidth: '860px', width: '100%' }}>
            {CHARACTERS.map((c, i) => (
              <FloatingCard key={c.key} char={c} index={i} onSelect={setSelected} />
            ))}
          </div>
        </div>

        <a
          href="#how-it-works"
          className="mono-ui"
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            padding: '0 0 2.5rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
            fontSize: '0.68rem', letterSpacing: '0.05em', textTransform: 'uppercase',
            position: 'relative', zIndex: 2, opacity: mounted ? 1 : 0,
            animation: mounted ? 'fadeUp 0.6s ease 0.3s forwards' : 'none', alignSelf: 'center',
          }}
        >
          the mechanism
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'bounce 1.8s ease-in-out infinite' }}>
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: 'clamp(4rem, 10vw, 8rem) 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <p className="mono-ui" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', marginBottom: '1rem', textTransform: 'uppercase' }}>
            the pipeline
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 'clamp(3rem, 7vw, 5rem)', maxWidth: '640px' }}>
            Two passes. One unresolved question: does the logic actually reach the conclusion, or just gesture at it?
          </h2>

          <div className="stepsGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{
                borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem',
                opacity: 0, animation: `fadeUp 0.6s ease ${0.1 * i}s forwards`,
              }}>
                <span className="mono-ui" style={{ fontSize: '0.78rem', color: '#f0a500', display: 'block', marginBottom: '1.25rem' }}>
                  {s.n}
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 500, letterSpacing: '-0.01em', marginBottom: '0.85rem' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.5)' }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 'clamp(3.5rem, 7vw, 5.5rem)', paddingTop: '2.5rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexWrap: 'wrap', gap: '2.5rem', justifyContent: 'space-between',
          }}>
            {[
              { v: '2', l: 'reasoning passes' },
              { v: '10', l: 'test cases' },
              { v: 'llama-3.3-70b', l: 'model' },
              { v: 'Next.js 14', l: 'stack' },
            ].map(stat => (
              <div key={stat.l}>
                <p className="mono-ui" style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', marginBottom: '0.35rem' }}>{stat.v}</p>
                <p className="mono-ui" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>{stat.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selected && <DetailPanel char={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
