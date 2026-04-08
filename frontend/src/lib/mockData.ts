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

// Context-aware mock response generator
function getMockResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  // Video-related prompts
  const videoMatch = prompt.match(/(?:this video|video:)\s*"?([^"?"]+)"?\??/i);
  if (videoMatch || (lower.includes('video') && lower.includes('analyz'))) {
    const fileName = videoMatch?.[1]?.trim() || 'your video';
    return `Here are the best AI tools for analyzing **"${fileName}"**:\n\n1. **Gemini 3.1 Pro** - Industry-leading video understanding with frame-by-frame analysis and 2M token context\n2. **GPT-5 Vision** - Excellent at describing video content, detecting scenes, and extracting key moments\n3. **Claude Opus 4.6** - Strong at understanding video transcripts and generating detailed summaries\n\n**What I can do with your video:**\n- Generate a scene-by-scene summary\n- Extract and transcribe spoken audio\n- Identify key moments and highlights\n- Detect objects, people, and actions\n- Create timestamps and chapters\n- Generate captions and subtitles\n\nWould you like me to start analyzing your video?`;
  }

  // Image-related prompts
  const imageMatch = prompt.match(/(?:this image|image:)\s*"?([^"?"]+)"?\??/i);
  if (imageMatch || (lower.includes('image') && lower.includes('tool'))) {
    const fileName = imageMatch?.[1]?.trim() || 'your image';
    return `Great question! Here are the best AI tools for working with **"${fileName}"**:\n\n1. **GPT-5 Vision** - Analyze, describe, and extract text from images with high accuracy\n2. **Claude Opus 4.6** - Excellent at understanding complex visuals, charts, and diagrams\n3. **Gemini 3.1 Pro** - Strong multimodal capabilities for image understanding and generation\n\n**What I can do with your image:**\n- Describe and analyze the content\n- Extract text (OCR)\n- Identify objects, colors, and layouts\n- Generate alt text for accessibility\n- Compare with other images\n\nWould you like me to analyze your image now?`;
  }

  // File-related prompts
  const fileMatch = prompt.match(/(?:for my file|file:)\s*"?([^"?"]+)"?\??/i);
  if (fileMatch || (lower.includes('file') && lower.includes('help'))) {
    const fileName = fileMatch?.[1]?.trim() || 'your file';
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    const toolsByType: Record<string, string> = {
      pdf: "For your PDF file, I recommend:\n\n1. **Claude Opus 4.6** - Best for long document analysis with 200K context\n2. **Gemini 3.1 Pro** - Handles up to 2M tokens, ideal for very large PDFs\n3. **GPT-5** - Great for summarization and extraction\n\n**Suggested workflow:**\n- Upload your PDF and ask for a summary\n- Extract key data points or tables\n- Generate action items or insights",
      docx: "For your Word document, here are the best AI tools:\n\n1. **Claude Opus 4.6** - Excellent at understanding document structure, headings, and formatting\n2. **GPT-5** - Strong at rewriting, editing, and improving content\n3. **Gemini 3.1 Pro** - Great for cross-referencing with other documents\n\n**What I can help with:**\n- Summarize the document\n- Rewrite or improve sections\n- Extract key information\n- Convert to different formats",
      csv: "For your CSV data file, I recommend:\n\n1. **GPT-5** - Excellent at data analysis and generating Python/pandas code\n2. **Claude Opus 4.6** - Great at interpreting data patterns and writing reports\n3. **Gemini 3.1 Pro** - Handles large datasets with its 2M token context\n\n**What I can do:**\n- Analyze trends and patterns\n- Generate charts and visualizations\n- Clean and transform the data\n- Write SQL queries",
    };

    const fallback = `I can help you work with **"${fileName}"**! Here are the best AI tools for your file:\n\n1. **Claude Opus 4.6** - Deep document understanding and analysis\n2. **GPT-5** - Versatile file processing and content generation\n3. **Gemini 3.1 Pro** - Large context for big files\n\nWould you like me to analyze, summarize, or extract specific information from your file?`;

    return toolsByType[ext] || fallback;
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('say hi')) {
    return "Hello! Welcome to NexusAI. I'm your AI assistant, ready to help you explore AI models, write code, analyze data, or just chat. What would you like to do today?";
  }

  if (lower.includes('best') && lower.includes('model') && lower.includes('cod')) {
    return "For coding tasks, here are the top models on NexusAI:\n\n1. **Claude Opus 4.6** - Excellent at complex code generation, debugging, and architecture design. Best for large codebases.\n2. **GPT-5** - Strong all-rounder with great code completion and explanation abilities.\n3. **Gemini 3.1 Pro** - Excels at multi-file understanding with its 2M token context window.\n\nWould you like me to compare any of these in detail?";
  }

  if (lower.includes('compare') && (lower.includes('gpt') || lower.includes('claude') || lower.includes('gemini'))) {
    return "Here's a quick comparison:\n\n| Feature | GPT-5 | Claude Opus 4.6 | Gemini 3.1 Pro |\n|---------|-------|-----------------|----------------|\n| Context Window | 256K | 200K | 2M |\n| Code Quality | Excellent | Excellent | Very Good |\n| Speed | Fast | Medium | Fast |\n| Pricing | $15/1M tokens | $15/1M tokens | $7/1M tokens |\n| Vision | Yes | Yes | Yes |\n\nEach has strengths depending on your use case. What's your primary need?";
  }

  if (lower.includes('write') && lower.includes('code')) {
    return "I'd be happy to help you write code! To give you the best assistance, could you tell me:\n\n1. **What language** are you working with? (Python, JavaScript, TypeScript, etc.)\n2. **What you're building** - a function, API, component, or something else?\n3. **Any specific requirements** or constraints?\n\nJust describe what you need and I'll generate the code for you.";
  }

  if (lower.includes('agent')) {
    return "NexusAI Agents are powerful AI assistants you can customize for specific tasks. Here's how to get started:\n\n1. **Choose a template** - Code Assistant, Content Writer, Data Analyst, or Research Agent\n2. **Configure the model** - Select which AI model powers your agent\n3. **Set the system prompt** - Define your agent's personality and capabilities\n4. **Add tools** - Enable web search, code execution, file operations, etc.\n5. **Deploy** - Get an API endpoint for your agent\n\nWould you like to create an agent now?";
  }

  if (lower.includes('free') && lower.includes('model')) {
    return "Great question! Here are the best free models available on NexusAI:\n\n- **Llama 4 Maverick** - Meta's open-source model, great for general tasks\n- **Gemma 3** - Google's lightweight model, fast and efficient\n- **Mistral Small** - Excellent for European languages\n\nThese are free to use with generous rate limits. For heavier workloads, our Budget tier starts at just $0.10/1M tokens.";
  }

  if (lower.includes('image') || lower.includes('generate') || lower.includes('create')) {
    return "I can help with creative tasks! Here's what's available:\n\n- **Text Generation** - Articles, stories, marketing copy\n- **Code Generation** - Full functions, components, APIs\n- **Data Analysis** - Interpret datasets, generate insights\n- **Summarization** - Condense long documents\n\nNote: Image generation is coming soon to NexusAI! For now, I can help describe or plan visual content. What would you like to create?";
  }

  if (lower.includes('analys') || lower.includes('data')) {
    return "I can help you analyze data! Here's what I can do:\n\n1. **Interpret datasets** - Upload a CSV or describe your data\n2. **Statistical analysis** - Mean, median, correlations, trends\n3. **Visualization suggestions** - Recommend the best chart types\n4. **Generate code** - Python/pandas scripts for data processing\n\nWhat kind of data are you working with?";
  }

  // Default contextual response
  return `That's a great question! Let me help you with that.\n\nBased on your query about "${prompt.slice(0, 80)}${prompt.length > 80 ? '...' : ''}", here are some thoughts:\n\n1. NexusAI provides access to 525+ AI models from 28 labs, so there's likely a perfect model for your needs.\n2. You can test different models side-by-side to find the best fit.\n3. Our agent builder lets you create custom AI workflows.\n\nWould you like me to go deeper into any of these areas, or is there something specific I can help you with?`;
}

// Mock streaming response generator
export async function* mockStreamResponse(prompt: string): AsyncGenerator<string> {
  const response = getMockResponse(prompt);

  // Stream word-by-word for realistic effect
  const words = response.split(' ');
  for (let i = 0; i < words.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
    yield words[i] + (i < words.length - 1 ? ' ' : '');
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
