import { baseApi } from './baseApi';
import { AI_LABS } from '@/lib/constants';
import { MARKETPLACE_MODELS } from '@/lib/marketplaceData';

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

// Map marketplace models to ModelInfo shape (used as API fallback)
const MOCK_MODELS: ModelInfo[] = MARKETPLACE_MODELS.map((m) => ({
  id: m.id,
  name: m.name,
  provider: m.org,
  icon: m.icon,
  description: m.desc,
  tags: m.tags,
  price: m.price,
  rating: m.rating,
}));

export const PROVIDER_COLORS: Record<string, string> = Object.fromEntries(
  AI_LABS.map((lab) => [lab.name, lab.color])
);

export const modelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getModels: builder.query<ModelInfo[], void>({
      queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
        // Try real API first — request all models with high limit
        const result = await baseQuery('/models?limit=100');

        if (result.error) {
          // Fallback to marketplace data when backend is unavailable
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
          price: typeof m.price === 'string'
            ? m.price
            : m.pricing
              ? `$${m.pricing.input}/${m.pricing.output} per 1M`
              : 'N/A',
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
