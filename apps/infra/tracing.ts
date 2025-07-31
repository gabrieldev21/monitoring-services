import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';

// Configure the trace exporter
const traceExporter = new OTLPTraceExporter({
  url: 'http://otel-collector:4317',
  compression: 'gzip' as any,
});

// Configure the SDK
const sdk = new NodeSDK({
  serviceName: process.env.SERVICE_NAME ?? 'api-pix-gateway',
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

process.on('beforeExit', async () => {
  await sdk.shutdown();
});

// Initialize the SDK
sdk.start();

export default sdk;
