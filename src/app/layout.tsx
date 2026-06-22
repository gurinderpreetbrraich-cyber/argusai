import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ArgusAI — LLM Reasoning Oversight',
  description: 'AI safety tool that audits large language model reasoning chains for faithfulness failures, contradictions, and deceptive patterns in medical diagnosis.',
  keywords: ['AI safety', 'LLM reasoning', 'interpretability', 'sleep medicine', 'chain of thought'],
  openGraph: {
    title: 'ArgusAI — LLM Reasoning Oversight',
    description: 'Auditing AI reasoning chains for faithfulness and deception.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
