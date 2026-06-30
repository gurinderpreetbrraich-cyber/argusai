'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuditSpotlight } from '../AuditSpotlight'
import styles from './page.module.css'

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

  useEffect(() => { setMounted(true) }, [])

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
    <div className={styles.root}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>ArgusAI</span>
            <span className={styles.logoBadge}>v2.0</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#how-it-works" className={styles.navLink}>How it works</a>
            <a href="https://github.com/gurinderpreetbrraich-cyber/argusai" target="_blank" rel="noopener" className={styles.navLink}>GitHub</a>
            <Link href="/dashboard" className={styles.navCta}>Launch Demo →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <AuditSpotlight />
        <AuditSpotlight />
        <div className={styles.heroContent}>
          <div className={styles.heroPill}>
            <span className={styles.pillDot} />
            AI Safety Research · WSAI 2026
          </div>
          <h1 className={styles.heroTitle}>
            When AI reasons,<br />
            <span className={styles.heroAccent}>who watches?</span>
          </h1>
          <p className={styles.heroSubtitle}>
            ArgusAI audits large language model reasoning chains in real time —
            detecting contradictions, evidence gaps, and deceptive patterns
            before they reach clinical decisions.
          </p>

          {/* Terminal window — signature element */}
          <div className={styles.terminal}>
            <div className={styles.terminalBar}>
              <span className={styles.dot} style={{background:'#ff5f57'}} />
              <span className={styles.dot} style={{background:'#febc2e'}} />
              <span className={styles.dot} style={{background:'#28c840'}} />
              <span className={styles.terminalTitle}>argusai — reasoning trace</span>
            </div>
            <div className={styles.terminalBody}>
              <div className={styles.termLine}>
                <span className={styles.termPrompt}>argus@v2</span>
                <span className={styles.termPath}> ~/analyze</span>
                <span className={styles.termCmd}> $ run case_05</span>
              </div>
              <div className={styles.termLine}>
                <span className={styles.termOutput}>{displayed}</span>
                <span className={styles.termCursor} />
              </div>
            </div>
          </div>

          <div className={styles.heroCtas}>
            <Link href="/dashboard" className={styles.ctaPrimary}>
              Run Analysis
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <a href="https://github.com/gurinderpreetbrraich-cyber/argusai" target="_blank" rel="noopener" className={styles.ctaSecondary}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        {[
          { value: '5', label: 'Clinical Test Cases' },
          { value: '3', label: 'Detection Engines' },
          { value: '2', label: 'AI Models' },
          { value: 'WSAi 26', label: 'Target Venue' },
        ].map(s => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* How it works */}
      <section id="how-it-works" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Architecture</span>
            <h2 className={styles.sectionTitle}>Three-stage oversight pipeline</h2>
            <p className={styles.sectionSubtitle}>
              Every reasoning chain passes through compression, anomaly detection, and counterfactual probing.
            </p>
          </div>

          <div className={styles.pipeline}>
            {[
              {
                num: '01',
                title: 'Chain Compressor',
                subtitle: 'Groq LLaMA-3.3-70B',
                body: 'The model reasons through a clinical case, producing a full chain-of-thought. ArgusAI extracts individual reasoning steps and computes a faithfulness score between the stated reasoning and the final conclusion.',
                tag: 'Reasoning',
              },
              {
                num: '02',
                title: 'Anomaly Detector',
                subtitle: 'Groq LLaMA-3.3-70B',
                body: 'Claude audits the reasoning chain for contradictions, evidence gaps, confidence anomalies, and deceptive patterns — the four failure modes identified in the 2025-26 interpretability literature.',
                tag: 'Detection',
              },
              {
                num: '03',
                title: 'Counterfactual Probes',
                subtitle: 'Groq LLaMA-3.3-70B',
                body: 'For every flagged anomaly, ArgusAI generates a targeted counterfactual question — testing whether the model\'s conclusion is anchored to evidence or to spurious features in the prompt.',
                tag: 'Oversight',
              },
            ].map(step => (
              <div key={step.num} className={styles.pipelineStep}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepHeader}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <span className={styles.stepTag}>{step.tag}</span>
                  </div>
                  <p className={styles.stepSubtitle}>{step.subtitle}</p>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research context */}
      <section className={styles.section} style={{background: 'var(--obsidian-1)'}}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Research Context</span>
            <h2 className={styles.sectionTitle}>The faithfulness problem</h2>
          </div>
          <div className={styles.findings}>
            {[
              {
                stat: '>50%',
                finding: 'of correct LLM answers on complex tasks mask significant internal reasoning errors (ProcessBench, 2025)',
              },
              {
                stat: '72%',
                finding: 'of enterprises test agentic AI but only 1 in 9 deploys to production — oversight gaps are the primary barrier',
              },
              {
                stat: '0.61',
                finding: 'faithfulness score on the adversarial case — model briefly accommodates patient denial despite AHI of 52/hr',
              },
            ].map(f => (
              <div key={f.stat} className={styles.findingCard}>
                <span className={styles.findingStat}>{f.stat}</span>
                <p className={styles.findingText}>{f.finding}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.ctaTitle}>See it catch a deceptive reasoning chain.</h2>
          <p className={styles.ctaSubtitle}>
            Case 05 is designed to make an AI contradict itself. ArgusAI flags it in under 30 seconds.
          </p>
          <Link href="/dashboard" className={styles.ctaPrimary} style={{display:'inline-flex', marginTop:'2rem'}}>
            Open Dashboard →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}>◈ ArgusAI</span>
          <span className={styles.footerText}>
            Research project · World Summit AI 2026 · Built by Gurinderpreet Singh Brraich
          </span>
          <a href="https://github.com/gurinderpreetbrraich-cyber/argusai" target="_blank" rel="noopener" className={styles.footerLink}>
            github.com/gurinderpreetbrraich-cyber/argusai
          </a>
        </div>
      </footer>
    </div>
  )
}
