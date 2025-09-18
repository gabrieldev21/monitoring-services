import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { FastifyOtelInstrumentation } from '@fastify/otel';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from '@opentelemetry/sdk-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const options = {
  url: 'http://opentelemetry-collector:4317',
  compression: CompressionAlgorithm.GZIP,
};
// const options = {
//   url: 'grpc://opentelemetry-collector:4317',
//   compression: CompressionAlgorithm.GZIP,
// };
const metricExporter = new OTLPMetricExporter(options);
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: Number(5000),
  exportTimeoutMillis: Number(5000),
});

const traceExporter = new OTLPTraceExporter(options);

const logExporter = new OTLPLogExporter(options);
const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': process.env.SERVICE_NAME ?? 'unknown_service',
  }),
  processors: [new BatchLogRecordProcessor(logExporter)],
  forceFlushTimeoutMillis: 3000,
});

const logger = loggerProvider.getLogger('app-logger');
logger.emit({ body: 'Hello OTEL logs!' });

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
