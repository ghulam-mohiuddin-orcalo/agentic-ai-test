---
name: ai-integration
description: Patterns for integrating OpenAI, Anthropic, and Google AI providers
---

# AI Integration Patterns

## Provider Interface (All providers must implement)

```typescript
export interface IAIProvider {
  chat(messages: Message[], config: ModelConfig): Promise<ChatResponse>;
  stream(messages: Message[], config: ModelConfig): AsyncGenerator<string>;
  embeddings(text: string): Promise<number[]>;
}

export interface Message { role: 'system' | 'user' | 'assistant'; content: string; }

export interface ChatResponse {
  content: string;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number; };
  model: string;
}
```

## Model Router (Single entry point)

```typescript
@Injectable()
export class ModelRouterService {
  private providers = new Map<string, IAIProvider>();

  async chat(modelId: string, messages: Message[]): Promise<ChatResponse> {
    const model = await this.prisma.model.findUnique({ where: { id: modelId } });
    const provider = this.providers.get(model.provider);
    if (!provider) throw new BadRequestException(`Provider ${model.provider} not supported`);
    return provider.chat(messages, model.config);
  }
}
```

## Streaming via WebSocket

```typescript
@SubscribeMessage('chat')
async handleChat(@MessageBody() data: ChatDto, @ConnectedSocket() client: Socket) {
  try {
    const stream = this.modelRouter.stream(data.modelId, data.messages);
    for await (const chunk of stream) {
      client.emit('chat:chunk', { delta: chunk });
    }
    client.emit('chat:done', { success: true });
  } catch (error) {
    client.emit('chat:error', { message: error.message });
  }
}
```

## Error Mapping

| Provider Error | NestJS Exception |
|---------------|-----------------|
| 429 rate limit | `TooManyRequestsException` |
| 401 invalid key | `UnauthorizedException` |
| 500 server error | `ServiceUnavailableException` |
| timeout | `GatewayTimeoutException` |

## Retry Pattern

```typescript
async withRetry(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try { return await fn(); }
    catch (error) {
      if (error.status >= 400 && error.status < 500) throw error;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
  throw new ServiceUnavailableException('Provider unavailable');
}
```

## Usage Tracking

After every chat/stream response, record usage:
```typescript
await this.usageService.track({
  userId, modelId,
  promptTokens: response.usage.promptTokens,
  completionTokens: response.usage.completionTokens,
  cost: await this.calculateCost(modelId, response.usage),
});
```

## Provider Registration

Create files in `backend/src/modules/chat/providers/`:
- `openai.provider.ts`
- `anthropic.provider.ts`
- `google.provider.ts`

Register in `chat.module.ts` as providers, inject into `ModelRouterService`.
