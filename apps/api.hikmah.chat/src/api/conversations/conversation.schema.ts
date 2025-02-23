import { paginatedQuerySchema } from '@hikmah/contracts';
import { Types } from 'mongoose';
import { z } from 'zod';

const getConversationsQuerySchema = paginatedQuerySchema.extend({
  showDeleted: z.coerce.boolean().optional(),
  modelName: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
  sort: z
    .union([z.literal('asc'), z.literal('desc')])
    .optional()
    .default('desc'),
});
const getConversationByIdQuerySchema = z.object({
  id: z.string().refine(
    (value) => {
      return Types.ObjectId.isValid(value);
    },
    {
      message: 'Please provide a valid ObjectId',
    },
  ),
});
const createConversationSchema = z.object({
  title: z
    .string({ required_error: 'Provide a title for the conversation' })
    .min(2, { message: 'Provide a title for the conversation' }),
  model_name: z.string({ required_error: 'Provide a valid model name' }),
});
const updateConversationSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Provide a title for the conversation' })
    .optional(),
  tags: z.array(z.string()).optional(),
  status: z.union([z.literal('active'), z.literal('archived')]).optional(),
});

type GetConversationsQueryDto = z.infer<typeof getConversationsQuerySchema>;
type GetConversationByIdQueryDto = z.infer<
  typeof getConversationByIdQuerySchema
>;
type CreateConversationDto = z.infer<typeof createConversationSchema>;
type UpdateConversationDto = z.infer<typeof updateConversationSchema>;

export {
  getConversationsQuerySchema,
  GetConversationsQueryDto,
  getConversationByIdQuerySchema,
  GetConversationByIdQueryDto,
  createConversationSchema,
  CreateConversationDto,
  updateConversationSchema,
  UpdateConversationDto,
};
