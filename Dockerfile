# Build stage
FROM node:20-alpine AS builder

# Install yarn
RUN corepack enable && corepack prepare yarn@4.5.1 --activate

WORKDIR /app

# Copy package files
COPY package.json .yarnrc.yml ./
COPY .yarn ./.yarn

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Expose port (default 3000, can be overridden with PORT env var)
EXPOSE 3000

# Set default PORT if not provided
ENV PORT=3000

# Start the server
CMD ["sh", "-c", "serve -s dist -l $PORT"]

