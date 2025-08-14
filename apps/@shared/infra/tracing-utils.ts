import { context, propagation } from '@opentelemetry/api';

export function injectOtelContext(payload: Record<string, any>) {
  const carrier: Record<string, any> = {};
  propagation.inject(context.active(), carrier);
  return { ...payload, otel: carrier };
}

export function extractOtelContext<T = any>(data: any, handler: () => T): T {
  const ctx = propagation.extract(context.active(), data.otel || {});
  return context.with(ctx, handler);
}
