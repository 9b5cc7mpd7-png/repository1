#!/usr/bin/env bash
set -euo pipefail

token="${GH_TOKEN:-${GITHUB_TOKEN:-}}"
if [[ -z "$token" ]]; then
  echo "GH_TOKEN or GITHUB_TOKEN is required."
  echo "Create a GitHub token with repository admin permissions and export it first."
  exit 1
fi

remote_url="$(git config --get remote.origin.url || true)"
if [[ -z "$remote_url" ]]; then
  echo "No origin remote configured."
  exit 1
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
  echo "Origin is not a GitHub repository: $remote_url"
  exit 1
fi

response="$(curl -fsSL -X PATCH \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $token" \
  "https://api.github.com/repos/$owner_repo" \
  -d '{"private":true}')"

if [[ "$response" == *'"private": true'* ]]; then
  echo "Repository is now private: $owner_repo"
  exit 0
fi

echo "Failed to set repository private."
exit 1
