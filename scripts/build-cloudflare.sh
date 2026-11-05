#!/usr/bin/env bash
set -euo pipefail
node scripts/build-arrivals.cjs
JEKYLL_ENV=production bundle exec jekyll build
python3 scripts/check-site.py
