import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelId?: string;
}

interface ChatState {
  activeConversationId: string | null;
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;
}

const initialState: ChatState = {
  activeConversationId: null,
  messages: [],
  isStreaming: false,
  streamingContent: '',
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    startStreaming: (state) => {
      state.isStreaming = true;
      state.streamingContent = '';
      state.error = null;
    },
    appendChunk: (state, action: PayloadAction<string>) => {
      state.streamingContent += action.payload;
    },
    finishStreaming: (state, action: PayloadAction<Message>) => {
      state.isStreaming = false;
      state.messages.push(action.payload);
      state.streamingContent = '';
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isStreaming = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setActiveConversation,
  addMessage,
  setMessages,
  startStreaming,
  appendChunk,
  finishStreaming,
  setError,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;
