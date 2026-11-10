#!/usr/bin/env bash
# One-shot: copy to your code folder, install shadcn via CLI, update deps,
# push to a new PUBLIC GitHub repo, and deploy to Railway from that repo.
# Usage:  ./ship.sh [code-folder]      (default: ~/code)
set -euo pipefail

CODE_DIR="${1:-$HOME/code}"
NAME="genre-browser"
DEST="$CODE_DIR/$NAME"
HERE="$(cd "$(dirname "$0")" && pwd)"

need() { command -v "$1" >/dev/null || { echo "✗ Missing '$1'. Install it: $2"; exit 1; }; }
need node    "brew install node"
need git     "xcode-select --install"
need gh      "brew install gh && gh auth login"
need railway "brew install railway && railway login"
gh auth status >/dev/null 2>&1 || { echo "✗ Run: gh auth login"; exit 1; }
railway whoami >/dev/null 2>&1 || { echo "✗ Run: railway login"; exit 1; }

echo "→ Copying project to $DEST"
mkdir -p "$CODE_DIR"
if [ -e "$DEST" ]; then echo "✗ $DEST already exists"; exit 1; fi
rsync -a --exclude node_modules --exclude dist --exclude ship.sh "$HERE/" "$DEST/"
cd "$DEST"
[ -d .git ] || { git init -q -b main; git add -A; git commit -qm "Genre Browser: React + shadcn + Motion"; }

echo "→ Updating dependencies to latest (ncu -u)"
npx -y npm-check-updates -u
npm install

echo "→ Installing shadcn components with the official CLI"
git add -A && git commit -qm "chore: update deps" || true
if npx -y shadcn@latest add button input badge toggle sheet toggle-group --overwrite --yes && npm run build; then
  git add -A && git commit -qm "chore: install shadcn components via CLI" || true
  echo "  ✓ shadcn CLI install builds cleanly"
else
  echo "  ! shadcn CLI output didn't build; keeping the verified upstream copies"
  git reset -q --hard && git clean -fdq
  npm install
fi
npm run build

echo "→ Creating public GitHub repo and pushing"
gh repo create "$NAME" --public --source . --remote origin --push \
  --description "Accessible, animated genre browser for WRDS 1103 (React, shadcn/ui, Motion)"
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
echo "  ✓ https://github.com/$REPO"

echo "→ Deploying to Railway from GitHub"
railway init --name "$NAME"
if railway add --service "$NAME" --repo "$REPO"; then
  railway service "$NAME"
else
  echo "  ! Couldn't link the GitHub repo from the CLI; deploying the folder directly instead"
  railway up --detach
fi
railway domain || true
echo "✓ Done. Railway will build with 'npm run build' and serve with 'npm start' (see railway.json)."
echo "  If the service shows no GitHub link, connect $REPO under Service → Settings → Source to auto-deploy on push."
