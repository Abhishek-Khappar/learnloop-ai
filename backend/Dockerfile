# LearnLoop AI — API container
# Build from repo root: docker compose build backend
FROM node:20-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --omit=dev

COPY backend/ ./
# Prompts live next to backend/ in the repo; llm.js reads ../prompts from /app → /prompts
COPY prompts/ /prompts/

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
