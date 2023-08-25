#!/usr/bin/env bash
./node_modules/.bin/babel -d dist/ ./src -s --extensions '.js,.jsx,.ts,.tsx' --ignore '**/*.test.js,**/*.test.ts'
./node_modules/.bin/babel -d dist/server/pages ./src/pages --extensions '.js,.jsx,.ts,.tsx' --ignore '**/*.test.js,**/*.test.ts'