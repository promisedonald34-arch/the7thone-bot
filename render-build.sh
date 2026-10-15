#!/usr/bin/env bash
set -o errexit
npm install
npx @puppeteer/browsers install chrome@stable --path /opt/render/.cache/puppeteer
