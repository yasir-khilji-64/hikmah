import type {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  FinalStreamResponse,
  OllamaConnectionStatus,
  OllamaListModel,
  OllamaMessage,
  OllamaSystemMessage,
  StreamChunkResponse,
  SystemMessageName,
} from '@hikmah/contracts';
import { StatusCodes, SYSTEM_MESSAGES } from '@hikmah/contracts';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type { Readable } from 'stream';

import type { IOllama } from './ollama.interface';
import { Logger } from '../logger';

class Ollama implements IOllama {
  private static instance: Ollama;
  private model: string;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({ baseURL: 'http://localhost:11434/api' });
  }

  public static GetInstance(): Ollama {
    if (!Ollama.instance) {
      Ollama.instance = new Ollama();
    }
    return Ollama.instance;
  }

  public async getConnectionStatus(): Promise<OllamaConnectionStatus> {
    try {
      const response = await this.api.get('/version');
      if (response.status === StatusCodes.OK) {
        return 'running';
      }
      return 'stopped';
    } catch (error) {
      Logger.error('Ollama Server not Reachable', Ollama.name, { error });
      return 'stopped';
    }
  }

  public async listModels(): Promise<string[]> {
    try {
      const response = await this.api.get<{ models: OllamaListModel[] }>(
        '/tags',
      );
      return response.data.models.map((model) => {
        return model.name;
      });
    } catch (error) {
      Logger.error('Failed to list models', Ollama.name, { error });
      return [];
    }
  }

  public setModel(model: string): void {
    this.model = model;
  }

  public async sendMessage(
    message: OllamaMessage,
    history?: ChatRequest,
    systemMessageName: SystemMessageName[] = [],
  ): Promise<ChatResponse> {
    try {
      const selectedSystemMessages: OllamaSystemMessage[] = [
        ...systemMessageName
          .map((name) => {
            return SYSTEM_MESSAGES[name];
          })
          .filter(Boolean),
      ];
      const existingSystemMessages = new Set(
        history?.messages
          ?.filter((message) => {
            return message.role === 'system';
          })
          .map((message) => {
            return message.content;
          }) ?? [],
      );
      const newSystemMessages = selectedSystemMessages.filter((message) => {
        return !existingSystemMessages.has(message.content);
      });
      const messages = [
        ...(history?.messages ?? []),
        ...newSystemMessages.map(({ role, content }) => {
          return { role, content };
        }),
        message,
      ];
      const chatRequest: ChatRequest = {
        model: history?.model ?? this.model,
        messages,
        options: history?.options ?? {
          temperature: 0.9,
        },
        stream: false,
      };
      const response = await this.api.post<ChatResponse>('/chat', chatRequest);
      return response.data;
    } catch (error) {
      Logger.error('Ollama Chat Error', Ollama.name, { error });
      throw error;
    }
  }

  public async streamMessages(
    message: OllamaMessage,
    onChunk: (chunk: ChatMessage) => void,
    history?: ChatRequest,
    systemMessageName: SystemMessageName[] = [],
    onComplete?: (metadata: FinalStreamResponse) => void,
  ): Promise<void> {
    try {
      const selectedSystemMessages: OllamaSystemMessage[] = [
        SYSTEM_MESSAGES.GENERAL,
        ...systemMessageName
          .map((name) => {
            return SYSTEM_MESSAGES[name];
          })
          .filter(Boolean),
      ];
      const existingSystemMessages = new Set(
        history?.messages
          ?.filter((message) => {
            return message.role === 'system';
          })
          .map((message) => {
            return message.content;
          }) ?? [],
      );
      const newSystemMessages = selectedSystemMessages.filter((message) => {
        return !existingSystemMessages.has(message.content);
      });
      const messages = [
        ...(history?.messages ?? []),
        ...newSystemMessages.map(({ role, content }) => {
          return { role, content };
        }),
        message,
      ];
      const chatRequest: ChatRequest = {
        model: history?.model ?? this.model,
        messages,
        options: history?.options ?? {},
        stream: true,
      };
      const response = await this.api.post('/chat', chatRequest, {
        responseType: 'stream',
      });

      let fullMessage = '';
      const stream = response.data as Readable;
      stream.on('data', (chunk: Buffer) => {
        const messages = chunk.toString().split('\n').filter(Boolean);
        for (const message of messages) {
          try {
            const parsedData: StreamChunkResponse & FinalStreamResponse =
              JSON.parse(message);
            if (parsedData.done) {
              if (onComplete) {
                onComplete({
                  created_at: parsedData.created_at,
                  done: parsedData.done,
                  done_reason: parsedData.done_reason,
                  eval_count: parsedData.eval_count,
                  eval_duration: parsedData.eval_duration,
                  full_message: fullMessage.trim(),
                  load_duration: parsedData.load_duration,
                  model: parsedData.model,
                  prompt_eval_count: parsedData.prompt_eval_count,
                  prompt_eval_duration: parsedData.prompt_eval_duration,
                  total_duration: parsedData.total_duration,
                });
              }
            }
            const token = parsedData.message.content;
            fullMessage += token;

            onChunk({
              content: token,
              role: 'assistant',
              timestamp: parsedData.created_at,
            });
          } catch (error) {
            Logger.error('Error parsing chunk', Ollama.name, { error });
          }
        }
      });
    } catch (error) {
      Logger.error('Ollama stream error', Ollama.name, { error });
      throw error;
    }
  }
}

export { Ollama };
