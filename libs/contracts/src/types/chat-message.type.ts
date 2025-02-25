import type { OllamaMessage } from './ollama.type';

type ChatMessage = OllamaMessage & {
  timestamp?: Date;
  metadata?: Record<string, unknown>;
};

export { ChatMessage };
