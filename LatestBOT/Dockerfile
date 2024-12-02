FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy backend package files
COPY package*.json ./

# Install backend dependencies
RUN npm install --legacy-peer-deps

# Copy frontend package files (if they exist)
COPY frontend/package*.json ./frontend/

# Install frontend dependencies (if they exist)
WORKDIR /usr/src/app/frontend
RUN if [ -f "package.json" ]; then npm install --legacy-peer-deps; fi

# Go back to main directory
WORKDIR /usr/src/app

# Copy all source files
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD [ "npm", "start" ] 