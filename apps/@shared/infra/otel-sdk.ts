import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';

const otelSDK = new NodeSDK({
  serviceName: process.env.SERVICE_NAME || 'api-gateway',
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_TRACES_URL ?? 'http://localhost:4317',
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: (req) => {
          return req.url?.includes('/health');
        },
      },
      '@opentelemetry/instrumentation-express': {
        enabled: false,
      },
      '@opentelemetry/instrumentation-nestjs-core': {},
      '@opentelemetry/instrumentation-net': {
        enabled: false,
      },
    }),
  ],
});

process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});

export default otelSDK;
