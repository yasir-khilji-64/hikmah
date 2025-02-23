import { z } from 'zod';

const paginatedQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).default(10),
});

type PaginatedQueryDto = z.infer<typeof paginatedQuerySchema>;

export { paginatedQuerySchema, PaginatedQueryDto };
