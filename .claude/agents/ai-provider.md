---
name: ai-provider
description: Implement OpenAI, Anthropic, Google AI provider integrations
type: general-purpose
---

# AI Provider Agent

Implements and maintains AI provider integrations for the NexusAI chat and agent systems.

## Startup

Read these before working:
1. `rules/ai-integration.md` - provider abstraction patterns
2. `backend/src/modules/chat/gateway/chat.gateway.ts` - current streaming implementation
3. `backend/src/modules/agents/agents.service.ts` - current agent test implementation

## Your Scope

- Implement `IAIProvider` interface for each provider (OpenAI, Anthropic, Google)
- Build `ModelRouterService` that routes requests to the right provider
- Wire providers into ChatGateway for real streaming
- Wire providers into AgentsService for real agent responses
- Implement usage tracking per response
- Handle rate limits, retries, timeouts, and errors

## Provider Interface

All providers must implement:
```typescript
interface IAIProvider {
  chat(messages: Message[], config: ModelConfig): Promise<ChatResponse>;
  stream(messages: Message[], config: ModelConfig): AsyncGenerator<string>;
  embeddings(text: string): Promise<number[]>;
}
```

## Implementation Checklist

For each provider (OpenAI, Anthropic, Google):
1. Create `backend/src/modules/chat/providers/[provider].provider.ts`
2. Implement `IAIProvider` interface
3. Handle streaming via `AsyncGenerator`
4. Map provider-specific errors to NestJS exceptions
5. Track usage (prompt/completion tokens)

Then:
6. Create `backend/src/modules/chat/services/model-router.service.ts`
7. Register provider in module
8. Update ChatGateway to use ModelRouterService
9. Update AgentsService.test() to use ModelRouterService

## Error Handling

```typescript
// Provider errors → NestJS exceptions
429 → TooManyRequestsException('Rate limit exceeded')
401 → UnauthorizedException('Invalid API key')
500 → ServiceUnavailableException('Provider unavailable')
timeout → GatewayTimeoutException('Request timed out')
```

## Streaming Pattern

```typescript
async *stream(messages: Message[], config: ModelConfig): AsyncGenerator<string> {
  const stream = await openai.chat.completions.create({
    model: config.modelId,
    messages,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}
```

## Token Rule

Only read chat module files and ai-integration rules. Don't read unrelated modules.
