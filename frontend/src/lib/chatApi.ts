import { mockStreamResponse } from './mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

interface ChatRequest {
  message: string;
  model: string;
  conversationId?: string;
  history?: { role: string; content: string }[];
}

interface ChatResponse {
  reply: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Send a chat message via the API.
 * Falls back to mock streaming when the backend is unavailable.
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  try {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('nexusai_token')
      : null;

    const res = await fetch(`${API_BASE}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        modelId: request.model,
        message: request.message,
        conversationId: request.conversationId,
        messages: request.history,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`API responded with ${res.status}`);

    const data = await res.json();
    return {
      reply: data.reply || data.content || data.message,
      model: request.model,
      usage: data.usage,
    };
  } catch {
    // Backend unavailable — use mock streaming and collect full response
    return mockChatResponse(request);
  }
}

/**
 * Stream a chat message. Yields chunks.
 * Falls back to mock streaming when the backend is unavailable.
 */
export async function* streamChatMessage(
  request: ChatRequest
): AsyncGenerator<string> {
  try {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('nexusai_token')
      : null;

    const res = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        modelId: request.model,
        message: request.message,
        conversationId: request.conversationId,
        messages: request.history,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok || !res.body) throw new Error('Stream unavailable');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
  } catch {
    // Fallback to mock streaming
    yield* mockStreamResponse(request.message);
  }
}

async function mockChatResponse(request: ChatRequest): Promise<ChatResponse> {
  const stream = mockStreamResponse(request.message);
  let reply = '';
  for await (const chunk of stream) {
    reply += chunk;
  }
  return {
    reply,
    model: request.model,
    usage: {
      promptTokens: request.message.length,
      completionTokens: reply.length,
      totalTokens: request.message.length + reply.length,
    },
  };
}
