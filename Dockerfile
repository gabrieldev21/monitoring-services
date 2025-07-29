# Multi-stage build para otimização
FROM node:20.10.0-alpine AS base

# Instalar pnpm
RUN npm install -g pnpm

# Estágio de dependências
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Estágio de build
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build argument para especificar qual app buildar
ARG APP_NAME
RUN pnpm run build ${APP_NAME}

# Estágio de produção
FROM base AS runner
WORKDIR /app

# Copiar apenas os arquivos necessários
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Build argument para especificar qual app executar
ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Comando dinâmico baseado no APP_NAME
CMD pnpm run start:prod:${APP_NAME}
