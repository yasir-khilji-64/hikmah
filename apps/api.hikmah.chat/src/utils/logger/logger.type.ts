import type { loggerTypeDefinition } from './logger.definition';

type TLoggerType = (typeof loggerTypeDefinition)[number];

export { TLoggerType };
