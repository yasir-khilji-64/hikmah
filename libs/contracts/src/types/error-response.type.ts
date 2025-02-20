import type { MessageResponse } from './message-response.type';

type ErrorResponse = MessageResponse & {
  errors?: unknown;
  stack?: string;
};

export { ErrorResponse };
