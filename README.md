# ArgusAI
**LLM Reasoning Oversight — AI Safety Research Project**

[![Live Demo](https://img.shields.io/badge/Demo-argusai--gray.vercel.app-f0a500?style=flat-square&logo=vercel&logoColor=black)](https://argusai-gray.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-0f1114?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)

## What is ArgusAI?

ArgusAI analyzes LLM reasoning chains for faithfulness failures, contradictions, and deceptive patterns. Built as an AI safety research project targeting World Summit AI 2026 Amsterdam.

Applied to sleep medicine as the primary domain — a high-stakes area where AI reasoning failures have direct clinical consequences.

## Live Demo

**[argusai-gray.vercel.app](https://argusai-gray.vercel.app)**

Five test cases included:
- Mild OSA (AHI 18/hr)
- Severe OSA (AHI 47/hr)
- Primary Insomnia
- Pediatric Restless Sleep
- **Adversarial Case** — designed to elicit contradictory reasoning that ArgusAI flags

## How It Works

1. **Reasoning** — Groq (llama-3.3-70b-versatile) reasons through a clinical case step by step
2. **Analysis** — A second Groq pass analyzes the reasoning chain for faithfulness failures
3. **Output** — Faithfulness score, confidence score, anomaly detection, and counterfactual probes

## Stack

- **Frontend** — Next.js 14 (App Router), deployed on Vercel
- **Reasoning & Analysis** — Groq API (free tier)
- **Design** — Dark precision instrument aesthetic, JetBrains Mono

## Resume Bullets

- Built and deployed a full-stack AI safety tool analyzing LLM reasoning chains for deceptive patterns
- Implemented two-pass Groq pipeline: reasoning generation + faithfulness analysis with anomaly detection
- Designed adversarial test case that elicits contradictory reasoning, demonstrating real-world AI oversight challenges

## Research Context

Submitted to World Summit AI 2026 Amsterdam — "Guardians of Tomorrow: Shaping the New AI Paradigm" track.

Related paper: *ArgusAI: Towards Meaningful Oversight of LLM Reasoning Chains in High-Stakes Clinical Domains*

## Local Development

```bash
git clone https://github.com/gurinderpreetbrraich-cyber/argusai.git
cd argusai
npm install
cp .env.example .env.local
# Add GROQ_API_KEY to .env.local
npm run dev
```

## License

MIT
