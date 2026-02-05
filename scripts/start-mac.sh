#!/bin/bash
set -e

cd "$(dirname "$0")/.."
docker compose up --build -d
echo "Prelegal started at http://localhost:8000"
