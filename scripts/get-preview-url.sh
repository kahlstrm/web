#!/bin/bash
# Get Vercel preview URL for current commit from GitHub API

set -e

# Get current commit SHA
COMMIT_SHA=$(git rev-parse HEAD)

# Fetch check runs from GitHub API and extract preview URL
echo "Fetching preview URL for commit $COMMIT_SHA..."

PREVIEW_URL=$(curl -sL "https://api.github.com/repos/kahlstrm/web/commits/$COMMIT_SHA/check-runs" \
  | grep -oE '[a-z0-9-]+\.vercel\.app' \
  | head -1)

if [ -z "$PREVIEW_URL" ]; then
  echo "❌ Could not find preview URL. The deployment might still be in progress."
  echo "   Wait 10-15 seconds and try again."
  exit 1
fi

echo ""
echo "✅ Preview URL found:"
echo "   https://$PREVIEW_URL"
echo ""
echo "📋 Quick links:"
echo "   Homepage:     https://$PREVIEW_URL"
echo "   Blog:         https://$PREVIEW_URL/blog"
echo "   Example post: https://$PREVIEW_URL/blog/example-post"
