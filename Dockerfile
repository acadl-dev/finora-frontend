# syntax=docker/dockerfile:1
# ---------------------------------------------------------------------------
# Front-end Finora (Next.js) — imagem de produção (multi-stage, output standalone)
#   deps    -> instala as dependências exatamente como no package-lock (npm ci)
#   build   -> next build (gera .next/standalone)
#   runtime -> só o servidor Node mínimo, usuário sem privilégios
# API_BASE_URL (endereço do gateway) é lido em TEMPO DE EXECUÇÃO pelas rotas /api.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S finora && adduser -S finora -G finora
COPY --from=build --chown=finora:finora /app/public ./public
COPY --from=build --chown=finora:finora /app/.next/standalone ./
COPY --from=build --chown=finora:finora /app/.next/static ./.next/static
USER finora

EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
