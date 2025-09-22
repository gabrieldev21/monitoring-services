import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from '@opentelemetry/sdk-logs';
import { logs } from '@opentelemetry/api-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const options = {
  url: 'http://opentelemetry-collector:4317',
  compression: CompressionAlgorithm.GZIP,
};

const metricExporter = new OTLPMetricExporter(options);
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: Number(process.env.METRICS_EXPORT_INTERVAL_MS ?? 15000),
  exportTimeoutMillis: Number(process.env.METRICS_EXPORT_TIMEOUT_MS ?? 10000),
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

logs.setGlobalLoggerProvider(loggerProvider);

const sdk = new NodeSDK({
  serviceName: process.env.SERVICE_NAME ?? 'unknown_service',
  metricReader: process.env.SERVICE_NAME === 'api-gateway' && metricReader,
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: (req) => {
          const url = req.url ?? '';
          return url.includes('/health') || url.includes('/metrics');
        },
        ignoreOutgoingRequestHook: (options) => {
          const host =
            typeof options === 'string'
              ? options
              : options?.hostname || options?.host || '';
          return host.includes('opentelemetry-collector');
        },
      },
      '@opentelemetry/instrumentation-nestjs-core': {},
      '@opentelemetry/instrumentation-net': { enabled: false },
    }),
  ],
});

process.on('SIGTERM', async () => {
  try {
    await sdk.shutdown();
    await loggerProvider.shutdown();
    process.exit(0);
  } catch {
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  try {
    await sdk.shutdown();
    await loggerProvider.shutdown();
    process.exit(0);
  } catch {
    process.exit(1);
  }
});

sdk.start();

export { loggerProvider };
