import { ModelData } from '@/components/models/ModelCard';

export interface ModelReview {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface ModelDetailData {
  overview: {
    description: string;
    capabilities: string[];
    limitations: string[];
    benchmarks: { name: string; score: string }[];
  };
  howToUse: {
    steps: { title: string; description: string; code?: string }[];
  };
  pricing: {
    inputPerMillion: number;
    outputPerMillion: number;
    contextWindow: string;
    batchSize: string;
    notes: string;
  };
  promptGuide: {
    bestPractices: string[];
    examples: { title: string; prompt: string }[];
    tips: string[];
  };
  agentCreation: {
    description: string;
    steps: string[];
    suggestedConfig: {
      temperature: number;
      maxTokens: number;
      topP: number;
      systemPrompt: string;
    };
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
    distribution: { stars: number; count: number }[];
    items: ModelReview[];
  };
}

const createDefaultReviews = (avg: number, total: number): ModelDetailData['reviews'] => ({
  averageRating: avg,
  totalReviews: total,
  distribution: [
    { stars: 5, count: Math.floor(total * 0.6) },
    { stars: 4, count: Math.floor(total * 0.25) },
    { stars: 3, count: Math.floor(total * 0.1) },
    { stars: 2, count: Math.floor(total * 0.03) },
    { stars: 1, count: Math.floor(total * 0.02) },
  ],
  items: [
    {
      id: '1',
      user: 'Alex Chen',
      avatar: 'AC',
      rating: 5,
      comment: 'Exceptional performance on complex reasoning tasks. The context window is incredibly useful for analyzing large documents.',
      date: '2 days ago',
      helpful: 42,
    },
    {
      id: '2',
      user: 'Sarah Miller',
      avatar: 'SM',
      rating: 5,
      comment: 'Best model I have used for code generation. Very accurate and follows instructions precisely.',
      date: '1 week ago',
      helpful: 38,
    },
    {
      id: '3',
      user: 'David Park',
      avatar: 'DP',
      rating: 4,
      comment: 'Great overall, but can be expensive at scale. Consider using the mini version for simpler tasks.',
      date: '2 weeks ago',
      helpful: 24,
    },
    {
      id: '4',
      user: 'Emma Wilson',
      avatar: 'EW',
      rating: 5,
      comment: 'Revolutionary model for our RAG pipeline. The retrieval accuracy is unmatched.',
      date: '3 weeks ago',
      helpful: 19,
    },
  ],
});

export const MODEL_DETAILS: Partial<Record<string, ModelDetailData>> = {
  'gpt-5': {
    overview: {
      description: 'GPT-5 is OpenAI\'s most advanced model, offering superior instruction-following, extended multi-task memory, and unprecedented reasoning capabilities. It excels at complex multi-step tasks, creative writing, and sophisticated code generation.',
      capabilities: [
        'Advanced reasoning and analysis',
        'Extended context understanding (1M tokens)',
        'Multi-step task execution',
        'Creative and technical writing',
        'Code generation and debugging',
        'Vision and image understanding',
      ],
      limitations: [
        'Higher cost for large-scale usage',
        'May overthink simple tasks',
        'Requires clear prompting for best results',
      ],
      benchmarks: [
        { name: 'MMLU', score: '92.3%' },
        { name: 'HumanEval', score: '95.1%' },
        { name: 'MATH', score: '89.7%' },
        { name: 'GSM8K', score: '97.2%' },
      ],
    },
    howToUse: {
      steps: [
        {
          title: 'Set up your API key',
          description: 'Get your API key from the OpenAI dashboard and set it as an environment variable.',
          code: 'export OPENAI_API_KEY="sk-your-api-key"',
        },
        {
          title: 'Install the SDK',
          description: 'Install the OpenAI SDK in your project using npm or yarn.',
          code: 'npm install openai',
        },
        {
          title: 'Make your first request',
          description: 'Use the chat completions API to send a message and receive a response.',
          code: `import OpenAI from 'openai';

const openai = new OpenAI();

const response = await openai.chat.completions.create({
  model: 'gpt-5',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response.choices[0].message.content);`,
        },
        {
          title: 'Handle streaming responses',
          description: 'For long responses, use streaming to get tokens as they are generated.',
          code: `const stream = await openai.chat.completions.create({
  model: 'gpt-5',
  messages: [{ role: 'user', content: 'Write a story' }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}`,
        },
      ],
    },
    pricing: {
      inputPerMillion: 10,
      outputPerMillion: 30,
      contextWindow: '1M tokens',
      batchSize: '16K tokens',
      notes: 'Pricing is per 1M tokens. Input includes all messages and system prompts.',
    },
    promptGuide: {
      bestPractices: [
        'Be specific and clear about what you want',
        'Provide context and examples when possible',
        'Break complex tasks into smaller steps',
        'Use system prompts to set behavior and tone',
      ],
      examples: [
        {
          title: 'Code Review',
          prompt: 'Review the following code for security vulnerabilities, performance issues, and best practices. Provide specific suggestions for improvement:\n\n```python\ndef process_data(data):\n    results = []\n    for item in data:\n        results.append(transform(item))\n    return results\n```',
        },
        {
          title: 'Document Analysis',
          prompt: 'Analyze this document and extract: 1) Key findings, 2) Action items, 3) Potential risks, 4) Recommendations. Format as a structured executive summary.',
        },
        {
          title: 'Creative Writing',
          prompt: 'Write a product description for a new AI-powered smartwatch. Target audience: tech-savvy professionals aged 25-40. Tone: innovative yet approachable. Include key features, benefits, and a compelling call-to-action.',
        },
      ],
      tips: [
        'Use temperature 0.7 for creative tasks, 0.2 for analytical tasks',
        'Include output format examples in your prompt',
        'Ask the model to "think step by step" for complex reasoning',
      ],
    },
    agentCreation: {
      description: 'GPT-5 is ideal for building sophisticated AI agents that require advanced reasoning, multi-step task execution, and context-aware responses.',
      steps: [
        'Define your agent\'s purpose and capabilities',
        'Design a clear system prompt that establishes the agent\'s persona',
        'Configure temperature and other parameters based on use case',
        'Implement tool/function calling for external actions',
        'Add memory and context management',
        'Test thoroughly with edge cases',
      ],
      suggestedConfig: {
        temperature: 0.7,
        maxTokens: 4096,
        topP: 0.95,
        systemPrompt: 'You are a helpful AI assistant specialized in [DOMAIN]. Provide accurate, helpful responses while being concise and professional.',
      },
    },
    reviews: createDefaultReviews(4.9, 12432),
  },

  'gpt-4.1': {
    overview: {
      description: 'GPT-4.1 is optimized for coding tasks and instruction-following with a massive 1M context window. It provides excellent performance at a lower cost than GPT-5, making it ideal for development workflows.',
      capabilities: [
        'Code generation and refactoring',
        'Bug detection and fixing',
        'Code explanation and documentation',
        'Multi-file context understanding',
        'Test generation',
      ],
      limitations: [
        'Less creative than GPT-5',
        'May be overkill for simple tasks',
      ],
      benchmarks: [
        { name: 'MMLU', score: '88.5%' },
        { name: 'HumanEval', score: '92.3%' },
        { name: 'MATH', score: '78.4%' },
      ],
    },
    howToUse: {
      steps: [
        {
          title: 'Install SDK',
          description: 'Install the OpenAI SDK.',
          code: 'npm install openai',
        },
        {
          title: 'Generate code',
          description: 'Use GPT-4.1 for code generation tasks.',
          code: `const response = await openai.chat.completions.create({
  model: 'gpt-4.1',
  messages: [{
    role: 'user',
    content: 'Write a TypeScript function to validate email addresses'
  }],
});`,
        },
      ],
    },
    pricing: {
      inputPerMillion: 2,
      outputPerMillion: 8,
      contextWindow: '1M tokens',
      batchSize: '16K tokens',
      notes: 'Great balance of capability and cost for coding tasks.',
    },
    promptGuide: {
      bestPractices: [
        'Specify the programming language explicitly',
        'Include error handling requirements',
        'Request tests along with implementation',
      ],
      examples: [
        {
          title: 'Function Generation',
          prompt: 'Write a TypeScript function that:\n1. Takes an array of objects\n2. Filters by a given property value\n3. Sorts by another property\n4. Returns paginated results\n\nInclude JSDoc comments and error handling.',
        },
      ],
      tips: [
        'Ask for explanations of complex code',
        'Request multiple solutions for comparison',
      ],
    },
    agentCreation: {
      description: 'GPT-4.1 is perfect for coding assistants and automated code review agents.',
      steps: [
        'Define the coding domain and languages',
        'Set up context for project structure',
        'Configure for accurate, safe code generation',
      ],
      suggestedConfig: {
        temperature: 0.2,
        maxTokens: 4096,
        topP: 0.9,
        systemPrompt: 'You are an expert software engineer. Write clean, efficient, well-documented code following best practices.',
      },
    },
    reviews: createDefaultReviews(4.8, 11725),
  },

  'claude-opus-4-6': {
    overview: {
      description: 'Claude Opus 4.6 is Anthropic\'s most intelligent model with extended thinking capabilities and a 200K context window. It excels at nuanced understanding, creative tasks, and complex analysis.',
      capabilities: [
        'Extended thinking for complex problems',
        'Nuanced content understanding',
        'Creative writing and storytelling',
        'Research and analysis',
        'Ethical reasoning',
      ],
      limitations: [
        'Higher cost for extended thinking',
        'Slower for simple tasks',
      ],
      benchmarks: [
        { name: 'MMLU', score: '91.2%' },
        { name: 'HumanEval', score: '93.5%' },
        { name: 'GPQA', score: '87.1%' },
      ],
    },
    howToUse: {
      steps: [
        {
          title: 'Install Anthropic SDK',
          description: 'Install the Anthropic SDK for Node.js.',
          code: 'npm install @anthropic-ai/sdk',
        },
        {
          title: 'Make a request',
          description: 'Send a message to Claude.',
          code: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const message = await anthropic.messages.create({
  model: 'claude-opus-4-6',
  max_tokens: 4096,
  messages: [{ role: 'user', content: 'Hello, Claude!' }],
});`,
        },
      ],
    },
    pricing: {
      inputPerMillion: 15,
      outputPerMillion: 75,
      contextWindow: '200K tokens',
      batchSize: '4K tokens',
      notes: 'Extended thinking mode incurs additional costs based on thinking time.',
    },
    promptGuide: {
      bestPractices: [
        'Use XML tags to structure prompts',
        'Provide clear context and goals',
        'Ask Claude to think through problems step by step',
      ],
      examples: [
        {
          title: 'Document Analysis',
          prompt: '<document>\n[PASTE YOUR DOCUMENT]\n</document>\n\nPlease analyze this document and provide:\n1. Executive summary\n2. Key insights\n3. Potential concerns\n4. Recommendations',
        },
      ],
      tips: [
        'Claude excels with clear structure',
        'Use Claude\'s constitution alignment for ethical tasks',
      ],
    },
    agentCreation: {
      description: 'Claude Opus 4.6 is excellent for research agents, analysis tools, and creative applications.',
      steps: [
        'Define the agent\'s analytical focus',
        'Structure prompts with clear delimiters',
        'Enable extended thinking for complex tasks',
      ],
      suggestedConfig: {
        temperature: 0.7,
        maxTokens: 4096,
        topP: 0.95,
        systemPrompt: 'You are Claude, a helpful AI assistant created by Anthropic. Be thorough, nuanced, and intellectually honest.',
      },
    },
    reviews: createDefaultReviews(4.9, 3241),
  },

  'claude-sonnet-4-5': {
    overview: {
      description: 'Claude Sonnet 4.5 offers the best balance of speed and intelligence. Ideal for agentic workflows, long document processing, and hybrid writing tasks.',
      capabilities: [
        'Fast, high-quality responses',
        'Long document processing',
        'Code and text generation',
        'Agentic workflows',
        'Tool use and function calling',
      ],
      limitations: [
        'Less capable than Opus for complex reasoning',
        'May need prompting for creative tasks',
      ],
      benchmarks: [
        { name: 'MMLU', score: '88.9%' },
        { name: 'HumanEval', score: '90.2%' },
        { name: 'GSM8K', score: '95.1%' },
      ],
    },
    howToUse: {
      steps: [
        {
          title: 'Basic usage',
          description: 'Quick example of using Claude Sonnet.',
          code: `const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Summarize this article...' }],
});`,
        },
      ],
    },
    pricing: {
      inputPerMillion: 3,
      outputPerMillion: 15,
      contextWindow: '200K tokens',
      batchSize: '4K tokens',
      notes: 'Best value for most use cases.',
    },
    promptGuide: {
      bestPractices: [
        'Leverage the large context window',
        'Use for production workloads',
        'Enable streaming for better UX',
      ],
      examples: [
        {
          title: 'Summarization',
          prompt: 'Summarize the following document in 3 bullet points, focusing on actionable insights:\n\n[DOCUMENT]',
        },
      ],
      tips: [
        'Great for high-volume tasks',
        'Use for chatbots and assistants',
      ],
    },
    agentCreation: {
      description: 'Claude Sonnet is the go-to model for building responsive AI agents.',
      steps: [
        'Configure for your specific use case',
        'Set up tool definitions',
        'Implement conversation memory',
      ],
      suggestedConfig: {
        temperature: 0.6,
        maxTokens: 2048,
        topP: 0.9,
        systemPrompt: 'You are a helpful assistant. Be concise, accurate, and friendly.',
      },
    },
    reviews: createDefaultReviews(4.8, 4523),
  },

  'gemini-2-5-pro': {
    overview: {
      description: 'Gemini 2.5 Pro is Google DeepMind\'s flagship model with 1M context, multimodal capabilities, and advanced reasoning. It excels at vision, language, and code tasks.',
      capabilities: [
        'Multimodal understanding (text, image, video, audio)',
        '1M token context window',
        'Advanced reasoning',
        'Code generation',
        'Real-time streaming',
      ],
      limitations: [
        'May require Google Cloud setup',
        'Rate limits on free tier',
      ],
      benchmarks: [
        { name: 'MMLU', score: '89.4%' },
        { name: 'HumanEval', score: '88.7%' },
        { name: 'MATH', score: '85.2%' },
      ],
    },
    howToUse: {
      steps: [
        {
          title: 'Install Google AI SDK',
          description: 'Install the Google Generative AI SDK.',
          code: 'npm install @google/generative-ai',
        },
        {
          title: 'Generate content',
          description: 'Use Gemini to generate content.',
          code: `import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

const result = await model.generateContent('Explain quantum computing');
console.log(result.response.text());`,
        },
      ],
    },
    pricing: {
      inputPerMillion: 1.25,
      outputPerMillion: 5,
      contextWindow: '1M tokens',
      batchSize: '8K tokens',
      notes: 'Very competitive pricing for the capability level.',
    },
    promptGuide: {
      bestPractices: [
        'Use system instructions for behavior control',
        'Leverage multimodal inputs when helpful',
        'Use safety settings appropriately',
      ],
      examples: [
        {
          title: 'Image Analysis',
          prompt: 'Analyze this image and describe: 1) Main subjects, 2) Composition, 3) Mood/atmosphere, 4) Any text visible',
        },
      ],
      tips: [
        'Great for vision tasks',
        'Use thinking mode for complex reasoning',
      ],
    },
    agentCreation: {
      description: 'Gemini is excellent for multimodal agents and applications requiring vision.',
      steps: [
        'Set up Google AI credentials',
        'Configure safety settings',
        'Enable multimodal inputs',
      ],
      suggestedConfig: {
        temperature: 0.7,
        maxTokens: 2048,
        topP: 0.95,
        systemPrompt: 'You are a helpful AI assistant powered by Google.',
      },
    },
    reviews: createDefaultReviews(4.8, 8234),
  },

  'deepseek-v3': {
    overview: {
      description: 'DeepSeek V3 is a cost-efficient frontier model with exceptional math and coding capabilities. Open weights available for self-hosting.',
      capabilities: [
        'Cost-effective inference',
        'Strong coding performance',
        'Mathematical reasoning',
        'Open weights for self-hosting',
      ],
      limitations: [
        'Smaller context than premium models',
        'Less multimodal capability',
      ],
      benchmarks: [
        { name: 'MMLU', score: '87.1%' },
        { name: 'HumanEval', score: '89.2%' },
        { name: 'MATH', score: '82.5%' },
      ],
    },
    howToUse: {
      steps: [
        {
          title: 'Use DeepSeek API',
          description: 'DeepSeek is compatible with OpenAI SDK.',
          code: `import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_KEY,
});

const response = await openai.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: 'Hello!' }],
});`,
        },
      ],
    },
    pricing: {
      inputPerMillion: 0.14,
      outputPerMillion: 0.28,
      contextWindow: '128K tokens',
      batchSize: '4K tokens',
      notes: 'Exceptional value for the performance level.',
    },
    promptGuide: {
      bestPractices: [
        'Use for cost-sensitive applications',
        'Leverage strong coding abilities',
        'Consider self-hosting for privacy',
      ],
      examples: [
        {
          title: 'Code Generation',
          prompt: 'Write a Python function to implement binary search with detailed comments.',
        },
      ],
      tips: [
        'Great for high-volume tasks',
        'Self-host for data privacy',
      ],
    },
    agentCreation: {
      description: 'DeepSeek is ideal for cost-effective agents with strong coding abilities.',
      steps: [
        'Choose API or self-hosted deployment',
        'Configure for your use case',
        'Optimize for cost efficiency',
      ],
      suggestedConfig: {
        temperature: 0.3,
        maxTokens: 2048,
        topP: 0.9,
        systemPrompt: 'You are a helpful coding assistant. Provide clear, efficient solutions.',
      },
    },
    reviews: createDefaultReviews(4.7, 12045),
  },
};

// Helper function to get model details with fallback
export function getModelDetails(modelId: string): ModelDetailData | undefined {
  return MODEL_DETAILS[modelId];
}
