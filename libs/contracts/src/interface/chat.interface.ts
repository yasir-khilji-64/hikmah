import type { Document, Types } from 'mongoose';

import type { ChatMessage } from '../types';

interface IChatMessage extends ChatMessage, Document {
  conversation_id: Types.ObjectId;
}

export { IChatMessage };
