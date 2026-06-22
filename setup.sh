#!/bin/bash
# ArgusAI — one-command GitHub setup
# Usage: bash setup.sh YOUR_GITHUB_USERNAME

set -e

USERNAME=${1:-"YOUR_GITHUB_USERNAME"}

if [ "$USERNAME" = "YOUR_GITHUB_USERNAME" ]; then
  echo "❌  Usage: bash setup.sh your-github-username"
  exit 1
fi

echo "◈ ArgusAI — setting up Git repo"

# Init if needed
if [ ! -d ".git" ]; then
  git init
  echo "✓ Initialized git repo"
fi

# Add gitignore protection check
if grep -q ".env.local" .gitignore 2>/dev/null; then
  echo "✓ .gitignore is protecting your secrets"
else
  echo ".env.local" >> .gitignore
  echo ".env.local.save" >> .gitignore
  echo "✓ Added .env.local to .gitignore"
fi

# Stage and commit
git add .
git commit -m "feat: ArgusAI v2 — full-stack LLM reasoning oversight" 2>/dev/null || echo "✓ Nothing new to commit"

# Set remote
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/${USERNAME}/argusai.git"
echo "✓ Remote set to github.com/${USERNAME}/argusai"

# Push
echo ""
echo "→ Pushing to GitHub (enter your Personal Access Token as password)..."
git push -u origin main

echo ""
echo "✅  Done! Your repo is live at:"
echo "   https://github.com/${USERNAME}/argusai"
echo ""
echo "→ Next: go to vercel.com → New Project → import argusai → Deploy"
