#!/usr/bin/env bash
babel -d dist/ ./src -s --extensions '.js,.jsx,.ts,.tsx' --ignore '**/*.test.js,**/*.test.ts'