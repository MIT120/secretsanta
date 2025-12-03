FROM node:20-alpine

# Install yarn
RUN corepack enable && corepack prepare yarn@4.5.1 --activate

WORKDIR /app

# Copy package files
COPY package.json .yarnrc.yml ./
COPY .yarn ./.yarn

# Install dependencies (including devDependencies for dev server)
RUN yarn install

# Copy source code
COPY . .

# Expose port (Vite dev server default is 5173, but can be overridden)
EXPOSE 5173

# Set default PORT if not provided
ENV PORT=5173

# Start the dev server
CMD ["sh", "-c", "npm run dev"]

