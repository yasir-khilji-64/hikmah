import type {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  FinalStreamResponse,
  OllamaConnectionStatus,
  OllamaMessage,
  SystemMessageName,
} from '@hikmah/contracts';

interface IOllama {
  getConnectionStatus(): Promise<OllamaConnectionStatus>;
  listModels(): Promise<string[]>;
  setModel(model: string): void;
  sendMessage(
    message: OllamaMessage,
    history?: ChatRequest,
    systemMessageName?: SystemMessageName[],
  ): Promise<ChatResponse>;
  streamMessages(
    message: OllamaMessage,
    onChunk: (chunk: ChatMessage) => void,
    history?: ChatRequest,
    systemMessageName?: SystemMessageName[],
    onComplete?: (metadata: FinalStreamResponse) => void,
  ): Promise<void>;
}

export { IOllama };
