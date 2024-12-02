FROM node:18

# Set working directory
WORKDIR /app

# Create frontend/public directory and index.html
RUN mkdir -p frontend/public
RUN echo "<!DOCTYPE html><html><head><meta charset='utf-8'><title>7K Chat</title></head><body><div id='root'></div></body></html>" > frontend/public/index.html

# Copy all files
COPY . .

# Install dependencies and build frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Start the application
WORKDIR /app
CMD ["npm", "start"] 