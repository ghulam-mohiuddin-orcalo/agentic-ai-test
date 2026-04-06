import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  modelId?: string;
  attachments?: unknown[];
}

export interface AttachedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  kind: 'file' | 'image' | 'audio' | 'video' | 'screen';
  source: 'upload' | 'voice' | 'video' | 'screen';
  durationSeconds?: number;
}

interface ChatState {
  activeConversationId: string | null;
  selectedModel: string;
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;
  initialPrompt: string | null;
  attachedFiles: AttachedFile[];
}

const initialState: ChatState = {
  activeConversationId: null,
  selectedModel: 'gpt-5',
  messages: [],
  isStreaming: false,
  streamingContent: '',
  error: null,
  initialPrompt: null,
  attachedFiles: [],
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
    setInitialPrompt: (state, action: PayloadAction<string>) => {
      state.initialPrompt = action.payload;
    },
    setAttachedFiles: (state, action: PayloadAction<AttachedFile[]>) => {
      state.attachedFiles = action.payload;
    },
    clearInitialPrompt: (state) => {
      state.initialPrompt = null;
      state.attachedFiles = [];
    },
    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
    },
    resetChat: (state) => {
      state.activeConversationId = null;
      state.messages = [];
      state.isStreaming = false;
      state.streamingContent = '';
      state.error = null;
    },
    clearAllHistory: (state) => {
      state.activeConversationId = null;
      state.messages = [];
      state.isStreaming = false;
      state.streamingContent = '';
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
  setInitialPrompt,
  setAttachedFiles,
  clearInitialPrompt,
  setSelectedModel,
  resetChat,
  clearAllHistory,
} = chatSlice.actions;

export default chatSlice.reducer;
