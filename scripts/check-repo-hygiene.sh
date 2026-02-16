#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$repo_root"

errors=0

for pattern in \
  'dist/**' \
  'coverage/**' \
  'playwright-report/**' \
  'test-results/**' \
  '.lighthouseci/**' \
  '.vscode/settings.json' \
  '.vscode/launch.json'
do
  tracked="$(git ls-files "$pattern")"
  if [[ -n "$tracked" ]]; then
    echo "[ERROR] Generated/local files are tracked for pattern: $pattern"
    echo "$tracked"
    errors=1
  fi
done

tracked_sensitive="$(git ls-files | grep -E '(^|/)\.env($|\.|/)|(^|/).*\.pem$|(^|/).*\.key$|(^|/)id_rsa($|\.|/)' || true)"
if [[ -n "$tracked_sensitive" ]]; then
  echo "[ERROR] Potentially sensitive files are tracked:" 
  echo "$tracked_sensitive"
  errors=1
fi

required_files=(
  package.json
  package-lock.json
  tsconfig.json
  vite.config.ts
  vitest.config.ts
  README.md
  .github/workflows/ci.yml
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "[ERROR] Missing required project file: $file"
    errors=1
  fi
done

if [[ "$errors" -ne 0 ]]; then
  echo "Repository hygiene check failed."
  exit 1
fi

echo "Repository hygiene check passed."
