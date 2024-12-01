# Build stage
FROM node:16-alpine as builder

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install root dependencies
RUN npm ci

# Copy frontend package files
COPY frontend/package*.json ./frontend/

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm ci

# Copy all source files
WORKDIR /app
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Production stage
FROM node:16-alpine

WORKDIR /app

# Install health check dependencies
RUN apk add --no-cache curl tini

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend and backend files
COPY --from=builder /app/frontend/build ./frontend/build
COPY --from=builder /app/backend ./backend
COPY scripts/healthcheck.sh /healthcheck.sh
RUN chmod +x /healthcheck.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD /healthcheck.sh

# Use tini as init
ENTRYPOINT ["/sbin/tini", "--"]

# Default command
CMD ["npm", "start"] 