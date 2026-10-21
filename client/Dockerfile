
# Stage 1: Build the frontend
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY ./ ./
RUN npm run build

# Stage 2: Serve the frontend with Caddy
FROM caddy:2-alpine

COPY --from=frontend /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
