#!/usr/bin/env bash
# Run from your Mac's Terminal:  cd ~/code/genre-browser && ./deploy.sh
# 1) shadcn CLI install (kept only if it builds)  2) public GitHub repo + push  3) Railway CLI deploy
set -euo pipefail
cd "$(dirname "$0")"
NAME="genre-browser"

need() { command -v "$1" >/dev/null || { echo "✗ Missing '$1' — install with: $2"; exit 1; }; }
need gh      "brew install gh"
need railway "brew install railway"
gh auth status >/dev/null 2>&1 || gh auth login
railway whoami >/dev/null 2>&1 || railway login

echo "→ Installing dependencies"
npm install --no-audit --no-fund

echo "→ shadcn components via the official CLI"
if npx -y shadcn@latest add button input badge toggle toggle-group sheet --overwrite --yes && npm run build; then
  git add -A && git commit -qm "chore: install shadcn components via CLI" || true
  echo "  ✓ shadcn CLI components build cleanly"
else
  echo "  ! CLI output didn't build — keeping the verified components"
  git checkout -- . && git clean -fdq src
fi
npm run build

echo "→ Creating public GitHub repo and pushing"
if git remote get-url origin >/dev/null 2>&1; then
  git push -u origin main
else
  gh repo create "$NAME" --public --source . --remote origin --push \
    --description "Accessible, animated genre browser for WRDS 1103 (React, shadcn/ui, Motion)"
fi
REPO="$(gh repo view --json url -q .url)"
echo "  ✓ $REPO"

echo "→ Deploying with the Railway CLI"
railway status >/dev/null 2>&1 || railway init --name "$NAME"
railway up --detach
railway domain || true
echo
echo "✓ Done — GitHub: $REPO"
echo "  Railway builds with 'npm run build' and serves with 'npm start' (railway.json)."
echo "  Watch it with: railway logs"
