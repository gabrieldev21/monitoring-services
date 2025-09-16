## Monitoring Services — Microsserviços com Observabilidade (TCC)

Projeto de estudo/TCC focado em Monitoramento e Observabilidade em Microsserviços Node.js utilizando ferramentas open source: OpenTelemetry, Prometheus, Grafana e Jaeger.

Este repositório implementa uma arquitetura com:

- API Gateway (HTTP)
- Microsserviços: ms-auth (TCP/Nest Microservices), ms-catalog (HTTP), ms-order (HTTP), ms-notification (HTTP)
- Infra: PostgreSQL, OpenTelemetry Collector, Jaeger, Prometheus, Grafana

## Sumário

- Sobre o projeto
- Arquitetura e Serviços
- Tecnologias
- Como executar (Docker)
- Endpoints principais (API Gateway)
- Observabilidade (Métricas, Traces, Dashboards)
- Postman Collection
- Variáveis de ambiente e portas
- Notas e limitações conhecidas
- Licença

## Sobre o projeto

O objetivo é demonstrar boas práticas de observabilidade em um ambiente de microsserviços Node.js/NestJS, cobrindo:

- Tracing distribuído com OpenTelemetry (coletado pelo OTel Collector e visualizado no Jaeger)
- Métricas com Prometheus (exposição via prom-client) e visualização no Grafana
- Integração entre serviços via API Gateway e transporte TCP (Nest Microservices) para o serviço de autenticação
- Persistência com PostgreSQL (TypeORM)

## Arquitetura e Serviços

Visão geral (simplificada):

```
┌────────────────┐        HTTP         ┌──────────────────────┐
│   API Gateway  │  ─────────────────▶ │  ms-catalog (HTTP)   │
│ (Nest HTTP)    │        HTTP         └──────────────────────┘
│                │  ─────────────────▶ │  ms-order (HTTP)     │
│ /auth -> TCP   │        HTTP         └──────────────────────┘
│ (via Client)   │  ─────────────────▶ │  ms-notification     │
│                │                      │  (HTTP)             │
│ /auth/metrics  │ ◀─ TCP (metrics)     └──────────────────────┘
└────────────────┘        │
					▲               │
					│ TCP           ▼
					│       ┌──────────────────────┐
					└──────▶│  ms-auth (Nest TCP) │
									└──────────────────────┘

Infra:
Prometheus ← scrape /metrics (API Gateway) e /auth/metrics (via Gateway)
Grafana ← dashboards a partir do Prometheus
OTel Collector ← recebe OTLP dos serviços e exporta para Jaeger
Jaeger ← UI de traces distribuídos
PostgreSQL ← base para ms-catalog, ms-order, ms-notification (TypeORM)
```

Diretórios principais:

- `apps/api-gateway`: expõe HTTP e roteia chamadas para os microsserviços; integra com ms-auth via TCP
- `apps/ms-auth`: microsserviço Nest (Transport.TCP) para validação de usuário e métricas via mensagem
- `apps/ms-catalog`, `apps/ms-order`, `apps/ms-notification`: serviços HTTP com TypeORM
- `apps/@shared/infra`: utilitários de tracing (`otel-sdk.ts`, `tracing-utils.ts`) e configuração TypeORM
- `docker-compose.yml`: serviços de aplicação
- `docker-compose-infra.yml`: stack de observabilidade e banco

## Tecnologias

- Node.js 20, NestJS 11, TypeScript
- Nest Microservices (TCP) para ms-auth
- TypeORM + PostgreSQL
- OpenTelemetry Node SDK com auto-instrumentations
- OpenTelemetry Collector (OTLP gRPC/HTTP)
- Jaeger (traces)
- Prometheus (scrape de métricas)
- Grafana (dashboards)
- Docker e Docker Compose
- pnpm (gerenciador de pacotes)

## Como executar (Docker)

Pré-requisitos:

- Docker e Docker Compose v2

1. Criar a rede externa (usada pelos dois compose):

```powershell
docker network create mynet
```

2. Subir a infraestrutura (Prometheus, Grafana, Jaeger, OTel Collector, Postgres):

```powershell
docker compose -f docker-compose-infra.yml up -d --build
```

3. Subir os serviços de aplicação:

```powershell
docker compose up -d --build
```

4. Acessos rápidos:

- API Gateway: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3032 (login padrão admin / admin)
- Jaeger UI: http://localhost:8081
- Postgres: localhost:5432 (admin / admin, DB: tccdb)

## Endpoints principais (API Gateway)

Base URL: `http://localhost:3000`

- Saúde e métricas do Gateway
  - GET `/metrics` → expõe métricas Prometheus do Gateway
  - GET `/metrics/health` → health check simples (incrementa contador)

- Auth (via ms-auth por TCP)
  - POST `/auth/validate` → validação de usuário (gera trace e métrica no ms-auth)
  - GET `/auth/metrics` → expõe métricas do ms-auth (proxy via mensagem)

- Catálogo (HTTP → ms-catalog)
  - POST `/catalog`
  - GET `/catalog`
  - GET `/catalog/:id`
  - PATCH `/catalog/:id`
  - DELETE `/catalog/:id`

- Pedidos (HTTP → ms-order)
  - POST `/order`
  - GET `/order`
  - GET `/order/:id`

- Notificações (HTTP → ms-notification)
  - POST `/notification`
  - GET `/notification`
  - GET `/notification/:id`
  - PATCH `/notification/:id`
  - DELETE `/notification/:id`

Você pode importar a collection Postman em `collection/collection.json` e usar a variável `{{baseUrl}} = http://localhost:3000`.

## Observabilidade

Tracing distribuído (OpenTelemetry → Collector → Jaeger)

- Cada aplicação inicia o SDK com `apps/@shared/infra/otel-sdk.ts`
- Exportador OTLP gRPC envia spans para o Collector (`OTEL_EXPORTER_OTLP_TRACES_URL`)
- O Collector reenvia para o Jaeger (gRPC)
- Acesse o Jaeger: http://localhost:8081 e filtre pelo service (ex.: `api-gateway`, `ms-auth` etc.)

Métricas (Prometheus → Grafana)

- API Gateway expõe `/metrics` (Prometheus scrape)
- ms-auth expõe métricas indiretamente via `/auth/metrics` no Gateway
- Arquivo `prometheus.yml` já contém jobs:
  - `api-gateway` → `api-gateway:3000/metrics`
  - `ms-auth` → `api-gateway:3000/auth/metrics`
- Acesse Prometheus (http://localhost:9090) para explorar métricas
- Acesse Grafana (http://localhost:3032) e adicione Prometheus como data source (URL: http://prometheus:9090)

Exemplos de métricas customizadas

- API Gateway: `http_api_gateway_requests_total{httpStatus="200"}` (incrementada no health)
- ms-auth (TCP): `tcp_ms_auth_requests_total{httpStatus="200"}` (incrementada ao validar usuário)

## Variáveis de ambiente e portas

Serviços de aplicação (docker-compose.yml):

- `SERVICE_NAME`: identifica o serviço para o tracer
- `OTEL_EXPORTER_OTLP_TRACES_URL`: URL OTLP gRPC (padrão: `http://otel-collector:4317` dentro do Docker)
- `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`: endpoint OTLP HTTP (Collector) — presente para compatibilidade
- `PROMETHEUS_URL`: referência/variável informativa usada no projeto

Portas internas (aplicações):

- API Gateway (HTTP): 3000
- ms-auth (Nest Microservices TCP): 3001
- ms-order (HTTP): 3002
- ms-catalog (HTTP): 3003
- ms-notification (HTTP): 3004
- Prometheus: 9090 → 9090
- Grafana: 3032 → 3000
- Jaeger UI: 8081 → 16686
- OTel Collector: 4317 (gRPC), 4318 (HTTP)
- Postgres: 5432 → 5432

## Notas e limitações conhecidas

- Healthcheck do API Gateway: no `docker-compose.yml`, o healthcheck aponta para `/health`, mas o endpoint existente é `/metrics/health`. Recomenda-se ajustar o healthcheck para `http://0.0.0.0:3000/metrics/health`.
- Mapeamento de portas no docker-compose: as portas mapeadas atualmente são `ms-catalog: 3002:3002`, `ms-notification: 3003:3003`, `ms-order: 3004:3004`, porém as aplicações escutam internamente em `ms-catalog:3003`, `ms-notification:3004`, `ms-order:3002`. Para acesso via host diretamente a esses serviços, ajuste os mapeamentos para refletirem as portas internas corretas (ex.: `ms-catalog: 3003:3003`). Comunicação entre containers via DNS (ex.: `http://ms-catalog:3003`) segue funcionando.
- Execução local (fora do Docker): a configuração TypeORM (`apps/@shared/infra/typeorm.config.ts`) usa host `postgres` (nome do serviço Docker). Para rodar fora do Docker, ajuste para `localhost` ou utilize variáveis de ambiente/config específica.
- ms-auth usa Nest Microservices (TCP). Não há endpoints HTTP nesse serviço; todo acesso é via Gateway.
- Segurança/autenticação: fora do escopo deste estudo. Endpoints expostos sem autenticação.

## Licença

Este projeto está licenciado sob a licença MIT — veja `LICENSE` para detalhes.

## Como executar local (sem Docker) — opcional

Observação: para ter observabilidade completa sem ajustes de configuração, recomenda-se usar Docker para os apps. A execução local é útil para desenvolvimento rápido, mas pode exigir ajustes.

1. Instale dependências:

```powershell
pnpm install
```

2. Suba apenas a infraestrutura (mantendo apps locais):

```powershell
docker compose -f docker-compose-infra.yml up -d
```

3. Rode os serviços localmente em terminais separados:

```powershell
# API Gateway
pnpm exec nest start api-gateway --watch

# ms-auth (TCP)
pnpm exec nest start ms-auth --watch

# ms-catalog
pnpm exec nest start ms-catalog --watch

# ms-order
pnpm exec nest start ms-order --watch

# ms-notification
pnpm exec nest start ms-notification --watch
```

4. Acesse o Gateway em http://localhost:3000

Notas para execução local:

- TypeORM está configurado com host `postgres` (nome do serviço Docker). Para rodar apps fora do Docker, altere `apps/@shared/infra/typeorm.config.ts` para `localhost` ou crie uma estratégia de configuração por ambiente.
- Prometheus (em Docker) não enxerga serviços executando no host via `localhost`. Você pode ajustar `prometheus.yml` para usar `host.docker.internal:3000` (Windows/Mac) quando rodar o Gateway localmente, ou preferir executar os apps dentro do Docker para manter a configuração padrão.

## Anexo: comandos úteis (Nest)

Gerar novos apps (histórico do projeto):

```bash
nest generate app ms-auth
nest generate app ms-catalog
nest generate app ms-order
nest generate app ms-notification
```
