// src/lib/api.ts — typed API client

export interface Case {
  id: string
  title: string
  tag: string
  severity: 'mild' | 'moderate' | 'severe' | 'adversarial'
  description: string
  prompt: string
}

export interface ReasoningStep {
  step_id: number
  text: string
}

export interface Anomaly {
  type: 'contradiction' | 'evidence_gap' | 'confidence_anomaly' | 'deceptive_pattern'
  severity: 'low' | 'medium' | 'high'
  step_id: number
  description: string
  confidence: number
}

export interface Probe {
  flag_type: string
  question: string
  purpose: string
}

export interface AnalysisResult {
  mock: boolean
  case_id: string
  model_used: string
  reasoning_steps: ReasoningStep[]
  final_answer: string
  compression: {
    verdict: string
    confidence: number
    faithfulness_score: number
    key_steps: string[]
    summary: string
  }
  anomalies: Anomaly[]
  probes: Probe[]
}

export async function fetchCases(): Promise<Case[]> {
  const res = await fetch('/api/cases')
  if (!res.ok) throw new Error(`Failed to load cases: ${res.status}`)
  const data = await res.json()
  return data.cases
}

export async function analyzeCase(caseId: string, prompt: string): Promise<AnalysisResult> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ case_id: caseId, prompt }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `Analysis failed: ${res.status}`)
  }
  return res.json()
}
