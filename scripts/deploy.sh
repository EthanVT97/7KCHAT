#!/bin/bash

# Environment check
if [ -z "$NODE_ENV" ]; then
    echo "NODE_ENV not set. Defaulting to production"
    export NODE_ENV=production
fi

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Build frontend
echo "Building frontend..."
cd frontend
npm install --production
npm run build
cd ..

# Database migrations
echo "Running database migrations..."
npm run migrate

# Start the application
echo "Starting application..."
if [ "$NODE_ENV" = "production" ]; then
    pm2 start ecosystem.config.js
else
    npm start
fi 