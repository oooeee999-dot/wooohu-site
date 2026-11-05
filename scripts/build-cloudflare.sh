#!/usr/bin/env bash
set -euo pipefail
# Ensure Ruby reads non-ASCII filenames (such as 白底.jpg) as UTF-8.
export LANG=C.UTF-8
export LC_ALL=C.UTF-8
export RUBYOPT="${RUBYOPT:-} -EUTF-8:UTF-8"
ruby -e 'abort "UTF-8 locale required" unless Encoding.find("filesystem") == Encoding::UTF_8; puts "Ruby filesystem encoding: #{Encoding.find("filesystem")}"'
node scripts/build-arrivals.cjs
JEKYLL_ENV=production bundle exec jekyll build --trace
python3 scripts/check-site.py
