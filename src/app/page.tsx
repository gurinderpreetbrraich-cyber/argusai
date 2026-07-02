'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const CARDS = [
  {
    id: 'clinical',
    label: 'no cap,',
    sublabel: "it's sick",
    sub: 'Clinical Analysis',
    desc: 'Watch an AI diagnose severe sleep apnea — then talk itself out of it.',
    href: '/dashboard',
    accent: '#f0a500',
    emoji: '🩺',
    rotate: -4,
    x: -2,
    y: -1,
  },
  {
    id: 'security',
    label: 'bro just',
    sublabel: 'merged it',
    sub: 'Code Security',
    desc: 'SQL injection, deadline pressure, CEO approved. What could go wrong.',
    href: '/dashboard?domain=security',
    accent: '#ef4444',
    emoji: '💀',
    rotate: 3,
    x: 1,
    y: -2,
  },
  {
    id: 'custom',
    label: 'go',
    sublabel: 'off',
    sub: 'Custom Prompt',
    desc: 'Paste literally anything. ArgusAI will find the contradiction.',
    href: '/custom',
    accent: '#a855f7',
    emoji: '⚡',
    rotate: -2,
    x: -1,
    y: 1,
  },
  {
    id: 'research',
    label: 'the',
    sublabel: 'lore',
    sub: 'Research · WSAI 2026',
    desc: '>50% of correct LLM answers mask internal reasoning errors. We wrote about it.',
    href: 'https://github.com/gurinderpreetbrraich-cyber/argusai',
    accent: '#22c55e',
    emoji: '📄',
    rotate: 5,
    x: 2,
    y: 2,
  },
]

function FloatingCard({ card, index }: { card: typeof CARDS[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const rafRef = useRef<number>()
  const timeRef = useRef(index * 1.3)

  useEffect(() => {
    setMounted(true)
    const animate = () => {
      timeRef.current += 0.008
      const t = timeRef.current
      const x = Math.sin(t + index * 1.2) * 6 + card.x * 2
      const y = Math.cos(t * 0.8 + index * 0.9) * 5 + card.y * 2
      setPos({ x, y })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const isExternal = card.href.startsWith('http')

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: hovered ? '#111' : '#0a0a0a',
    border: `1px solid ${hovered ? card.accent + '60' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '16px',
    padding: '2rem',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#fff',
    height: '280px',
    transform: mounted
      ? `translate(${pos.x}px, ${pos.y}px) rotate(${hovered ? 0 : card.rotate * 0.3}deg) scale(${hovered ? 1.03 : 1})`
      : 'translate(0,0)',
    transition: hovered
      ? 'border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)'
      : 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
    boxShadow: hovered ? `0 24px 60px ${card.accent}20, 0 0 0 1px ${card.accent}20` : '0 8px 32px rgba(0,0,0,0.4)',
    willChange: 'transform',
    position: 'relative',
    overflow: 'hidden',
  }

  const content = (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: card.accent,
        opacity: hovered ? 0.08 : 0.03,
        filter: 'blur(40px)',
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }} />

      {/* Top */}
      <div>
        <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{card.emoji}</div>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
          fontWeight: 800, letterSpacing: '-0.04em',
          lineHeight: 0.95, color: '#fff',
        }}>
          {card.label}<br />
          <span style={{ color: card.accent }}>{card.sublabel}</span>
        </h2>
      </div>

      {/* Bottom */}
      <div>
        <p style={{
          fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)',
          lineHeight: 1.55, marginBottom: '1rem', fontWeight: 300,
        }}>
          {card.desc}
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            {card.sub}
          </span>
          <span style={{
            fontSize: '0.9rem', color: card.accent,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(0)' : 'translateX(-6px)',
            transition: 'opacity 0.2s, transform 0.2s',
          }}>→</span>
        </div>
      </div>
    </div>
  )

  if (isExternal) {
    return <a href={card.href} target="_blank" rel="noopener" style={{ textDecoration: 'none', display: 'block' }}>{content}</a>
  }
  return <Link href={card.href} style={{ textDecoration: 'none', display: 'block' }}>{content}</Link>
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

  return (
    <div style={{
      background: '#000', color: '#fff', minHeight: '100vh',
      fontFamily: 'var(--font-sans)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2.5rem', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#f0a500', fontSize: '1rem' }}>◈</span>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.01em' }}>ArgusAI</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            background: 'rgba(240,165,0,0.1)', color: '#f0a500',
            border: '1px solid rgba(240,165,0,0.2)',
            padding: '1px 6px', borderRadius: '4px', marginLeft: '0.25rem',
          }}>v2.0</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#22c55e', display: 'inline-block',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>
            live · WSAI 2026
          </span>
        </div>
      </nav>

      {/* Main content */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '6rem 2.5rem 3rem',
        maxWidth: '1100px', margin: '0 auto', width: '100%',
      }}>
        {/* Top label */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em',
          textTransform: 'uppercase', marginBottom: '3rem',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.6s, transform 0.6s',
        }}>
          AI Safety · LLM Reasoning Oversight
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 6vw, 5rem)',
          fontWeight: 800, letterSpacing: '-0.04em',
          lineHeight: 0.92, marginBottom: '4rem',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s 0.1s, transform 0.7s 0.1s',
        }}>
          Who watches<br />
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>the AI?</span>
        </h1>

        {/* Four floating cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s 0.25s, transform 0.8s 0.25s',
        }}>
          {CARDS.map((card, i) => (
            <FloatingCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* Bottom line */}
        <div style={{
          marginTop: '3rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.8s 0.4s',
        }}>
          <p style={{
            fontSize: '0.78rem', color: 'rgba(255,255,255,0.2)',
            fontWeight: 300, maxWidth: '380px', lineHeight: 1.6,
          }}>
            ArgusAI catches when LLMs say one thing but reason another. Built for high-stakes domains — clinical diagnosis, code security, anything with real consequences.
          </p>
          <a href="https://github.com/gurinderpreetbrraich-cyber/argusai" target="_blank" rel="noopener"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.2)', textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = '#fff'}
            onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.2)'}>
            github →
          </a>
        </div>
      </main>

      <style>{`
        @media (max-width: 900px) {
          div[style*="repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 540px) {
          div[style*="repeat(4, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
