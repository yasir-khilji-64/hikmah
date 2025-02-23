import type { ConversationStatus, IConversation } from '@hikmah/contracts';
import { model, Schema } from 'mongoose';

const ConversationSchema: Schema<IConversation> = new Schema<IConversation>(
  {
    title: { type: String, required: true },
    model_name: { type: String, required: true },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: Object.values<ConversationStatus>({
        active: 'active',
        archived: 'archived',
      }),
      default: 'active',
    },
    last_message_at: { type: Date, default: Date.now },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

ConversationSchema.index({ created_at: -1 });
ConversationSchema.index({ last_message_at: -1 });
ConversationSchema.index({ is_deleted: 1, last_message_at: -1 });
ConversationSchema.index({ model_name: 1, last_message_at: -1 });

const ConversationModel = model<IConversation>(
  'conversations',
  ConversationSchema,
);

export { ConversationModel };
