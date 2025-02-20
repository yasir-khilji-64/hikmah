import type { LoggerOptions, Logger as WinstonLogger } from 'winston';
import { createLogger, format, transports } from 'winston';

import type { TLoggerType } from './logger.type';

class Logger {
  protected static WINSTON_DEBUG = 'debug';
  protected static WINSTON_INFO = 'info';
  protected static WINSTON_WARNING = 'warn';
  protected static WINSTON_ERROR = 'error';

  public static VERBOSITY_LEVELS: Record<TLoggerType, string> = {
    DEBUG: this.WINSTON_DEBUG,
    INFO: this.WINSTON_INFO,
    WARNING: this.WINSTON_WARNING,
    ERROR: this.WINSTON_ERROR,
  };

  public static _instance: Logger | undefined = undefined;
  protected logger: WinstonLogger;
  protected options: LoggerOptions;

  private static log(
    level: TLoggerType,
    message: unknown,
    type?: string,
    parameters?: object,
  ): void {
    const _self = this._instance;
    const _level = this.computeLevel(level);
    const _message = this.computeMessage(message);

    _self?.logger.log(_level, _message, { type, parameters });
  }

  protected constructor(protected readonly verbosity: TLoggerType) {
    this.options = {
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSS' }),
        format.json({
          circularValue: '[Circular Reference]',
          maximumDepth: 10,
        }),
        format.prettyPrint(),
      ),
      transports: [
        new transports.Console({
          level: Logger.getVerbosityLevel(verbosity),
        }),
      ],
    };
    this.logger = createLogger(this.options);
  }

  public static get instance(): Logger {
    if (!this._instance) {
      throw new Error('Logger must be initialized before use.');
    }
    return this._instance;
  }

  public static boot(verbosity: TLoggerType): Logger {
    this._instance = new this(verbosity);
    return this._instance;
  }

  public static debug(
    message: unknown,
    type?: string,
    parameters?: object,
  ): void {
    if (this.instance.verbosity !== 'DEBUG') {
      return;
    }
    this.log('DEBUG', message, type, parameters);
  }

  public static info(
    message: unknown,
    type?: string,
    parameters?: object,
  ): void {
    if (!['INFO', 'DEBUG'].includes(this.instance.verbosity)) {
      return;
    }
    this.log('INFO', message, type, parameters);
  }

  public static warning(
    message: unknown,
    type?: string,
    parameters?: object,
  ): void {
    if (!['WARNING', 'INFO', 'DEBUG'].includes(this.instance.verbosity)) {
      return;
    }
    this.log('WARNING', message, type, parameters);
  }

  public static error(
    message: unknown,
    type?: string,
    parameters?: object,
  ): void {
    this.log('ERROR', message, type, parameters);
  }

  public static getVerbosityLevel(verbosity: TLoggerType): string {
    return this.VERBOSITY_LEVELS[verbosity] || this.WINSTON_ERROR;
  }

  protected static computeLevel(level: TLoggerType): string {
    return this.VERBOSITY_LEVELS[level];
  }

  protected static computeMessage(message: unknown): string {
    if (message === undefined || message === null) {
      return '';
    }
    if (typeof message === 'string') {
      return message;
    }
    if (typeof message === 'object') {
      try {
        return JSON.stringify(message);
      } catch (_error) {
        return '[Object could not be stringified]';
      }
    }
    return String(message);
  }
}

export { Logger };
