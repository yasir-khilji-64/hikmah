import type { MessageResponse } from './message-response.type';
import type { PaginatedResponse } from './paginated-response.type';

type ApiResponse<T> = Omit<MessageResponse, 'message'> &
  (T extends PaginatedResponse<unknown> ? T : { data: T });

export { ApiResponse };
