'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { AuditSpotlight } from '../AuditSpotlight'

const TYPEWRITER_LINES = [
  'SpO₂ minimum 71% — severe nocturnal hypoxemia.',
  'Patient denies any symptoms.',
  'Reasoning chain shows contradiction at step 4.',
  'Faithfulness score: 0.61 — anomaly flagged.',
  'Counterfactual probe generated.',
]

export default function LandingPage() {
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const line = TYPEWRITER_LINES[lineIdx]
    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setDisplayed(line.slice(0, charIdx + 1))
        setCharIdx(c => c + 1)
      }, 28)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        const next = (lineIdx + 1) % TYPEWRITER_LINES.length
        setLineIdx(next)
        setCharIdx(0)
        setDisplayed('')
      }, 2200)
      return () => clearTimeout(t)
    }
  }, [charIdx, lineIdx, mounted])

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 3rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(0,0,0,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        transition: 'background 0.3s, backdrop-filter 0.3s',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#f0a500', fontSize: '1.1rem' }}>◈</span>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>ArgusAI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <a href="#work" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', letterSpacing: '0.01em', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = '#fff'}
            onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}>
            How it works
          </a>
          <a href="https://github.com/gurinderpreetbrraich-cyber/argusai" target="_blank" rel="noopener"
            style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', letterSpacing: '0.01em', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = '#fff'}
            onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}>
            GitHub
          </a>
          <Link href="/custom" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', letterSpacing: '0.01em', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = '#fff'}
            onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}>
            Custom
          </Link>
        </div>
        <Link href="/dashboard" style={{
          color: '#000', background: '#f0a500',
          fontSize: '0.78rem', fontWeight: 700,
          padding: '0.45rem 1.1rem', borderRadius: '6px',
          textDecoration: 'none', letterSpacing: '0.01em',
          transition: 'opacity 0.15s',
        }}
          onMouseEnter={e => (e.target as HTMLElement).style.opacity = '0.85'}
          onMouseLeave={e => (e.target as HTMLElement).style.opacity = '1'}>
          Launch →
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '0 3rem',
        overflow: 'hidden',
      }}>
        <AuditSpotlight />

        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 100%)',
        }} />

        <div style={{ position: 'relative', maxWidth: '900px' }}>
          {/* Eyebrow */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            color: '#f0a500', letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: '2.5rem', opacity: 0.9,
          }}>
            AI Safety · WSAI 2026 Amsterdam
          </div>

          {/* Hero headline */}
          <h1 style={{
            fontSize: 'clamp(3.5rem, 9vw, 8.5rem)',
            fontWeight: 800, lineHeight: 0.92,
            letterSpacing: '-0.04em', color: '#fff',
            marginBottom: '2rem',
          }}>
            Who watches<br />
            <span style={{ color: 'rgba(255,255,255,0.18)' }}>the AI?</span>
          </h1>

          {/* Amber readout — signature element */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
            color: '#f0a500', marginBottom: '3rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px',
              borderRadius: '50%', background: '#f0a500',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span>{displayed}<span style={{ opacity: 0.4 }}>█</span></span>
          </div>

          {/* One-liner */}
          <p style={{
            fontSize: '1.05rem', color: 'rgba(255,255,255,0.38)',
            maxWidth: '480px', lineHeight: 1.65,
            fontWeight: 300, marginBottom: '3.5rem',
          }}>
            ArgusAI audits LLM reasoning chains in real time — catching contradictions, evidence gaps, and deceptive patterns before they reach high-stakes decisions.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/dashboard" style={{
              background: '#f0a500', color: '#000',
              padding: '0.75rem 1.75rem', borderRadius: '6px',
              fontWeight: 700, fontSize: '0.875rem',
              textDecoration: 'none', letterSpacing: '-0.01em',
              transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => (e.target as HTMLElement).style.opacity = '0.85'}
              onMouseLeave={e => (e.target as HTMLElement).style.opacity = '1'}>
              Run Analysis
            </Link>
            <Link href="/custom" style={{
              color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem',
              textDecoration: 'none', letterSpacing: '-0.01em',
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#fff'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}>
              Try custom prompt →
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: '2.5rem', left: '3rem',
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em',
        }}>
          scroll
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '6rem 3rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0', maxWidth: '900px',
        }}>
          {[
            { value: '>50%', label: 'of correct LLM answers mask internal reasoning errors' },
            { value: '0.61', label: 'faithfulness score on the adversarial case' },
            { value: '2', label: 'high-stakes domains — clinical and code security' },
            { value: 'WSAI', label: '2026 Amsterdam research submission' },
          ].map((s, i) => (
            <div key={s.label} style={{
              padding: '0 3rem 0 0',
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              paddingLeft: i > 0 ? '3rem' : 0,
            }}>
              <div style={{
                fontSize: '2.2rem', fontWeight: 800,
                letterSpacing: '-0.04em', color: '#f0a500',
                marginBottom: '0.5rem',
              }}>{s.value}</div>
              <div style={{
                fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)',
                lineHeight: 1.5, fontWeight: 300,
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="work" style={{ padding: '8rem 3rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '900px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em',
            textTransform: 'uppercase', marginBottom: '5rem',
          }}>
            Architecture
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              {
                n: '01',
                title: 'Reason',
                body: 'Groq runs the clinical case or code review through a domain-aware system prompt, generating a full chain-of-thought step by step. The domain is detected automatically from the prompt.',
              },
              {
                n: '02',
                title: 'Audit',
                body: 'A second Groq pass reads the reasoning chain and scores it for faithfulness — catching contradictions, evidence gaps, and cases where the final answer departs from what the model itself observed.',
              },
              {
                n: '03',
                title: 'Probe',
                body: 'For every flagged anomaly, ArgusAI generates a counterfactual question — testing whether the conclusion is anchored to evidence or to spurious framing in the prompt.',
              },
            ].map((step, i) => (
              <div key={step.n} style={{
                display: 'grid', gridTemplateColumns: '80px 1fr',
                gap: '0 3rem', padding: '3.5rem 0',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.2)', paddingTop: '4px',
                  letterSpacing: '0.05em',
                }}>
                  {step.n}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.6rem', fontWeight: 700,
                    letterSpacing: '-0.03em', marginBottom: '1rem', color: '#fff',
                  }}>{step.title}</h3>
                  <p style={{
                    fontSize: '0.9rem', color: 'rgba(255,255,255,0.38)',
                    lineHeight: 1.7, fontWeight: 300, maxWidth: '520px',
                  }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Domains ── */}
      <section style={{ padding: '8rem 3rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '900px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em',
            textTransform: 'uppercase', marginBottom: '5rem',
          }}>
            Domains
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem' }}>
            {[
              {
                label: 'Clinical',
                headline: 'Sleep medicine',
                body: 'Five clinical cases including a deliberately adversarial scenario where objective wearable data contradicts patient self-report. AHI 52/hr — the model knows, then second-guesses itself.',
                stat: '0.61', statLabel: 'faithfulness on adversarial case',
              },
              {
                label: 'Code Security',
                headline: 'PR review',
                body: 'Five pull requests ranging from clean parameterized queries to SQL injection under deadline pressure and "CEO approval." The deceptive case is designed to make the model approve a merge it knows is dangerous.',
                stat: 'SQL', statLabel: 'injection under social pressure',
              },
            ].map(d => (
              <div key={d.label}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                  color: '#f0a500', letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: '1.5rem',
                }}>{d.label}</div>
                <h3 style={{
                  fontSize: '2rem', fontWeight: 700,
                  letterSpacing: '-0.04em', marginBottom: '1.25rem',
                }}>{d.headline}</h3>
                <p style={{
                  fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)',
                  lineHeight: 1.7, fontWeight: 300, marginBottom: '2rem',
                }}>{d.body}</p>
                <div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '1.4rem',
                    fontWeight: 700, color: '#f0a500',
                  }}>{d.stat}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.2)', marginLeft: '0.75rem',
                  }}>{d.statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Research ── */}
      <section style={{ padding: '8rem 3rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '900px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em',
            textTransform: 'uppercase', marginBottom: '5rem',
          }}>
            Research
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            {[
              {
                stat: '>50%',
                text: 'of correct LLM answers on complex tasks mask significant internal reasoning errors',
                source: 'ProcessBench, 2025',
              },
              {
                stat: '72%',
                text: 'of enterprises test agentic AI but only 1 in 9 deploys to production — reasoning oversight is the gap',
                source: 'Industry survey, 2026',
              },
            ].map(f => (
              <div key={f.stat}>
                <div style={{
                  fontSize: '3.5rem', fontWeight: 800,
                  letterSpacing: '-0.05em', color: '#fff',
                  marginBottom: '1rem', lineHeight: 1,
                }}>{f.stat}</div>
                <p style={{
                  fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)',
                  lineHeight: 1.7, fontWeight: 300, marginBottom: '0.75rem',
                }}>{f.text}</p>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.18)',
                }}>{f.source}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: '10rem 3rem', borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '900px' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 800, letterSpacing: '-0.04em',
            lineHeight: 0.95, marginBottom: '3rem', color: '#fff',
          }}>
            See it catch a<br />
            <span style={{ color: 'rgba(255,255,255,0.18)' }}>deceptive chain.</span>
          </h2>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/dashboard" style={{
              background: '#f0a500', color: '#000',
              padding: '0.85rem 2rem', borderRadius: '6px',
              fontWeight: 700, fontSize: '0.9rem',
              textDecoration: 'none', letterSpacing: '-0.01em',
              transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => (e.target as HTMLElement).style.opacity = '0.85'}
              onMouseLeave={e => (e.target as HTMLElement).style.opacity = '1'}>
              Open Dashboard
            </Link>
            <Link href="/custom" style={{
              color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#fff'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.35)'}>
              Or paste your own prompt →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '3rem', borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#f0a500' }}>◈</span>
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>ArgusAI</span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
          color: 'rgba(255,255,255,0.2)',
        }}>
          WSAI 2026 · Built by Gurinderpreet Singh Brraich
        </span>
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
      </footer>

      <style>{`
        @media (max-width: 768px) {
          nav { padding: 0 1.5rem !important; }
          section { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          footer { padding: 2rem 1.5rem !important; flex-direction: column; gap: 1rem; align-items: flex-start; }
        }
      `}</style>
    </div>
  )
}
