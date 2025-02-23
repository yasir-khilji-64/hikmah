import type { Document } from 'mongoose';

import type { ConversationStatus } from '../types';

interface IConversation extends Document {
  title: string;
  model_name: string;
  tags: string[];
  status: ConversationStatus;
  last_message_at: Date;
  is_deleted: boolean;
  deleted_at?: Date;
  metadata?: Record<string, unknown>;
}

export { IConversation };
