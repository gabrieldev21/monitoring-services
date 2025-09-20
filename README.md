## Monitoring Services — Microsserviços com Observabilidade (TCC)

Projeto de conclusão de curso, do MBA de Engenharia de Software da USP / Esalq

TEMA: Monitoramento e Observabilidade em Microsserviços Node.js com Ferramentas Open Source

Stack implementada:

- API Gateway (HTTP)
- Microsserviços: ms-auth (HTTP), ms-catalog (HTTP), ms-order (HTTP), ms-notification (HTTP)
- Infra: PostgreSQL, OpenTelemetry Collector, Jaeger, Prometheus, Grafana, Loki

## Sumário

- Sobre o projeto
- Arquitetura e Serviços
- Tecnologias
- Como executar (Docker)
- Autenticação (JWT) e uso das rotas
- Endpoints (API Gateway)
- Observabilidade (Traces, Métricas, Logs)
- Variáveis de ambiente e portas
- Notas
- Licença

## Sobre o projeto

O objetivo é demonstrar boas práticas de observabilidade em um ambiente de microsserviços Node.js/NestJS, cobrindo:

- Tracing distribuído com OpenTelemetry (coletado pelo OTel Collector e visualizado no Jaeger)
- Métricas via OpenTelemetry → OTel Collector → Prometheus → Grafana
- Logs estruturados via OpenTelemetry → OTel Collector → Loki → Grafana (Explore)
- Persistência com PostgreSQL (TypeORM)
- API Gateway centralizando acesso aos serviços

## Arquitetura e Serviços

- `apps/api-gateway`: expõe HTTP e roteia chamadas para ms-catalog, ms-order e ms-notification; faz proxy de autenticação para ms-auth
- `apps/ms-auth`: serviço HTTP para registro/login/refresh e emissão de tokens JWT (HS256)
- `apps/ms-catalog`, `apps/ms-order`, `apps/ms-notification`: serviços HTTP com TypeORM
- `apps/@shared/infra`: SDK de OpenTelemetry (`otel-sdk.ts`), logger OTEL, guard e utilitários de JWT
- `docker-compose.yml`: serviços de aplicação
- `docker-compose-infra.yml`: stack de observabilidade (Prometheus, Grafana, Jaeger, OTel Collector, Loki) e banco (Postgres)

## Tecnologias

- Node.js 20, NestJS 11, TypeScript
- TypeORM + PostgreSQL
- OpenTelemetry Node SDK (traces, métricas e logs via OTLP gRPC)
- OpenTelemetry Collector (pipelines: traces → Jaeger, métricas → Prometheus, logs → Loki)
- Jaeger (UI de traces)
- Prometheus (coleta de métricas do Collector)
- Grafana (dashboards e Explore para logs)
- Docker e Docker Compose
- pnpm (gerenciador de pacotes)

## Como executar (Docker)

Pré-requisitos: Docker e Docker Compose v2

1. Crie a rede compartilhada entre os dois compose:

```powershell
docker network create mynet
```

2. Suba a infraestrutura (Prometheus, Grafana, Jaeger, OTel Collector, Loki, Postgres):

```powershell
docker compose -f docker-compose-infra.yml up -d --build
```

3. Suba os serviços de aplicação:

```powershell
docker compose up -d --build
```

4. Acessos rápidos:

- API Gateway: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3032 (anônimo habilitado como Admin)
- Jaeger UI: http://localhost:8081
- Loki (API): http://localhost:3100
- Postgres: localhost:5432 (admin / admin, DB: tccdb)

## Autenticação (JWT) e uso das rotas

Há um guard global (`JwtAuthGuard`) no API Gateway. Isso significa que TODAS as rotas exigem Authorization: Bearer <accessToken>, exceto as explicitamente públicas.

Rotas públicas (sem token):

- POST `/auth/register` — body: { email: string, password: string }
- POST `/auth/login` — body: { email: string, password: string }
- POST `/auth/refresh` — body: { refreshToken: string }
- GET `/health`

Fluxo típico:

1. Registre-se ou faça login via `/auth/register` ou `/auth/login`
2. Você receberá `{ accessToken, refreshToken, user }`
3. Envie `Authorization: Bearer <accessToken>` para acessar as rotas protegidas (catalog/order/notification)
4. Quando o accessToken expirar (~15 min), use `/auth/refresh` com o `refreshToken` para obter novos tokens (refresh ~7 dias)

Detalhes do JWT:

- Assinatura HS256, emissor (issuer): `ms-auth`
- Segredo configurável via `JWT_SECRET` (padrão: `dev-super-secret-change-me`)

Falhas comuns: sem header ou token inválido retornam 401 com mensagens "Missing token" ou "Invalid token".

## Endpoints (API Gateway)

Base URL: `http://localhost:3000`

- Health
  - GET `/health` → health check simples

- Auth (proxy para ms-auth)
  - POST `/auth/register` (Public)
  - POST `/auth/login` (Public)
  - POST `/auth/refresh` (Public)

- Catálogo (PROTEGIDO)
  - POST `/catalog`
  - GET `/catalog`
  - GET `/catalog/:id`
  - PATCH `/catalog/:id`
  - DELETE `/catalog/:id`

- Pedidos (PROTEGIDO)
  - POST `/order`
  - GET `/order`
  - GET `/order/:id`

- Notificações (PROTEGIDO)
  - POST `/notification`
  - GET `/notification`
  - GET `/notification/:id`
  - PATCH `/notification/:id`
  - DELETE `/notification/:id`

Collection Postman: `collection/collection.json` (defina `{{baseUrl}} = http://localhost:3000` e configure o header Authorization com o accessToken após login/registro).

## Observabilidade (Traces, Métricas, Logs)

Traces (OpenTelemetry → Collector → Jaeger)

- SDK inicializado em cada app via `apps/@shared/infra/otel-sdk.ts`
- Exportador OTLP gRPC envia spans para o Collector (gRPC 4317)
- Collector exporta para Jaeger (gRPC)
- Acesse Jaeger: http://localhost:8081 e filtre por serviço (ex.: `api-gateway`, `ms-auth`, etc.)

Métricas (OpenTelemetry → Collector → Prometheus → Grafana)

- As aplicações enviam métricas via OTLP gRPC para o Collector
- O Collector expõe métricas no endpoint Prometheus em `opentelemetry-collector:8889`
- O `infra/prometheus.yaml` já faz scrape de `opentelemetry-collector:8889` (não há endpoints `/metrics` nos apps)
- Grafana já está provisionado com data source Prometheus (`http://prometheus:9090`)

Logs (OpenTelemetry → Collector → Loki → Grafana)

- As aplicações emitem logs estruturados via `OtelLogger` (OpenTelemetry Logs API)
- O Collector exporta logs para o Loki em `http://loki:3100`
- Para explorar logs no Grafana: abra "Explore", selecione o data source Loki (se necessário, adicione-o em Connections → Data sources, URL `http://loki:3100`) e filtre pelos campos/atributos do log (inclui atributos de recurso como `service.name`)

## Variáveis de ambiente e portas

Aplicações (docker-compose.yml):

- `SERVICE_NAME`: nome do serviço (usado na Resource dos traces/logs/métricas)
- `MS_AUTH_URL`: URL interna do ms-auth (padrão: `http://ms-auth:3001`)
- `JWT_SECRET`: segredo para assinar/verificar os tokens JWT (HS256)
- OTEL (gRPC): Collector em `http://opentelemetry-collector:4317`

Portas (host → container):

- API Gateway: 3000 → 3000
- ms-auth: 3001 → 3001 (HTTP)
- ms-order: 3004 → 3004 (o serviço escuta 3002; o mapeamento de host é opcional e não é usado pelo Gateway)
- ms-catalog: 3002 → 3002 (o serviço escuta 3003; idem observação)
- ms-notification: 3003 → 3003 (o serviço escuta 3004; idem observação)
- Prometheus: 9090 → 9090
- Grafana: 3032 → 3000
- Jaeger UI: 8081 → 16686
- Loki: 3100 → 3100
- OTel Collector: 4317 (gRPC), 8889 (Prometheus exporter)
- Postgres: 5432 → 5432

Obs.: O API Gateway se comunica com os serviços pelo DNS interno do Docker (ex.: `http://ms-order:3002`). Os mapeamentos de portas dos microsserviços para o host são opcionais e apenas úteis para testes diretos a partir do host. Caso precise acessá-los diretamente, ajuste os mapeamentos para refletirem as portas internas reais de cada app.

## Notas

- Healthcheck do API Gateway: `docker-compose.yml` aponta para `/health` (conforme implementado em `apps/api-gateway/src/main.ts`).
- Execução local fora do Docker: a configuração TypeORM usa host `postgres`. Altere para `localhost` quando rodar apps localmente, ou mantenha o banco no Docker.

## Licença

Este projeto está licenciado sob a licença MIT — veja `LICENSE` para detalhes.
