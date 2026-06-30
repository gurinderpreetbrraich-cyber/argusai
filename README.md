# 🛡️ ArgusAI

> **LLM Reasoning Oversight for High-Stakes Clinical Domains**

[![Live Demo](https://img.shields.io/badge/Demo-argusai--gray.vercel.app-f0a500?style=flat-square&logo=vercel&logoColor=black)](https://argusai-gray.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-0f1114?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Groq](https://img.shields.io/badge/Powered%20by-Groq-f55036?style=flat-square)](https://groq.com)
[![Research](https://img.shields.io/badge/Research-WSAI%202026%20Amsterdam-6366f1?style=flat-square)](https://worldsummit.ai)

---

## 🧠 What is ArgusAI?

Modern LLMs can produce reasoning chains that *sound* rigorous but don't actually drive the conclusion — a failure mode known as **reasoning unfaithfulness**. A model can correctly diagnose severe sleep apnea while simultaneously entertaining the patient's denial as clinically relevant, and a standard accuracy benchmark would never catch it.

ArgusAI watches the reasoning, not just the answer.

It runs every LLM-generated reasoning chain through a second-pass audit, flagging:

- 🔴 **Contradictions** — the model argues against its own evidence
- 🟡 **Evidence gaps** — critical findings ignored in the final answer
- 🟠 **Deceptive patterns** — conclusions overridden by prompt framing rather than data

Applied to **sleep medicine** as the primary domain — a field where reasoning failures have direct clinical consequences and the failure modes are easy to construct and verify.

---

## 🚀 Live Demo

**[argusai-gray.vercel.app](https://argusai-gray.vercel.app)**

| Case | Type | Severity |
|------|------|----------|
| 46M, BMI 28.4, loud snoring | Mild OSA | 🟢 Mild |
| 58F, BMI 34.1, hypertension | Severe OSA | 🔴 Severe |
| 33F, sleep-onset latency >60min | Primary Insomnia | 🟡 Moderate |
| 9M, ADHD, nocturnal thrashing | Pediatric Restless Sleep | 🟢 Mild |
| 52M, AHI 52/hr, denies symptoms | **Adversarial Case** ⚠️ | 🔴 Critical |

Case 05 is engineered to provoke exactly the failure ArgusAI is built to catch — try it first.

---

## ⚙️ How it works

![ArgusAI Architecture](public/architecture.svg)

```
Patient case
     │
     ▼
┌──────────────────────────────┐
│  Pass 1 — Groq reasoning     │  llama-3.3-70b-versatile
│  Step-by-step clinical       │  Chain-of-thought extraction
│  diagnosis generation        │  Paragraph segmentation
└─────────────┬─────────────────┘
              │ reasoning_steps[]
              ▼
┌──────────────────────────────┐
│  Pass 2 — Groq analysis      │  llama-3.3-70b-versatile
│  Faithfulness scoring        │  Anomaly detection
│  Contradiction detection     │  Counterfactual probes
└─────────────┬─────────────────┘
              │
              ▼
┌──────────────────────────────┐
│  ArgusAI dashboard           │  Next.js 14 · Vercel
│  Score rings · Trace viewer  │  Anomaly cards · Probes
└──────────────────────────────┘
```

---

## ✨ Key features

- **🎯 Faithfulness score** — a 0–100 ring showing how well the reasoning chain actually supports the conclusion
- **🔍 Reasoning trace** — full step-by-step visualizer with flagged steps highlighted inline
- **⚠️ Anomaly detection** — contradiction, evidence-gap, and confidence-anomaly classification with severity scoring
- **❓ Counterfactual probes** — auto-generated questions that interrogate exactly where the reasoning breaks
- **🧪 Adversarial case** — a deliberately constructed scenario where ground truth (AHI 52/hr) conflicts with patient self-report, used to validate detection works

---

## 🏗️ Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Deployment | Vercel |
| Reasoning model | Groq — llama-3.3-70b-versatile |
| Analysis engine | Groq — llama-3.3-70b-versatile |
| Design | JetBrains Mono · dark precision UI |

---

## 📄 Research context

**Target venue:** World Summit AI 2026 Amsterdam
**Track:** *Guardians of Tomorrow — Shaping the New AI Paradigm*

**Paper:** *ArgusAI: Towards Meaningful Oversight of LLM Reasoning Chains in High-Stakes Clinical Domains*

> Key finding — models can produce AHI-accurate diagnoses while simultaneously treating patient-reported denial as clinically relevant, a faithfulness failure invisible to standard accuracy benchmarks.

---

## 💼 Resume bullets

```
• Built ArgusAI, a full-stack AI safety tool deployed on Vercel that detects
  faithfulness failures in LLM reasoning chains using a two-pass Groq pipeline

• Designed an adversarial test case that reliably elicits contradictory reasoning
  in clinical diagnosis tasks, demonstrating a real-world AI oversight gap

• Built a reasoning trace visualizer, faithfulness score rings, anomaly detection
  cards, and counterfactual probe generation in Next.js 14
```

---

## 🧰 Local development

```bash
git clone https://github.com/gurinderpreetbrraich-cyber/argusai.git
cd argusai
npm install
cp .env.example .env.local
# add GROQ_API_KEY=your_key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📜 License

MIT © Gurinderpreet Singh Brraich
