import {
  context,
  propagation,
  trace,
  SpanKind,
  Span,
} from '@opentelemetry/api';

/**
 * Injeta o contexto de tracing atual em um carrier (objeto)
 */
export function injectTraceContext(): Record<string, unknown> {
  const carrier = {};
  propagation.inject(context.active(), carrier);
  return carrier;
}

/**
 * Extrai o contexto de tracing de um carrier
 */
export function extractTraceContext(carrier: Record<string, unknown>) {
  try {
    return propagation.extract(context.active(), carrier);
  } catch (error) {
    console.warn('Failed to extract trace context:', error);
    return context.active();
  }
}

/**
 * Executa uma função dentro de um contexto de span com propagação
 */
export async function withTraceSpan<T>(
  tracer: any,
  spanName: string,
  options: {
    kind: SpanKind;
    attributes?: Record<string, any>;
    parentContext?: any;
  },
  fn: (span: Span) => Promise<T>,
): Promise<T> {
  const span = tracer.startSpan(
    spanName,
    {
      kind: options.kind,
      attributes: options.attributes,
    },
    options.parentContext || context.active(),
  );

  return context.with(
    trace.setSpan(options.parentContext || context.active(), span),
    async () => {
      try {
        const result = await fn(span);
        span.setStatus({ code: 1 }); // OK
        return result;
      } catch (error) {
        span.recordException(error);
        span.setStatus({ code: 2, message: error.message }); // ERROR
        throw error;
      } finally {
        span.end();
      }
    },
  );
}

/**
 * Adiciona contexto de tracing a dados de mensagem TCP
 */
export function addTraceContextToMessage(data: any): any {
  return {
    ...data,
    _traceContext: injectTraceContext(),
  };
}

/**
 * Remove contexto de tracing dos dados da mensagem
 */
export function removeTraceContextFromMessage(data: any): {
  cleanData: any;
  traceContext?: Record<string, unknown>;
} {
  const { _traceContext, ...cleanData } = data;
  return {
    cleanData,
    traceContext: _traceContext,
  };
}
