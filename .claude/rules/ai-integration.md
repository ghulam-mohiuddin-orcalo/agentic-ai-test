---
name: ai-integration
description: Guidelines for integrating AI model providers
---

# AI Integration Guidelines

## Provider Abstraction

### Create Unified Interface

```typescript
export interface IAIProvider {
  chat(messages: Message[], config: ModelConfig): Promise<ChatResponse>;
  stream(messages: Message[], config: ModelConfig): AsyncIterator<string>;
  embeddings(text: string): Promise<number[]>;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}
```

### Implement Provider Adapters

```typescript
@Injectable()
export class OpenAIProvider implements IAIProvider {
  constructor(private config: ConfigService) {}

  async chat(messages: Message[], config: ModelConfig): Promise<ChatResponse> {
    const openai = new OpenAI({
      apiKey: this.config.get('OPENAI_API_KEY'),
    });

    const response = await openai.chat.completions.create({
      model: config.modelId,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    });

    return {
      content: response.choices[0].message.content,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      },
      model: response.model,
    };
  }

  async *stream(messages: Message[], config: ModelConfig) {
    const openai = new OpenAI({
      apiKey: this.config.get('OPENAI_API_KEY'),
    });

    const stream = await openai.chat.completions.create({
      model: config.modelId,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content || '';
    }
  }
}
```

## Model Router Service

```typescript
@Injectable()
export class ModelRouterService {
  private providers: Map<string, IAIProvider>;

  constructor(
    private openai: OpenAIProvider,
    private anthropic: AnthropicProvider,
    private google: GoogleProvider,
  ) {
    this.providers = new Map([
      ['openai', this.openai],
      ['anthropic', this.anthropic],
      ['google', this.google],
    ]);
  }

  async chat(modelId: string, messages: Message[]): Promise<ChatResponse> {
    const model = await this.getModel(modelId);
    const provider = this.providers.get(model.provider);

    if (!provider) {
      throw new BadRequestException(`Provider ${model.provider} not supported`);
    }

    return provider.chat(messages, model.config);
  }

  async *stream(modelId: string, messages: Message[]) {
    const model = await this.getModel(modelId);
    const provider = this.providers.get(model.provider);

    if (!provider) {
      throw new BadRequestException(`Provider ${model.provider} not supported`);
    }

    yield* provider.stream(messages, model.config);
  }
}
```

## Streaming Implementation

### WebSocket Gateway

```typescript
@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway {
  constructor(private modelRouter: ModelRouterService) {}

  @SubscribeMessage('chat')
  async handleChat(
    @MessageBody() data: ChatDto,
    @ConnectedSocket() client: Socket,
  ) {
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
}
```

## Error Handling

### Retry Logic

```typescript
async chatWithRetry(
  modelId: string,
  messages: Message[],
  maxRetries = 3,
): Promise<ChatResponse> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await this.modelRouter.chat(modelId, messages);
    } catch (error) {
      lastError = error;

      // Don't retry on client errors
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Exponential backoff
      await this.delay(Math.pow(2, i) * 1000);
    }
  }

  throw new ServiceUnavailableException(
    `Failed after ${maxRetries} retries: ${lastError.message}`,
  );
}

private delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Rate Limit Handling

```typescript
async chat(messages: Message[], config: ModelConfig): Promise<ChatResponse> {
  try {
    return await this.openai.chat.completions.create({...});
  } catch (error) {
    if (error.status === 429) {
      // Rate limited - queue for retry
      await this.queueService.add('chat-retry', {
        messages,
        config,
        retryAfter: error.headers['retry-after'],
      });
      throw new TooManyRequestsException('Rate limit exceeded, queued for retry');
    }
    throw error;
  }
}
```

## Usage Tracking

```typescript
@Injectable()
export class UsageTrackingService {
  constructor(private prisma: PrismaService) {}

  async track(data: {
    userId: string;
    modelId: string;
    promptTokens: number;
    completionTokens: number;
    cost: number;
  }): Promise<void> {
    await this.prisma.usage.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    });
  }

  async calculateCost(
    modelId: string,
    promptTokens: number,
    completionTokens: number,
  ): Promise<number> {
    const model = await this.prisma.model.findUnique({
      where: { id: modelId },
    });

    const promptCost = (promptTokens / 1000) * model.pricing.input;
    const completionCost = (completionTokens / 1000) * model.pricing.output;

    return promptCost + completionCost;
  }
}
```

## Caching Responses

```typescript
@Injectable()
export class CachedChatService {
  constructor(
    private modelRouter: ModelRouterService,
    private cache: CacheService,
  ) {}

  async chat(modelId: string, messages: Message[]): Promise<ChatResponse> {
    // Generate cache key from messages
    const cacheKey = this.generateCacheKey(modelId, messages);

    // Check cache
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Call API
    const response = await this.modelRouter.chat(modelId, messages);

    // Cache for 1 hour
    await this.cache.set(cacheKey, response, 3600);

    return response;
  }

  private generateCacheKey(modelId: string, messages: Message[]): string {
    const hash = createHash('sha256')
      .update(JSON.stringify({ modelId, messages }))
      .digest('hex');
    return `chat:${hash}`;
  }
}
```

## Function Calling / Tools

```typescript
export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
}

@Injectable()
export class ToolExecutor {
  private tools: Map<string, Function>;

  constructor() {
    this.tools = new Map([
      ['web_search', this.webSearch],
      ['database_query', this.databaseQuery],
      ['send_email', this.sendEmail],
    ]);
  }

  async execute(toolName: string, args: any): Promise<any> {
    const tool = this.tools.get(toolName);

    if (!tool) {
      throw new BadRequestException(`Tool ${toolName} not found`);
    }

    return tool(args);
  }

  private async webSearch(args: { query: string }): Promise<any> {
    // Implement web search
  }

  private async databaseQuery(args: { sql: string }): Promise<any> {
    // Implement database query
  }
}
```

## Agent Memory

```typescript
@Injectable()
export class AgentMemoryService {
  constructor(
    private pinecone: PineconeService,
    private embeddings: EmbeddingsService,
  ) {}

  async store(agentId: string, content: string, metadata: any): Promise<void> {
    const embedding = await this.embeddings.generate(content);

    await this.pinecone.upsert({
      namespace: `agent-${agentId}`,
      vectors: [{
        id: randomUUID(),
        values: embedding,
        metadata: { content, ...metadata },
      }],
    });
  }

  async retrieve(agentId: string, query: string, topK = 5): Promise<any[]> {
    const queryEmbedding = await this.embeddings.generate(query);

    const results = await this.pinecone.query({
      namespace: `agent-${agentId}`,
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });

    return results.matches.map(m => m.metadata);
  }
}
```

## Best Practices

1. **Abstract providers** - Use common interface for all AI providers
2. **Handle streaming** - Implement proper WebSocket/SSE streaming
3. **Track usage** - Log tokens and costs for billing
4. **Retry logic** - Handle transient failures with exponential backoff
5. **Rate limiting** - Respect provider rate limits
6. **Cache responses** - Cache identical requests to reduce costs
7. **Error handling** - Provide meaningful errors to users
8. **Timeout handling** - Set reasonable timeouts for long requests
9. **Monitor performance** - Track latency and success rates
10. **Security** - Never expose API keys to clients
