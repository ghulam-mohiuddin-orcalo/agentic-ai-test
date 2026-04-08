import { baseApi } from './baseApi';

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: any[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  modelId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface CreateConversationRequest {
  modelId: string;
  title?: string;
}

export interface AddMessageRequest {
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: any[];
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => '/chat/conversations',
      providesTags: ['Conversations'],
    }),
    getConversation: builder.query<Conversation, string>({
      query: (id) => `/chat/conversations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Conversations', id }],
    }),
    createConversation: builder.mutation<Conversation, CreateConversationRequest>({
      query: (body) => ({
        url: '/chat/conversations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Conversations'],
    }),
    deleteConversation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/chat/conversations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Conversations'],
    }),
    addMessage: builder.mutation<Message, AddMessageRequest>({
      query: ({ conversationId, ...body }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'Conversations', id: conversationId },
      ],
    }),
    getMessages: builder.query<Message[], string>({
      query: (conversationId) => `/chat/conversations/${conversationId}/messages`,
      providesTags: (result, error, conversationId) => [
        { type: 'Conversations', id: conversationId },
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useCreateConversationMutation,
  useDeleteConversationMutation,
  useAddMessageMutation,
  useGetMessagesQuery,
} = chatApi;
