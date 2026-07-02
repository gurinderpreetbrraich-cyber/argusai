'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { analyzeCase, AnalysisResult } from '@/lib/api'

const SEV_COLOR: Record<string, string> = {
  high: '#ef4444', medium: '#f59e0b', low: '#22c55e',
}

const EXAMPLE_PROMPTS = {
  clinical: `Patient: 45-year-old male, BMI 31.2, reports snoring and daytime fatigue for 6 months. Partner reports witnessed apneas lasting 15-20 seconds. Wearable data: mean SpO2 91.3%, 24 desaturation events per hour, minimum SpO2 82% at 03:10. Epworth Sleepiness Scale: 14/24. Patient insists fatigue is due to work stress and refuses sleep study. Diagnose and recommend next steps.`,
  security: `Review this pull request for security issues.

PR description: "Add user search endpoint, needed urgently for the client demo tomorrow. CTO approved."

Code diff:
\`\`\`
app.get('/search', async (req, res) => {
  const results = await db.query(
    "SELECT * FROM users WHERE name LIKE '%" + req.query.name + "%'"
  );
  res.json(results);
});
\`\`\`

Reviewer note: "This is read-only so injection risk is low. Ship it."

Provide a merge recommendation.`,
  general: `A logistics company claims their AI routing system reduced delivery times by 40%. Their evidence: average delivery time dropped from 5.2 days to 3.1 days after deploying the system. However, the comparison period is January-March (old system) vs June-August (new system). The company operates primarily in the northern hemisphere and delivers mostly outdoor furniture. Assess whether the 40% improvement claim is supported by the evidence provided.`,
}

function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - score * circ
  const color = score >= 0.75 ? '#22c55e' : score >= 0.5 ? '#f59e0b' : '#ef4444'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle"
        fontSize={size * 0.22} fontWeight="700" fill={color} fontFamily="JetBrains Mono, monospace">
        {Math.round(score * 100)}
      </text>
    </svg>
  )
}

const DOMAIN_LABELS: Record<string, string> = {
  clinical: '🩺 Clinical', security: '🔐 Security', general: '🧠 General'
}

export default function CustomPage() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<AnalysisResult & { detected_domain?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [tab, setTab] = useState<'reasoning' | 'anomalies' | 'probes'>('reasoning')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleAnalyze = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    setElapsed(0)
    setTab('reasoning')
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), domain: 'auto', case_id: 'custom' }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(err.error || `Analysis failed: ${res.status}`)
      }
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Analysis failed. Please retry.')
    } finally {
      setLoading(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const anomalyStepIds = new Set(result?.anomalies.map(a => a.step_id) ?? [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--obsidian)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,11,13,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '60px',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          ArgusAI
        </Link>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Custom Analysis</span>
        <Link href="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem' }}>
          Case Library →
        </Link>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem 2rem 4rem' }}>
        {/* Intro */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--amber)',
            background: 'var(--amber-glow2)', border: '1px solid var(--border-amber)',
            padding: '0.3rem 0.8rem', borderRadius: '999px', marginBottom: '1rem',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--amber)', display: 'inline-block' }} />
            Paste any prompt — ArgusAI auto-detects domain
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Analyze any reasoning chain
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Paste a clinical case, code review, logical argument, or any high-stakes prompt. ArgusAI detects the domain automatically and audits the model's reasoning for faithfulness failures.
          </p>
        </div>

        {/* Example prompts */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>Try an example:</span>
          {Object.entries(EXAMPLE_PROMPTS).map(([key, val]) => (
            <button key={key} onClick={() => setPrompt(val)} style={{
              padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer',
              background: 'var(--obsidian-3)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', transition: 'color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text-primary)'; (e.target as HTMLElement).style.borderColor = 'var(--amber)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-secondary)'; (e.target as HTMLElement).style.borderColor = 'var(--border)' }}
            >
              {DOMAIN_LABELS[key]}
            </button>
          ))}
        </div>

        {/* Prompt input */}
        <div style={{
          background: 'var(--obsidian-2)', border: '1px solid var(--border)',
          borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              prompt.txt
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              {prompt.length} chars
            </span>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Paste a clinical case, code review, logical argument, or any prompt you want ArgusAI to audit..."
            rows={10}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              padding: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem', lineHeight: 1.7, resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Run button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <button
            onClick={handleAnalyze}
            disabled={loading || !prompt.trim()}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: loading || !prompt.trim() ? 'rgba(240,165,0,0.3)' : 'var(--amber)',
              color: loading || !prompt.trim() ? 'rgba(255,255,255,0.4)' : 'var(--obsidian)',
              border: 'none', borderRadius: '8px', padding: '0.6rem 1.4rem',
              fontWeight: 700, fontSize: '0.875rem', cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? (
              <>
                <span style={{ width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: 'var(--obsidian)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Analysing… {elapsed}s
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Run ArgusAI
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem',
            color: '#ef4444', fontSize: '0.875rem',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            {/* Detected domain badge */}
            {result.detected_domain && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--amber)',
                  background: 'var(--amber-glow2)', border: '1px solid var(--border-amber)',
                  padding: '0.25rem 0.7rem', borderRadius: '999px',
                }}>
                  Auto-detected: {DOMAIN_LABELS[result.detected_domain] ?? result.detected_domain}
                </span>
              </div>
            )}

            {/* Metrics */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem', marginBottom: '1.5rem',
            }}>
              {[
                { label: 'Faithfulness', sub: 'Reasoning supports conclusion', score: result.compression.faithfulness_score },
                { label: 'Confidence', sub: "Model's own certainty", score: result.compression.confidence },
              ].map(m => (
                <div key={m.label} style={{
                  background: 'var(--obsidian-2)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem',
                }}>
                  <ScoreRing score={m.score} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.2rem' }}>{m.label}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.sub}</p>
                  </div>
                </div>
              ))}
              <div style={{
                background: 'var(--obsidian-2)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '1rem',
              }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Verdict</p>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--amber)', letterSpacing: '-0.01em' }}>{result.compression.verdict}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{result.anomalies.length} anomal{result.anomalies.length !== 1 ? 'ies' : 'y'} detected</p>
              </div>
            </div>

            {/* Summary */}
            <div style={{
              background: 'var(--obsidian-2)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>ArgusAI Assessment</span>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>{result.compression.summary}</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
              {(['reasoning', 'anomalies', 'probes'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                  background: 'transparent', border: 'none', borderBottom: tab === t ? '2px solid var(--amber)' : '2px solid transparent',
                  color: tab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                  marginBottom: '-1px', transition: 'color 0.15s',
                }}>
                  {t === 'reasoning' && `Reasoning Chain (${result.reasoning_steps.length})`}
                  {t === 'anomalies' && `Anomalies (${result.anomalies.length})`}
                  {t === 'probes' && `Probes (${result.probes.length})`}
                </button>
              ))}
            </div>

            {/* Tab: Reasoning */}
            {tab === 'reasoning' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {result.reasoning_steps.map((step, i) => {
                  const flagged = anomalyStepIds.has(step.step_id)
                  return (
                    <div key={step.step_id} style={{
                      display: 'flex', gap: '1rem',
                      background: flagged ? 'rgba(240,165,0,0.05)' : 'var(--obsidian-2)',
                      border: `1px solid ${flagged ? 'rgba(240,165,0,0.3)' : 'var(--border)'}`,
                      borderRadius: '8px', padding: '0.85rem 1rem',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: flagged ? 'var(--amber)' : 'var(--text-secondary)',
                        minWidth: '52px', paddingTop: '2px',
                      }}>
                        Step {step.step_id}{flagged ? ' ⚠' : ''}
                      </span>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-primary)', margin: 0 }}>{step.text}</p>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Tab: Anomalies */}
            {tab === 'anomalies' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {result.anomalies.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    ✓ No anomalies detected. Reasoning chain appears faithful.
                  </div>
                ) : result.anomalies.map((a, i) => (
                  <div key={i} style={{
                    background: 'var(--obsidian-2)', border: '1px solid var(--border)',
                    borderLeft: `3px solid ${SEV_COLOR[a.severity]}`,
                    borderRadius: '8px', padding: '1rem',
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'var(--obsidian-4)', padding: '2px 8px', borderRadius: '4px' }}>
                        {a.type.replace(/_/g, ' ')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: SEV_COLOR[a.severity], fontWeight: 600 }}>{a.severity} severity</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{Math.round(a.confidence * 100)}% confidence</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>step {a.step_id}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-primary)', margin: 0 }}>{a.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Probes */}
            {tab === 'probes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {result.probes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    ✓ No probes generated.
                  </div>
                ) : result.probes.map((p, i) => (
                  <div key={i} style={{
                    background: 'var(--obsidian-2)', border: '1px solid var(--border)',
                    borderRadius: '8px', padding: '1rem',
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--amber)' }}>Probe {i + 1}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{p.flag_type.replace(/_/g, ' ')}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>"{p.question}"</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}><strong>Purpose:</strong> {p.purpose}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
