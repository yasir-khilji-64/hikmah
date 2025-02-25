import type { Role, IChatMessage } from '@hikmah/contracts';
import { connection, model, Schema } from 'mongoose';

import { Logger } from '../../utils';

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    content: { type: String, required: true },
    conversation_id: {
      type: Schema.Types.ObjectId,
      ref: 'conversations',
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    role: {
      type: String,
      enum: Object.values<Role>({
        user: 'user',
        assistant: 'assistant',
        system: 'system',
      }),
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

ChatMessageSchema.index({ conversation_id: 1 });
ChatMessageSchema.index({ timestamp: 1 });
ChatMessageSchema.index({ conversation_id: 1, timestamp: 1 });

ChatMessageSchema.post('save', async function (doc, next) {
  try {
    const db = connection.db;
    if (!db) {
      Logger.error(
        'Database connection not established',
        'ChatMessageSchema',
        {},
      );
      return next();
    }
    await db.collection('conversations').updateOne(
      { _id: doc.conversation_id },
      {
        $set: { last_message_timestamp: new Date() },
      },
    );
  } catch (error) {
    Logger.error('Error updating conversation timestamp', 'ChatMessageSchema', {
      error,
    });
  }
  next();
});

const ChatMessageModel = model<IChatMessage>(
  'chat_messages',
  ChatMessageSchema,
);

export { ChatMessageModel };
