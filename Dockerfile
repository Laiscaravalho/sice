# ─────────────────────────────────────────────────────────────────────────────
# Sice — Dockerfile para Azure Container Apps / Azure App Service
# Build multi-stage: instala dependências → build → imagem final mínima
# ─────────────────────────────────────────────────────────────────────────────

# ── 1. Dependências base ──────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Instala dependências nativas necessárias para o Prisma
RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instala todas as dependências (incluindo dev para o build)
RUN npm ci

# Gera o Prisma Client para a plataforma linux/musl (Alpine)
RUN npx prisma generate


# ── 2. Build da aplicação ─────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY . .

# Gera o build standalone do Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# ── 3. Imagem final de produção ───────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Azure App Service usa a porta 8080 por padrão
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

RUN apk add --no-cache openssl

# Cria usuário não-root (boa prática de segurança)
RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

# Copia apenas o necessário do build standalone
COPY --from=builder /app/public                        ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone  ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static      ./.next/static

# Copia o schema Prisma para poder rodar migrations em runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=deps    /app/node_modules/.prisma          ./node_modules/.prisma
COPY --from=deps    /app/node_modules/@prisma          ./node_modules/@prisma

USER nextjs

EXPOSE 8080

# Healthcheck para o Azure saber que o container está saudável
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health 2>/dev/null || exit 1

# Inicia o servidor standalone do Next.js
CMD ["node", "server.js"]
