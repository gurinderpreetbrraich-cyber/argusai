"use client"

'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { fetchCases, analyzeCase, Case, AnalysisResult } from '@/lib/api'
import styles from './dashboard.module.css'

// ── Severity color map ──
const SEV_COLOR: Record<string, string> = {
  high:   '#ef4444',
  medium: '#f59e0b',
  low:    '#22c55e',
}

const TAG_COLOR: Record<string, string> = {
  OSA:        'rgba(59,130,246,0.15)',
  Insomnia:   'rgba(168,85,247,0.15)',
  Pediatric:  'rgba(34,197,94,0.15)',
  Adversarial:'rgba(239,68,68,0.15)',
}

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - score * circ
  const color = score >= 0.75 ? '#22c55e' : score >= 0.5 ? '#f59e0b' : '#ef4444'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle"
        fontSize={size * 0.22} fontWeight="700" fill={color} fontFamily="JetBrains Mono, monospace">
        {Math.round(score * 100)}
      </text>
    </svg>
  )
}

function ReasoningTrace({ steps, anomalyStepIds }: { steps: {step_id:number;text:string}[]; anomalyStepIds: Set<number> }) {
  return (
    <div className={styles.trace}>
      {steps.map((step, i) => {
        const flagged = anomalyStepIds.has(step.step_id)
        return (
          <div key={step.step_id} className={`${styles.traceStep} ${flagged ? styles.traceStepFlagged : ''}`}>
            <div className={styles.traceConnector}>
              <div className={`${styles.traceDot} ${flagged ? styles.traceDotFlagged : ''}`} />
              {i < steps.length - 1 && <div className={styles.traceLine} />}
            </div>
            <div className={styles.traceContent}>
              <span className={styles.traceNum}>Step {step.step_id}</span>
              {flagged && <span className={styles.traceFlag}>⚠ Anomaly</span>}
              <p className={styles.traceText}>{step.text}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Dashboard() {
  const [cases, setCases] = useState<Case[]>([])
  const [selected, setSelected] = useState<Case | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [tab, setTab] = useState<'reasoning' | 'analysis' | 'probes'>('reasoning')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetchCases()
      .then(c => { setCases(c); setSelected(c[0]) })
      .catch(() => setError('Failed to load cases. Refresh the page.'))
  }, [])

  const handleAnalyze = async () => {
    if (!selected) return
    setLoading(true)
    setResult(null)
    setError(null)
    setElapsed(0)
    setTab('reasoning')

    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)

    try {
      const r = await analyzeCase(selected.id, selected.prompt)
      setResult(r)
    } catch (e: any) {
      setError(e.message || 'Analysis failed. Please retry.')
    } finally {
      setLoading(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const anomalyStepIds = new Set(result?.anomalies.map(a => a.step_id) ?? [])

  return (
    <div className={styles.root}>
      {/* Top bar */}
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          ArgusAI
        </Link>
        <div className={styles.headerCenter}>
          <span className={styles.headerTitle}>Analysis Dashboard</span>
        </div>
        {result?.mock && (
          <span className={styles.mockBadge}>Demo Mode</span>
        )}
      </header>

      <div className={styles.layout}>
        {/* ── Sidebar: case selector ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarLabel}>Test Cases</span>
            <span className={styles.sidebarCount}>{cases.length}</span>
          </div>

          {cases.length === 0 ? (
            Array.from({length: 5}).map((_, i) => (
              <div key={i} className={`${styles.caseSkeleton} skeleton`} />
            ))
          ) : (
            cases.map(c => (
              <button
                key={c.id}
                className={`${styles.caseCard} ${selected?.id === c.id ? styles.caseCardActive : ''}`}
                onClick={() => { setSelected(c); setResult(null); setError(null) }}
              >
                <div className={styles.caseCardTop}>
                  <span className={styles.caseTag} style={{ background: TAG_COLOR[c.tag] ?? 'rgba(255,255,255,0.06)' }}>
                    {c.tag}
                  </span>
                  <span className={`${styles.caseSev} ${styles['sev_'+c.severity]}`}>
                    {c.severity}
                  </span>
                </div>
                <p className={styles.caseTitle}>{c.title}</p>
                <p className={styles.caseDesc}>{c.description}</p>
              </button>
            ))
          )}
        </aside>

        {/* ── Main panel ── */}
        <main className={styles.main}>
          {/* Case prompt */}
          {selected && (
            <div className={styles.promptCard}>
              <div className={styles.promptHeader}>
                <div>
                  <span className={styles.promptLabel}>Patient Case</span>
                  <h2 className={styles.promptTitle}>{selected.title}</h2>
                </div>
                <button
                  className={styles.analyzeBtn}
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className={styles.spinner} />
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
              <p className={styles.promptText}>{selected.prompt}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className={styles.errorBanner}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M7 4v3.5M7 10h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className={styles.results}>
              {/* Metrics row */}
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <div className={styles.metricRing}>
                    <ScoreRing score={result.compression.faithfulness_score} />
                  </div>
                  <div>
                    <p className={styles.metricLabel}>Faithfulness</p>
                    <p className={styles.metricSub}>How well reasoning supports conclusion</p>
                  </div>
                </div>

                <div className={styles.metricDivider} />

                <div className={styles.metric}>
                  <div className={styles.metricRing}>
                    <ScoreRing score={result.compression.confidence} />
                  </div>
                  <div>
                    <p className={styles.metricLabel}>Confidence</p>
                    <p className={styles.metricSub}>Model's own certainty in verdict</p>
                  </div>
                </div>

                <div className={styles.metricDivider} />

                <div className={styles.metricBlock}>
                  <p className={styles.metricLabel}>Verdict</p>
                  <p className={styles.verdict}>{result.compression.verdict}</p>
                  <p className={styles.metricSub}>{result.anomalies.length} anomal{result.anomalies.length !== 1 ? 'ies' : 'y'} detected</p>
                </div>

                <div className={styles.metricDivider} />

                <div className={styles.metricBlock}>
                  <p className={styles.metricLabel}>Model</p>
                  <p className={styles.metricMono}>{result.model_used}</p>
                  {result.mock && <span className={styles.mockTag}>Demo data</span>}
                </div>
              </div>

              {/* Summary */}
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>ArgusAI Assessment</span>
                <p className={styles.summaryText}>{result.compression.summary}</p>
              </div>

              {/* Tabs */}
              <div className={styles.tabs}>
                {(['reasoning', 'analysis', 'probes'] as const).map(t => (
                  <button
                    key={t}
                    className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
                    onClick={() => setTab(t)}
                  >
                    {t === 'reasoning' && `Reasoning Chain (${result.reasoning_steps.length} steps)`}
                    {t === 'analysis' && `Anomalies (${result.anomalies.length})`}
                    {t === 'probes'   && `Counterfactual Probes (${result.probes.length})`}
                  </button>
                ))}
              </div>

              {/* Tab: Reasoning */}
              {tab === 'reasoning' && (
                <div className={styles.tabContent}>
                  <div className={styles.keySteps}>
                    <span className={styles.keyStepsLabel}>Key steps (compressed)</span>
                    {result.compression.key_steps.map((s, i) => (
                      <div key={i} className={styles.keyStep}>
                        <span className={styles.keyStepNum}>{i+1}</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.traceHeader}>
                    <span className={styles.keyStepsLabel}>Full reasoning trace</span>
                    {anomalyStepIds.size > 0 && (
                      <span className={styles.traceNote}>⚠ Steps with anomalies are highlighted</span>
                    )}
                  </div>
                  <ReasoningTrace steps={result.reasoning_steps} anomalyStepIds={anomalyStepIds} />
                </div>
              )}

              {/* Tab: Anomalies */}
              {tab === 'analysis' && (
                <div className={styles.tabContent}>
                  {result.anomalies.length === 0 ? (
                    <div className={styles.empty}>
                      <span className={styles.emptyIcon}>✓</span>
                      <p>No anomalies detected. Reasoning chain appears faithful.</p>
                    </div>
                  ) : (
                    result.anomalies.map((a, i) => (
                      <div key={i} className={styles.anomalyCard} style={{ borderLeftColor: SEV_COLOR[a.severity] }}>
                        <div className={styles.anomalyTop}>
                          <span className={styles.anomalyType}>{a.type.replace('_', ' ')}</span>
                          <span className={styles.anomalySev} style={{ color: SEV_COLOR[a.severity] }}>
                            {a.severity} severity
                          </span>
                          <span className={styles.anomalyConf}>
                            {Math.round(a.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className={styles.anomalyDesc}>{a.description}</p>
                        <span className={styles.anomalyStep}>Flagged at step {a.step_id}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab: Probes */}
              {tab === 'probes' && (
                <div className={styles.tabContent}>
                  {result.probes.length === 0 ? (
                    <div className={styles.empty}>
                      <span className={styles.emptyIcon}>✓</span>
                      <p>No probes generated. No anomalies to interrogate.</p>
                    </div>
                  ) : (
                    result.probes.map((p, i) => (
                      <div key={i} className={styles.probeCard}>
                        <div className={styles.probeTop}>
                          <span className={styles.probeNum}>Probe {i+1}</span>
                          <span className={styles.probeType}>{p.flag_type.replace('_', ' ')}</span>
                        </div>
                        <p className={styles.probeQ}>"{p.question}"</p>
                        <div className={styles.probePurpose}>
                          <span className={styles.probePurposeLabel}>Purpose</span>
                          <span>{p.purpose}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!result && !loading && !error && selected && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon2}>◈</div>
              <p className={styles.emptyTitle}>Ready to analyze</p>
              <p className={styles.emptyBody}>
                Select a case and click <strong>Run ArgusAI</strong> to start the reasoning oversight pipeline.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
