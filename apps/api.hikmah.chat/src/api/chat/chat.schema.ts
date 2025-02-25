import type { Role } from '@hikmah/contracts';
import { paginatedQuerySchema } from '@hikmah/contracts';
import { Types } from 'mongoose';
import { z } from 'zod';

const getChatsQuerySchema = paginatedQuerySchema.extend({
  conversation_id: z.string().refine(
    (value) => {
      return Types.ObjectId.isValid(value);
    },
    {
      message: 'Invalid conversation ID',
    },
  ),
  role: z
    .nativeEnum({
      user: 'user',
      assistant: 'assistant',
      system: 'system',
    } as const satisfies Record<Role, Role>)
    .optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
  sort: z
    .union([z.literal('asc'), z.literal('desc')])
    .optional()
    .default('desc'),
});

const createChatSchema = z.object({
  message: z.string().min(1, { message: 'Message is required' }),
  conversation_id: z.string().refine(
    (value) => {
      return Types.ObjectId.isValid(value);
    },
    {
      message: 'Invalid conversation ID',
    },
  ),
  model: z.string().optional(),
});

type GetChatsQueryDto = z.infer<typeof getChatsQuerySchema>;
type CreateChatDto = z.infer<typeof createChatSchema>;

export {
  getChatsQuerySchema,
  GetChatsQueryDto,
  createChatSchema,
  CreateChatDto,
};
