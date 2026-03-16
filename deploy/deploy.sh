#!/bin/bash
# Deploy script - run on server after CI copies files
# Usage: ./deploy.sh

set -e
cd "$(dirname "$0")/.."

echo "Pulling latest images..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull

echo "Starting services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

echo "Deploy complete. API available at https://mern-demo.sparkleweb.co.in"
