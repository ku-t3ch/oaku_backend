# Use Node.js LTS version
FROM node:18-alpine

# Install curl and bash for healthcheck
RUN apk add --no-cache curl bash

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Copy source code
COPY . .

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Remove devDependencies after build to reduce image size
RUN npm prune --production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 4001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:4001/health || exit 1

# Start command
CMD ["npm", "start"]