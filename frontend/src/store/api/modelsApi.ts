import { baseApi } from './baseApi';
import { FEATURED_MODELS, AI_LABS } from '@/lib/constants';

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  icon: string;
  description: string;
  tags: string[];
  price: string;
  rating: number;
}

// Extended model catalog - used when backend is unavailable
const EXTRA_MODELS: ModelInfo[] = [
  // OpenAI extended
  { id: 'gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI', icon: '🧠', description: 'Latest GPT-5 series with improved reasoning.', tags: ['Flagship', 'Reasoning'], price: '$10/1M tk', rating: 4.9 },
  { id: 'gpt-5-turbo', name: 'GPT-5 Turbo', provider: 'OpenAI', icon: '🧠', description: 'Faster GPT-5 variant optimized for speed.', tags: ['Fast', 'Multimodal'], price: '$5/1M tk', rating: 4.8 },
  { id: 'gpt-4.5', name: 'GPT-4.5', provider: 'OpenAI', icon: '🧠', description: 'Enhanced GPT-4 with improved creative writing.', tags: ['Creative', 'Writing'], price: '$3/1M tk', rating: 4.7 },
  { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', icon: '🧠', description: 'Efficient GPT-4 series model.', tags: ['Efficient', 'Code'], price: '$2/1M tk', rating: 4.6 },
  { id: 'gpt-4.1-mini', name: 'GPT-4.1-mini', provider: 'OpenAI', icon: '🧠', description: 'Compact GPT-4.1 for lightweight tasks.', tags: ['Mini', 'Fast'], price: '$0.40/1M tk', rating: 4.4 },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', icon: '🧠', description: 'Omni model with vision, audio and text.', tags: ['Multimodal', 'Vision'], price: '$2.50/1M tk', rating: 4.7 },
  { id: 'gpt-4o-mini', name: 'GPT-4o-mini', provider: 'OpenAI', icon: '🧠', description: 'Compact multimodal model.', tags: ['Mini', 'Vision'], price: '$0.15/1M tk', rating: 4.5 },
  { id: 'o3', name: 'o3', provider: 'OpenAI', icon: '🧠', description: 'Advanced reasoning model with chain-of-thought.', tags: ['Reasoning', 'STEM'], price: '$10/1M tk', rating: 4.8 },
  { id: 'o3-mini', name: 'o3-mini', provider: 'OpenAI', icon: '🧠', description: 'Compact reasoning model.', tags: ['Reasoning', 'Mini'], price: '$1.10/1M tk', rating: 4.6 },
  { id: 'o4-mini', name: 'o4-mini', provider: 'OpenAI', icon: '🧠', description: 'Next-gen compact reasoning model.', tags: ['Reasoning', 'Mini'], price: '$1.10/1M tk', rating: 4.7 },
  // Anthropic extended
  { id: 'claude-opus-4.5', name: 'Claude Opus 4.5', provider: 'Anthropic', icon: '👑', description: 'Previous-gen flagship Claude.', tags: ['Agents', 'Coding'], price: '$5/1M tk', rating: 4.8 },
  { id: 'claude-opus-4', name: 'Claude Opus 4', provider: 'Anthropic', icon: '👑', description: 'Highly capable Claude model.', tags: ['Coding', 'Analysis'], price: '$4/1M tk', rating: 4.7 },
  { id: 'claude-sonnet-4.6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', icon: '👑', description: 'Fast and intelligent balanced model.', tags: ['Fast', 'Coding'], price: '$3/1M tk', rating: 4.7 },
  { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', provider: 'Anthropic', icon: '👑', description: 'Previous-gen balanced Claude.', tags: ['Balanced', 'Code'], price: '$2/1M tk', rating: 4.6 },
  // Google extended
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google DeepMind', icon: '🔬', description: 'Ultra-fast Gemini for real-time use.', tags: ['Fast', 'Efficient'], price: '$0.15/1M tk', rating: 4.5 },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google DeepMind', icon: '🔬', description: 'Strong multimodal capabilities.', tags: ['Multimodal', 'Vision'], price: '$1.25/1M tk', rating: 4.6 },
];

const MOCK_MODELS: ModelInfo[] = [
  ...FEATURED_MODELS.map((m) => ({
    id: m.id,
    name: m.name,
    provider: m.org,
    icon: m.icon,
    description: m.desc,
    tags: m.tags,
    price: m.price,
    rating: m.rating,
  })),
  ...EXTRA_MODELS,
];

const PROVIDER_COLORS: Record<string, string> = Object.fromEntries(
  AI_LABS.map((lab) => [lab.name, lab.color])
);

export { PROVIDER_COLORS };

export const modelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getModels: builder.query<ModelInfo[], void>({
      queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
        // Try real API first
        const result = await baseQuery('/models');

        if (result.error) {
          // Fallback to mock data when backend is unavailable
          return { data: MOCK_MODELS };
        }

        // Map backend response to ModelInfo shape
        // Backend returns { data: [...], meta: {...} } (paginated)
        const raw = result.data as any;
        const backendModels: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
        const models: ModelInfo[] = backendModels.map((m: any) => ({
          id: m.id,
          name: m.name,
          provider: m.provider || m.org || 'Unknown',
          icon: m.icon || '🤖',
          description: m.description || m.desc || '',
          tags: m.tags || [],
          price: m.price || 'N/A',
          rating: m.rating || 0,
        }));

        return { data: models.length > 0 ? models : MOCK_MODELS };
      },
      providesTags: ['Models'],
    }),
  }),
});

export const { useGetModelsQuery } = modelsApi;

// Helper to find model info by ID
export function findModelInfo(models: ModelInfo[] | undefined, modelId: string): ModelInfo | undefined {
  return models?.find((m) => m.id === modelId);
}
