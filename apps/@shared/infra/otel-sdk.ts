import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { FastifyOtelInstrumentation } from '@fastify/otel';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';

import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const options = {
  url: 'http://opentelemetry-collector:4317',
  compression: CompressionAlgorithm.GZIP,
};
const metricExporter = new OTLPMetricExporter(options);

const traceExporter = new OTLPTraceExporter(options);

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  // exporter: new ConsoleMetricExporter(),
  exportIntervalMillis: Number(5000),
  exportTimeoutMillis: Number(5000),
});

const fastifyOtelInstrumentation = new FastifyOtelInstrumentation({
  registerOnInitialization: true,
});
const sdk = new NodeSDK({
  serviceName: process.env.SERVICE_NAME ?? 'unknown_service',
  metricReader,
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: (req) =>
          req.url?.includes('/health') ?? false,
      },
      '@opentelemetry/instrumentation-express': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-nestjs-core': {},
      '@opentelemetry/instrumentation-net': { enabled: false },
    }),
    fastifyOtelInstrumentation,
  ],
});

process.on('beforeExit', async () => {
  await sdk.shutdown();
});

sdk.start();

export {};
