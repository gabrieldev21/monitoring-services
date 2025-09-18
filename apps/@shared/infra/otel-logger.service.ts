import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from './otel-sdk';

@Injectable()
export class OtelLogger implements LoggerService {
  private logger = loggerProvider.getLogger('nest');
  private levels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];

  constructor(levels?: LogLevel[]) {
    if (levels) this.levels = levels;
  }

  private emit(
    body: any,
    severityNumber: SeverityNumber,
    attributes?: Record<string, unknown>,
  ) {
    const record: any = {
      body: typeof body === 'string' ? body : JSON.stringify(body),
      severityNumber,
    };
    if (attributes) record.attributes = attributes as any;
    this.logger.emit(record);
  }

  log(message: any, context?: string) {
    if (!this.levels.includes('log')) return;
    this.emit(message, SeverityNumber.INFO, { context });
  }
  error(message: any, trace?: string, context?: string) {
    if (!this.levels.includes('error')) return;
    this.emit(message, SeverityNumber.ERROR, { context, trace });
  }
  warn(message: any, context?: string) {
    if (!this.levels.includes('warn')) return;
    this.emit(message, SeverityNumber.WARN, { context });
  }
  debug?(message: any, context?: string) {
    if (!this.levels.includes('debug')) return;
    this.emit(message, SeverityNumber.DEBUG, { context });
  }
  verbose?(message: any, context?: string) {
    if (!this.levels.includes('verbose')) return;
    this.emit(message, SeverityNumber.TRACE, { context });
  }
  setLogLevels?(levels: LogLevel[]) {
    this.levels = levels;
  }
}
