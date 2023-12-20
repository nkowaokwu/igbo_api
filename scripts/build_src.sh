#!/usr/bin/env bash
./node_modules/.bin/babel -d dist/ ./src -s --extensions '.js,.jsx,.ts,.tsx' --ignore '**/__tests__/**,**/*.test.js,**/*.test.ts,**/*.test.tsx'