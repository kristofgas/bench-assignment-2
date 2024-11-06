FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production image
FROM node:18-alpine AS production
WORKDIR /app

# Copy built assets
COPY --from=base /app/package*.json ./
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.js ./

# Install production dependencies
RUN npm ci --only=production

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]