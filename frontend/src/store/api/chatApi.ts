import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

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

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Conversation', 'Message'],
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => '/chat/conversations',
      providesTags: ['Conversation'],
    }),
    getConversation: builder.query<Conversation, string>({
      query: (id) => `/chat/conversations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Conversation', id }],
    }),
    createConversation: builder.mutation<Conversation, CreateConversationRequest>({
      query: (body) => ({
        url: '/chat/conversations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Conversation'],
    }),
    deleteConversation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/chat/conversations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Conversation'],
    }),
    addMessage: builder.mutation<Message, AddMessageRequest>({
      query: ({ conversationId, ...body }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'Conversation', id: conversationId },
        'Message',
      ],
    }),
    getMessages: builder.query<Message[], string>({
      query: (conversationId) => `/chat/conversations/${conversationId}/messages`,
      providesTags: (result, error, conversationId) => [
        { type: 'Conversation', id: conversationId },
        'Message',
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
