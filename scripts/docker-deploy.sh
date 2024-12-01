#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Build the Docker image
echo "Building Docker image..."
docker build -t seven7k-chat:latest .

# Run pre-deploy tasks
echo "Running pre-deploy tasks..."
docker run --rm \
  --env-file .env \
  seven7k-chat:latest \
  npm run predeploy

# Start the application
echo "Starting application..."
docker run -d \
  --name seven7k-chat \
  --restart unless-stopped \
  --env-file .env \
  -p 3000:3000 \
  seven7k-chat:latest

echo "Deployment completed successfully!" 