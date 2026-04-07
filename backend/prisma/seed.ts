import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: number;
  pricing: { input: number; output: number };
  rating: number;
  tags: string[];
  license: string;
}

const MODELS: SeedModel[] = [
  // OpenAI
  {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    description: 'OpenAI flagship. Better instruction-following and extended multi-task memory.',
    contextWindow: 2000000,
    pricing: { input: 10, output: 30 },
    rating: 4.9,
    tags: ['Language', 'Vision', 'Code'],
    license: 'proprietary',
  },
  {
    id: 'gpt-5.2',
    name: 'GPT-5.2',
    provider: 'OpenAI',
    description: 'Mini GPT-5 outputs with improved instruction-following and multimodal features.',
    contextWindow: 1000000,
    pricing: { input: 6, output: 18 },
    rating: 4.8,
    tags: ['Language', 'Multimodal', 'Instruction'],
    license: 'proprietary',
  },
  {
    id: 'gpt-5-turbo',
    name: 'GPT-5 Turbo',
    provider: 'OpenAI',
    description: 'Fast, cost-effective GPT-5 for high-volume long-form generation.',
    contextWindow: 500000,
    pricing: { input: 5, output: 15 },
    rating: 4.7,
    tags: ['Language', 'Fast', 'High Volume'],
    license: 'proprietary',
  },
  {
    id: 'gpt-4.5',
    name: 'GPT-4.5',
    provider: 'OpenAI',
    description: 'Bridging model with improved creativity and long-form generation.',
    contextWindow: 128000,
    pricing: { input: 7.5, output: 22.5 },
    rating: 4.7,
    tags: ['Language', 'Long-form'],
    license: 'proprietary',
  },
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    provider: 'OpenAI',
    description: 'Optimised for coding task instruction-following with 1M context window.',
    contextWindow: 1000000,
    pricing: { input: 2, output: 8 },
    rating: 4.8,
    tags: ['Code', 'Instruction', 'Language'],
    license: 'proprietary',
  },
  {
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1-mini',
    provider: 'OpenAI',
    description: 'Lightweight GPT-4.1 for fast, affordable everyday tasks.',
    contextWindow: 128000,
    pricing: { input: 0.4, output: 1.6 },
    rating: 4.6,
    tags: ['Language', 'Fast', 'Multimodal'],
    license: 'proprietary',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Multimodal flagship combining text, vision, and audio in one unified model.',
    contextWindow: 128000,
    pricing: { input: 2.5, output: 10 },
    rating: 4.7,
    tags: ['Language', 'Vision', 'Audio', 'Code'],
    license: 'proprietary',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o-mini',
    provider: 'OpenAI',
    description: 'Affordable, lightweight chat and vision model for everyday tasks.',
    contextWindow: 128000,
    pricing: { input: 0.15, output: 0.6 },
    rating: 4.5,
    tags: ['Language', 'Vision', 'Fast'],
    license: 'proprietary',
  },
  {
    id: 'o3',
    name: 'o3',
    provider: 'OpenAI',
    description: "OpenAI's advanced reasoning model for multi-step thoughts for complex tasks.",
    contextWindow: 200000,
    pricing: { input: 10, output: 40 },
    rating: 4.9,
    tags: ['Reasoning', 'Code', 'Analysis'],
    license: 'proprietary',
  },
  {
    id: 'o3-mini',
    name: 'o3-mini',
    provider: 'OpenAI',
    description: 'Cost-effective reasoning model. Best value at $1.10/1M tokens for complex tasks.',
    contextWindow: 200000,
    pricing: { input: 1.1, output: 4.4 },
    rating: 4.7,
    tags: ['Reasoning', 'Code', 'Efficient'],
    license: 'proprietary',
  },
  {
    id: 'o4-mini',
    name: 'o4-mini',
    provider: 'OpenAI',
    description: "OpenAI's compact reasoning model cost-effective $1.10/1M, strong at STEM.",
    contextWindow: 200000,
    pricing: { input: 1.1, output: 4.4 },
    rating: 4.7,
    tags: ['Reasoning', 'STEM', 'Code'],
    license: 'proprietary',
  },
  // Anthropic
  {
    id: 'claude-opus-4-6',
    name: 'Claude Opus 4.6',
    provider: 'Anthropic',
    description: 'Most intelligent Claude model. Extended thinking with 200K context and creative tasks.',
    contextWindow: 200000,
    pricing: { input: 15, output: 75 },
    rating: 4.9,
    tags: ['Language', 'Reasoning', 'Extended Thinking'],
    license: 'proprietary',
  },
  {
    id: 'claude-sonnet-4-5',
    name: 'Claude Sonnet 4.5',
    provider: 'Anthropic',
    description: 'Most intelligent Claude: flexible intelligence with extended thinking and 200K context.',
    contextWindow: 200000,
    pricing: { input: 3, output: 15 },
    rating: 4.8,
    tags: ['Language', 'Reasoning', 'Extended Thinking', 'Coding'],
    license: 'proprietary',
  },
  {
    id: 'claude-opus-4',
    name: 'Claude Opus 4',
    provider: 'Anthropic',
    description: 'Previous gen Opus: advanced content and reasoning with parallel tool use.',
    contextWindow: 200000,
    pricing: { input: 15, output: 75 },
    rating: 4.8,
    tags: ['Language', 'Analysis', 'Code'],
    license: 'proprietary',
  },
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    description: 'Opus 4 – More agentic; long document processing, and hybrid writing.',
    contextWindow: 200000,
    pricing: { input: 3, output: 15 },
    rating: 4.7,
    tags: ['Analysis', 'Long Documents', 'Writing'],
    license: 'proprietary',
  },
  // Google DeepMind
  {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google DeepMind',
    description: 'Google flagship with 1M context, multimodal capabilities and advanced reasoning.',
    contextWindow: 1000000,
    pricing: { input: 1.25, output: 10 },
    rating: 4.8,
    tags: ['Language', 'Vision', 'Reasoning'],
    license: 'proprietary',
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google DeepMind',
    description: 'Ultra-fast multimodal model with real-time streaming and 1M context window.',
    contextWindow: 1000000,
    pricing: { input: 0.1, output: 0.4 },
    rating: 4.7,
    tags: ['Language', 'Vision', 'Fast'],
    license: 'proprietary',
  },
  {
    id: 'gemma-3',
    name: 'Gemma 3',
    provider: 'Google DeepMind',
    description: "Google's open-source family. Strong at coding and efficient on consumer hardware.",
    contextWindow: 128000,
    pricing: { input: 0, output: 0 },
    rating: 4.5,
    tags: ['Language', 'Open Source', 'Code'],
    license: 'open',
  },
  // Meta AI
  {
    id: 'llama-4-scout',
    name: 'Llama 4 Scout',
    provider: 'Meta AI',
    description: 'Open-source multimodal model with 10M context and 17B active parameters.',
    contextWindow: 10000000,
    pricing: { input: 0, output: 0 },
    rating: 4.6,
    tags: ['Language', 'Open Source', 'Multimodal'],
    license: 'open',
  },
  // DeepSeek
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    description: 'Cost-efficient frontier model with exceptional math and coding capabilities.',
    contextWindow: 128000,
    pricing: { input: 0.14, output: 0.28 },
    rating: 4.7,
    tags: ['Language', 'Code', 'Open Source'],
    license: 'open',
  },
  // Mistral AI
  {
    id: 'mistral-large-3',
    name: 'Mistral Large 3',
    provider: 'Mistral AI',
    description: 'Top-tier reasoning with multilingual support and advanced function calling.',
    contextWindow: 128000,
    pricing: { input: 3, output: 9 },
    rating: 4.5,
    tags: ['Language', 'Code', 'Multilingual'],
    license: 'proprietary',
  },
  // xAI
  {
    id: 'grok-3',
    name: 'Grok 3 Beta',
    provider: 'xAI',
    description: 'Real-time internet access model. Excels at reasoning and data analysis tasks.',
    contextWindow: 128000,
    pricing: { input: 3, output: 15 },
    rating: 4.5,
    tags: ['Language', 'Reasoning', 'Code'],
    license: 'proprietary',
  },
  // Microsoft
  {
    id: 'phi-4',
    name: 'Phi-4',
    provider: 'Microsoft',
    description: 'Small but mighty. 14B parameters with strong reasoning-to-size ratio.',
    contextWindow: 16000,
    pricing: { input: 0.07, output: 0.14 },
    rating: 4.4,
    tags: ['Language', 'Reasoning', 'Efficient'],
    license: 'proprietary',
  },
  // Alibaba (Qwen)
  {
    id: 'qwen-2-5-72b',
    name: 'Qwen 2.5 72B',
    provider: 'Alibaba',
    description: 'Alibaba open-source flagship with outstanding code and math capabilities.',
    contextWindow: 128000,
    pricing: { input: 0.4, output: 0.6 },
    rating: 4.6,
    tags: ['Language', 'Code', 'Open Source'],
    license: 'open',
  },
  // Cohere
  {
    id: 'command-r-plus',
    name: 'Command R+',
    provider: 'Cohere',
    description: 'Enterprise RAG specialist with grounding, citations and tool use built-in.',
    contextWindow: 128000,
    pricing: { input: 2.5, output: 7.5 },
    rating: 4.3,
    tags: ['Language', 'Analysis', 'Multilingual'],
    license: 'proprietary',
  },
];

async function main() {
  console.log('Seeding models...');

  for (const model of MODELS) {
    await prisma.model.upsert({
      where: { id: model.id },
      update: {
        name: model.name,
        provider: model.provider,
        description: model.description,
        contextWindow: model.contextWindow,
        pricing: model.pricing as any,
        rating: model.rating,
        tags: model.tags,
        license: model.license,
      },
      create: {
        id: model.id,
        name: model.name,
        provider: model.provider,
        description: model.description,
        contextWindow: model.contextWindow,
        pricing: model.pricing as any,
        rating: model.rating,
        tags: model.tags,
        license: model.license,
      },
    });
  }

  console.log(`Seeded ${MODELS.length} models.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
