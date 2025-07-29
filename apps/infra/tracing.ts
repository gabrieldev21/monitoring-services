import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  OTLPTraceExporter,
  // CompressionAlgorithm,
} from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { KnexInstrumentation } from '@opentelemetry/instrumentation-knex';

// Configure the trace exporter
const traceExporter = new OTLPTraceExporter({
  url: 'http://otel-collector:4317',
  compression: 'gzip' as any,
});

// Configure the SDK
const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [SemanticResourceAttributes.SERVICE_NAME]:
      process.env.SERVICE_NAME ?? 'api-pix-gateway',
  }),
  traceExporter,
  instrumentations: [
    new HttpInstrumentation(),
    new KnexInstrumentation(),
    getNodeAutoInstrumentations({
      // Disable specific instrumentations if needed
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
  ],
});

process.on('beforeExit', async () => {
  await sdk.shutdown();
});

// Initialize the SDK
sdk.start();

export default sdk;
