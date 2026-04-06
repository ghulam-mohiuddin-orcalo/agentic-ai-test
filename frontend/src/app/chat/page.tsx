'use client';

import { Suspense, useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Alert, Button } from '@mui/material';
import Link from 'next/link';
import ModelsSidebar from '@/components/chat/ModelsSidebar';
import QuickActionsPanel from '@/components/chat/QuickActionsPanel';
import WelcomeScreen from '@/components/chat/WelcomeScreen';
import ChatInput from '@/components/chat/ChatInput';
import MessageThread from '@/components/chat/MessageThread';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { GuestChatStorage } from '@/lib/guestChat';
import { streamChatMessage } from '@/lib/chatApi';
import { useCreateConversationMutation, useAddMessageMutation } from '@/store/api/chatApi';
import { getSocket } from '@/lib/socket';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearInitialPrompt, type AttachedFile } from '@/store/slices/chatSlice';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelId?: string;
  attachment?: AttachedFile;
}

function ChatPageContent() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const initialPrompt = useAppSelector((state) => state.chat.initialPrompt);
  const attachedFile = useAppSelector((state) => state.chat.attachedFile);
  const selectedModel = useAppSelector((state) => state.chat.selectedModel);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [createConversation] = useCreateConversationMutation();
  const [addMessage] = useAddMessageMutation();
  const hasAutoSent = useRef(false);

  const hasMessages = messages.length > 0 || isStreaming;

  // Load guest messages on mount
  useEffect(() => {
    if (!isAuthenticated) {
      const guestConvId = GuestChatStorage.getCurrentConversationId();
      if (guestConvId) {
        const guestMessages = GuestChatStorage.getMessages(guestConvId);
        setMessages(
          guestMessages
            .filter((msg) => msg.role !== 'system')
            .map((msg) => ({
              id: msg.id,
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: new Date(msg.timestamp),
            }))
        );
        setConversationId(guestConvId);
      }
    }
  }, [isAuthenticated]);

  // Setup Socket.IO for authenticated users
  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();
    socket.connect();

    socket.on('chat:chunk', (data: { delta: string }) => {
      setStreamingContent((prev) => prev + data.delta);
    });

    socket.on('chat:done', async () => {
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: streamingContent,
        timestamp: new Date(),
        modelId: selectedModel,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsStreaming(false);

      if (conversationId) {
        try {
          await addMessage({
            conversationId,
            role: 'assistant',
            content: streamingContent,
          });
        } catch (error) {
          console.error('Failed to save assistant message:', error);
        }
      }

      setStreamingContent('');
    });

    socket.on('chat:error', (data: { message: string }) => {
      console.error('Chat error:', data.message);
      setIsStreaming(false);
      setStreamingContent('');
    });

    return () => {
      socket.off('chat:chunk');
      socket.off('chat:done');
      socket.off('chat:error');
      socket.disconnect();
    };
  }, [isAuthenticated, conversationId, streamingContent, selectedModel, addMessage]);

  const handleSend = useCallback(
    async (content: string, file?: AttachedFile | null) => {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
        attachment: file || undefined,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);
      setStreamingContent('');

      if (isAuthenticated) {
        // Authenticated: try DB + Socket.IO, fall back to API layer
        const socket = getSocket();
        let convId = conversationId;

        try {
          if (!convId) {
            const conv = await createConversation({
              modelId: selectedModel,
              title: content.slice(0, 50),
            }).unwrap();
            convId = conv.id;
            setConversationId(conv.id);
          }

          if (convId) {
            await addMessage({
              conversationId: convId,
              role: 'user',
              content,
            });
          }
        } catch (error) {
          console.error('Failed to persist, falling back to stream-only:', error);
        }

        // Check if socket is connected; if not, use API layer
        if (socket.connected) {
          socket.emit('chat', {
            conversationId: convId ?? undefined,
            modelId: selectedModel,
            messages: messages.map((m) => ({ role: m.role, content: m.content })).concat([{ role: 'user', content }]),
          });
        } else {
          // Fallback to API layer (which falls back to mock)
          await streamViaApi(content, convId);
        }
      } else {
        // Guest mode: use API layer (real → mock fallback)
        let guestConvId = conversationId;
        if (!guestConvId) {
          const guestConv = GuestChatStorage.createConversation(selectedModel, content.slice(0, 50));
          guestConvId = guestConv.id;
          setConversationId(guestConv.id);
          GuestChatStorage.setCurrentConversationId(guestConv.id);
        }

        GuestChatStorage.addMessage(guestConvId, 'user', content);
        await streamViaApi(content, guestConvId);
      }
    },
    [selectedModel, conversationId, isAuthenticated, messages, createConversation, addMessage]
  );

  // Shared streaming via the API layer
  const streamViaApi = useCallback(
    async (content: string, convId: string | null) => {
      try {
        const history = messages.map((m) => ({ role: m.role, content: m.content }));
        const stream = streamChatMessage({
          message: content,
          model: selectedModel,
          conversationId: convId || undefined,
          history,
        });

        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse += chunk;
          setStreamingContent(fullResponse);
        }

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date(),
          modelId: selectedModel,
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Save to guest storage if applicable
        if (!isAuthenticated && convId) {
          GuestChatStorage.addMessage(convId, 'assistant', fullResponse);
        }

        setIsStreaming(false);
        setStreamingContent('');
      } catch (error) {
        console.error('Failed to stream response:', error);
        setIsStreaming(false);
        setStreamingContent('');
      }
    },
    [selectedModel, messages, isAuthenticated]
  );

  // Auto-send initial prompt from Redux or query params
  useEffect(() => {
    if (hasAutoSent.current) return;

    const prompt = initialPrompt || searchParams.get('q');
    if (!prompt) return;

    hasAutoSent.current = true;

    if (initialPrompt) {
      const file = attachedFile;
      dispatch(clearInitialPrompt());
      handleSend(prompt, file);
    } else {
      handleSend(prompt);
    }
  }, [initialPrompt, attachedFile, searchParams, handleSend, dispatch]);

  // Quick action handlers
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setStreamingContent('');
    setIsStreaming(false);
    hasAutoSent.current = false;
    if (!isAuthenticated) {
      GuestChatStorage.clearCurrentConversationId();
    }
  }, [isAuthenticated]);

  const handleClearHistory = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setStreamingContent('');
    setIsStreaming(false);
    hasAutoSent.current = false;
    if (!isAuthenticated) {
      GuestChatStorage.clearAll();
      GuestChatStorage.clearCurrentConversationId();
    }
  }, [isAuthenticated]);

  const handleExportChat = useCallback(() => {
    if (messages.length === 0) return;

    const exportData = {
      model: selectedModel,
      exportedAt: new Date().toISOString(),
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
        modelId: m.modelId,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusai-chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages, selectedModel]);

  const handleActionClick = useCallback((title: string) => {
    handleSend(`I'd like to: ${title}`);
  }, [handleSend]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        bgcolor: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* Left: Models Sidebar (reads from Redux + API) */}
      <ModelsSidebar />

      {/* Center: Main chat area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: 'var(--bg)',
          minWidth: 0,
        }}
      >
        {/* Guest Banner */}
        {!isAuthenticated && (
          <Alert
            severity="info"
            sx={{
              borderRadius: 0,
              borderBottom: '1px solid var(--border)',
              '& .MuiAlert-message': {
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <span>{t('chat.guestBanner')}</span>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  href="/login"
                  size="small"
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    borderColor: 'currentColor',
                    color: 'inherit',
                    '&:hover': {
                      borderColor: 'currentColor',
                      bgcolor: 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  {t('chat.signIn')}
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  size="small"
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    bgcolor: '#C8622A',
                    '&:hover': {
                      bgcolor: '#A85324',
                    },
                  }}
                >
                  {t('chat.signUp')}
                </Button>
              </Box>
            </Box>
          </Alert>
        )}

        {/* Message area or Welcome screen */}
        {hasMessages ? (
          <MessageThread
            messages={messages}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            selectedModel={selectedModel}
          />
        ) : (
          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex' }}>
            <WelcomeScreen onActionClick={handleActionClick} />
          </Box>
        )}

        {/* Input at bottom */}
        <ChatInput
          onSend={handleSend}
          isStreaming={isStreaming}
          selectedModel={selectedModel}
        />
      </Box>

      {/* Right: Quick Actions Panel (reads model from Redux) */}
      <QuickActionsPanel
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
        onExportChat={handleExportChat}
      />
    </Box>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatPageContent />
    </Suspense>
  );
}
