#!/usr/bin/env bash
set -euo pipefail

strict=0
if [[ "${1:-}" == "--strict" ]]; then
  strict=1
fi

remote_url="$(git config --get remote.origin.url || true)"
if [[ -z "$remote_url" ]]; then
  echo "[WARN] No origin remote configured."
  [[ "$strict" -eq 1 ]] && exit 1 || exit 0
fi

owner_repo=""
if [[ "$remote_url" =~ ^https://github.com/([^/]+/[^/.]+)(\.git)?$ ]]; then
  owner_repo="${BASH_REMATCH[1]}"
elif [[ "$remote_url" =~ ^git@github.com:([^/]+/[^/.]+)(\.git)?$ ]]; then
  owner_repo="${BASH_REMATCH[1]}"
elif [[ "$remote_url" =~ ^ssh://git@github.com/([^/]+/[^/.]+)(\.git)?$ ]]; then
  owner_repo="${BASH_REMATCH[1]}"
fi

if [[ -z "$owner_repo" ]]; then
  echo "[WARN] Origin is not a GitHub repository: $remote_url"
  [[ "$strict" -eq 1 ]] && exit 1 || exit 0
fi

token="${GH_TOKEN:-${GITHUB_TOKEN:-}}"
api_headers=("-H" "Accept: application/vnd.github+json")
if [[ -n "$token" ]]; then
  api_headers+=("-H" "Authorization: Bearer $token")
fi

api_url="https://api.github.com/repos/$owner_repo"
api_response="$(curl -fsSL "${api_headers[@]}" "$api_url" 2>/dev/null || true)"

status="unknown"
if [[ "$api_response" == *'"private": true'* ]]; then
  status="private"
elif [[ "$api_response" == *'"private": false'* ]]; then
  status="public"
else
  html_response="$(curl -fsSL "https://github.com/$owner_repo" 2>/dev/null || true)"
  if [[ "$html_response" == *'octolytics-dimension-repository_public" content="false"'* ]]; then
    status="private"
  elif [[ "$html_response" == *'octolytics-dimension-repository_public" content="true"'* ]]; then
    status="public"
  fi
fi

if [[ "$status" == "private" ]]; then
  echo "[OK] Repository visibility is private: $owner_repo"
  exit 0
fi

if [[ "$status" == "public" ]]; then
  echo "[WARN] Repository is public: $owner_repo"
  echo "       To enforce privacy, run: bash scripts/github-set-private.sh"
  [[ "$strict" -eq 1 ]] && exit 1 || exit 0
fi

echo "[WARN] Could not determine repository visibility for $owner_repo"
[[ "$strict" -eq 1 ]] && exit 1 || exit 0
