---
name: frontend-standards
description: React, Next.js, and Redux conventions for NexusAI frontend
---

# Frontend Standards

## Framework

- **Next.js 16** with App Router (not Pages Router)
- **React 19** with server components by default
- **TypeScript** strict mode
- `'use client'` directive only when needed (state, effects, browser APIs, event handlers)

## Component Structure

```
frontend/src/components/
├── [feature]/           # Group by feature
│   ├── ComponentA.tsx
│   ├── ComponentB.tsx
│   └── index.ts        # Barrel export (optional)
```

## Component Rules

1. **Server Components** (default): For data display, static content, SEO pages
2. **Client Components** (`'use client'`): For interactivity, state, effects, browser APIs
3. One component per file
4. Props defined as typed interface
5. Use MUI components + Tailwind utilities

```typescript
// Server component (no directive needed)
export default function ModelList({ models }: { models: Model[] }) {
  return (
    <Stack spacing={2}>
      {models.map(m => <ModelCard key={m.id} model={m} />)}
    </Stack>
  );
}

// Client component
'use client';
import { useState } from 'react';
import { Button } from '@mui/material';

export default function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [message, setMessage] = useState('');
  // ...
}
```

## State Management

### Redux Toolkit (Global State)

```
store/
├── index.ts          # configureStore
├── hooks.ts          # useAppSelector, useAppDispatch
├── api/
│   ├── baseApi.ts    # RTK Query base with auth header
│   ├── authApi.ts    # Auth endpoints
│   └── chatApi.ts    # Chat endpoints
└── slices/
    ├── authSlice.ts  # Auth state + localStorage
    ├── chatSlice.ts  # Streaming state
    └── uiSlice.ts    # UI toggles
```

### RTK Query Pattern

```typescript
export const featureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<Response, Params>({
      query: (params) => ({ url: '/items', params }),
      providesTags: ['Item'],
    }),
    createItem: builder.mutation<Item, CreateDto>({
      query: (body) => ({ url: '/items', method: 'POST', body }),
      invalidatesTags: ['Item'],
    }),
  }),
});
```

### When to Use What

| State Type | Solution |
|-----------|----------|
| Server data (API responses) | RTK Query |
| Global UI state (theme, sidebar) | Redux slice |
| Component-local state | useState |
| Form state | react-hook-form |

## Styling

- **MUI**: Layout components (Box, Stack, Grid, Paper, Card)
- **Tailwind**: Spacing, typography, responsive, utilities
- **Theme**: Defined in `lib/theme.ts`
  - Primary: Terracotta `#C86222A`
  - Fonts: Instrument Sans (body), Syne (headings)

## API Integration

- Base URL: `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1'`
- Auth token in Redux state: `state.auth.token`
- Injected via RTK Query `prepareHeaders`
- Socket.IO from `lib/socket.ts`

## Forms

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
}
```

## File Uploads

- Use `multipart/form-data` for file uploads
- Validate file type and size client-side before upload
- Show upload progress with MUI LinearProgress

## Error Handling

- RTK Query handles API errors automatically
- Use `notistack` for user-facing error notifications
- Never expose raw error messages from API
