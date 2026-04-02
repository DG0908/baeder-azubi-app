# ─── Stage 1: Build ───────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .

# Build-time env vars injected by Coolify via --build-arg
ARG VITE_API_BASE_URL=https://api.smartbaden.de/api
ARG VITE_WEB_PUSH_PUBLIC_KEY=""
ARG VITE_PUSH_BACKEND_URL=""

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WEB_PUSH_PUBLIC_KEY=$VITE_WEB_PUSH_PUBLIC_KEY
ENV VITE_PUSH_BACKEND_URL=$VITE_PUSH_BACKEND_URL

RUN npm run build

# ─── Stage 2: Serve ───────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
