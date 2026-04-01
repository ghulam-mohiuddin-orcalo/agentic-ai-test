import { User } from '../store/api/authApi';
import { Conversation, Message } from '../store/api/chatApi';

// Mock user data
export const mockUser: User = {
  id: 'mock-user-1',
  email: 'demo@nexusai.com',
  name: 'Demo User',
  role: 'USER',
  createdAt: new Date().toISOString(),
};

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    userId: 'mock-user-1',
    modelId: 'gpt-4o',
    title: 'Getting Started with NexusAI',
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-01T10:15:00.000Z',
  },
  {
    id: 'conv-2',
    userId: 'mock-user-1',
    modelId: 'claude-opus-4-6',
    title: 'Building AI Agents',
    createdAt: '2026-04-01T11:00:00.000Z',
    updatedAt: '2026-04-01T11:30:00.000Z',
  },
];

// Mock messages
export const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      role: 'user',
      content: 'What is NexusAI?',
      createdAt: '2026-04-01T10:00:00.000Z',
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      role: 'assistant',
      content: 'NexusAI is a powerful AI model marketplace and chat platform that allows you to interact with multiple AI models, build custom agents, and create intelligent workflows. You can choose from models like GPT-4, Claude, and Gemini, all in one unified interface.',
      createdAt: '2026-04-01T10:00:05.000Z',
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      role: 'user',
      content: 'How do I create an agent?',
      createdAt: '2026-04-01T10:15:00.000Z',
    },
    {
      id: 'msg-4',
      conversationId: 'conv-1',
      role: 'assistant',
      content: 'To create an agent, navigate to the Agents page and click "New Agent". You can either start from scratch or use one of our pre-built templates. Configure your agent by selecting a model, writing a system prompt, enabling tools, and adjusting settings like temperature and max tokens.',
      createdAt: '2026-04-01T10:15:05.000Z',
    },
  ],
  'conv-2': [
    {
      id: 'msg-5',
      conversationId: 'conv-2',
      role: 'user',
      content: 'What tools can I give my agent?',
      createdAt: '2026-04-01T11:00:00.000Z',
    },
    {
      id: 'msg-6',
      conversationId: 'conv-2',
      role: 'assistant',
      content: 'You can equip your agent with various tools including:\n\n1. **Web Search** - Search the internet for information\n2. **Code Execution** - Run Python code\n3. **File Operations** - Read and write files\n4. **API Calls** - Make HTTP requests to external services\n\nThese tools enable your agent to perform complex tasks and interact with external systems.',
      createdAt: '2026-04-01T11:00:05.000Z',
    },
  ],
};

// Mock streaming response generator
export async function* mockStreamResponse(prompt: string): AsyncGenerator<string> {
  const responses = [
    "I'm a mock AI assistant. ",
    "This is a simulated streaming response. ",
    "In production, this would connect to a real AI model. ",
    "You can use this for testing the UI without a backend. ",
    "\n\nYour question was: \"" + prompt + "\"",
  ];

  for (const chunk of responses) {
    await new Promise(resolve => setTimeout(resolve, 100));
    yield chunk;
  }
}

// Mock API delay
export const mockDelay = (ms: number = 500) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Mock auth responses
export const mockAuthResponse = {
  accessToken: 'mock-access-token-' + Date.now(),
  refreshToken: 'mock-refresh-token-' + Date.now(),
  user: mockUser,
};

// Check if mock mode is enabled
export const isMockMode = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
};

// Mock error responses
export const mockErrors = {
  invalidCredentials: {
    statusCode: 401,
    message: 'Invalid email or password',
    error: 'Unauthorized',
  },
  emailExists: {
    statusCode: 409,
    message: 'Email already exists',
    error: 'Conflict',
  },
  notFound: {
    statusCode: 404,
    message: 'Resource not found',
    error: 'Not Found',
  },
  serverError: {
    statusCode: 500,
    message: 'Internal server error',
    error: 'Internal Server Error',
  },
};
