#!/bin/bash

# Health check endpoint
HEALTH_ENDPOINT="http://localhost:${PORT:-3000}/health"

# Maximum number of retries
MAX_RETRIES=5
RETRY_INTERVAL=5

for i in $(seq 1 $MAX_RETRIES); do
    response=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_ENDPOINT)
    
    if [ $response -eq 200 ]; then
        echo "Health check passed"
        exit 0
    else
        echo "Health check failed (attempt $i/$MAX_RETRIES). Retrying in ${RETRY_INTERVAL}s..."
        sleep $RETRY_INTERVAL
    fi
done

echo "Health check failed after $MAX_RETRIES attempts"
exit 1 