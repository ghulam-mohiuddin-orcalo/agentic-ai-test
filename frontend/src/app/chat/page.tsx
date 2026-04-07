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
import { consumePendingVoiceMessage, peekPendingVoiceMessage } from '@/lib/pendingVoiceMessage';
import { useCreateConversationMutation, useAddMessageMutation } from '@/store/api/chatApi';
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
  const streamAbortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>([]);

  const hasMessages = messages.length > 0 || isStreaming;

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (peekPendingVoiceMessage()) {
        return;
      }

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
              attachment: msg.attachment,
            }))
        );
        setConversationId(guestConvId);
      }
    }
  }, [isAuthenticated]);

  const streamViaApi = useCallback(
    async (content: string, convId: string | null) => {
      const abortController = new AbortController();
      streamAbortRef.current = abortController;

      try {
        const history = messagesRef.current.map((m) => ({ role: m.role, content: m.content }));
        const stream = streamChatMessage({
          message: content,
          model: selectedModel,
          conversationId: convId || undefined,
          history,
          signal: abortController.signal,
        });

        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse += chunk;
          setStreamingContent(fullResponse);
        }

        if (!fullResponse.trim()) {
          setIsStreaming(false);
          setStreamingContent('');
          streamAbortRef.current = null;
          return;
        }

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date(),
          modelId: selectedModel,
        };

        setMessages((prev) => [...prev, assistantMsg]);

        if (convId) {
          if (!isAuthenticated) {
            GuestChatStorage.addMessage(convId, 'assistant', fullResponse);
          } else {
            try {
              await addMessage({
                conversationId: convId,
                role: 'assistant',
                content: fullResponse,
              });
            } catch (error) {
              console.error('Failed to save assistant message:', error);
            }
          }
        }

        setIsStreaming(false);
        setStreamingContent('');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        console.error('Failed to stream response:', error);
        setIsStreaming(false);
        setStreamingContent('');
      } finally {
        streamAbortRef.current = null;
      }
    },
    [selectedModel, isAuthenticated, addMessage]
  );

  const handleSend = useCallback(
    async (content: string, file?: AttachedFile | null) => {
      const normalizedContent = content.trim();
      const isVoiceMessage = file?.source === 'voice';
      const isVideoMessage = file?.type.startsWith('video/') ?? false;
      const displayText = normalizedContent || (isVoiceMessage || isVideoMessage ? '' : content);
      const transportText =
        normalizedContent ||
        (isVideoMessage ? 'Video message' : isVoiceMessage ? 'Voice message' : content);
      const conversationTitle = normalizedContent || file?.name || (isVideoMessage ? 'Video message' : 'Voice message');

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: displayText,
        timestamp: new Date(),
        attachment: file || undefined,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);
      setStreamingContent('');

      if (isAuthenticated) {
        let convId = conversationId;

        try {
          if (!convId) {
            const conv = await createConversation({
              modelId: selectedModel,
              title: conversationTitle.slice(0, 50),
            }).unwrap();
            convId = conv.id;
            setConversationId(conv.id);
          }

          if (convId) {
            await addMessage({
              conversationId: convId,
              role: 'user',
              content: transportText,
              attachments: file ? [file] : undefined,
            });
          }
        } catch (error) {
          console.error('Failed to persist, falling back to stream-only:', error);
        }

        await streamViaApi(transportText, convId);
      } else {
        let guestConvId = conversationId;
        if (!guestConvId) {
          const guestConv = GuestChatStorage.createConversation(selectedModel, conversationTitle.slice(0, 50));
          guestConvId = guestConv.id;
          setConversationId(guestConv.id);
          GuestChatStorage.setCurrentConversationId(guestConv.id);
        }

        GuestChatStorage.addMessage(guestConvId, 'user', displayText, file || undefined);
        await streamViaApi(transportText, guestConvId);
      }
    },
    [selectedModel, conversationId, isAuthenticated, createConversation, addMessage, streamViaApi]
  );

  const handlePauseStreaming = useCallback(() => {
    streamAbortRef.current?.abort();

    setMessages((prev) => {
      if (!streamingContent.trim()) {
        return prev;
      }

      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: streamingContent,
          timestamp: new Date(),
          modelId: selectedModel,
        },
      ];
    });

    setIsStreaming(false);
    setStreamingContent('');
  }, [selectedModel, streamingContent]);

  useEffect(() => {
    if (hasAutoSent.current) {
      return;
    }

    const pendingVoiceMessage = consumePendingVoiceMessage();
    if (!pendingVoiceMessage) {
      return;
    }

    const sendPendingVoiceMessage = async () => {
      try {
        const userMsg: Message = {
          id: crypto.randomUUID(),
          role: 'user',
          content: '',
          timestamp: new Date(),
          attachment: pendingVoiceMessage,
        };

        hasAutoSent.current = true;
        dispatch(clearInitialPrompt());

        setMessages((prev) => [...prev, userMsg]);
        setIsStreaming(true);
        setStreamingContent('');

        const conversationTitle = pendingVoiceMessage.name || 'Voice message';
        const transportText = 'Voice message';

        if (isAuthenticated) {
          let convId = conversationId;

          try {
            if (!convId) {
              const conv = await createConversation({
                modelId: selectedModel,
                title: conversationTitle.slice(0, 50),
              }).unwrap();
              convId = conv.id;
              setConversationId(conv.id);
            }

            if (convId) {
              await addMessage({
                conversationId: convId,
                role: 'user',
                content: transportText,
                attachments: [pendingVoiceMessage],
              });
            }
          } catch (error) {
            console.error('Failed to persist pending voice message:', error);
          }

          await streamViaApi(transportText, convId);
          return;
        }

        let guestConvId = conversationId;
        if (!guestConvId) {
          const guestConv = GuestChatStorage.createConversation(selectedModel, conversationTitle.slice(0, 50));
          guestConvId = guestConv.id;
          setConversationId(guestConv.id);
          GuestChatStorage.setCurrentConversationId(guestConv.id);
        }

        GuestChatStorage.addMessage(guestConvId, 'user', '', pendingVoiceMessage);
        await streamViaApi(transportText, guestConvId);
      } catch (error) {
        console.error('Failed to send pending voice message:', error);
        setIsStreaming(false);
        setStreamingContent('');
      }
    };

    void sendPendingVoiceMessage();
  }, [addMessage, conversationId, createConversation, dispatch, isAuthenticated, selectedModel, streamViaApi]);

  useEffect(() => {
    if (hasAutoSent.current || peekPendingVoiceMessage()) return;

    const prompt = initialPrompt ?? searchParams.get('q');
    if (!prompt && !attachedFile) return;

    hasAutoSent.current = true;

    if (initialPrompt || attachedFile) {
      const file = attachedFile;
      dispatch(clearInitialPrompt());
      handleSend(prompt ?? '', file);
    } else if (prompt) {
      handleSend(prompt);
    }
  }, [initialPrompt, attachedFile, searchParams, handleSend, dispatch]);

  const handleNewChat = useCallback(() => {
    streamAbortRef.current?.abort();
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
    streamAbortRef.current?.abort();
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

  const handleRegenerate = useCallback(
    (messageId: string) => {
      const idx = messages.findIndex((m) => m.id === messageId);
      if (idx < 0) return;

      // Find the user message before this assistant message
      let userContent = '';
      for (let i = idx - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
          userContent = messages[i].content;
          break;
        }
      }
      if (!userContent) return;

      // Remove the assistant message and re-stream
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setIsStreaming(true);
      setStreamingContent('');
      streamViaApi(userContent, conversationId);
    },
    [messages, conversationId, streamViaApi]
  );

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
      <ModelsSidebar />

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

        {hasMessages ? (
          <MessageThread
            messages={messages}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            selectedModel={selectedModel}
            onRegenerate={handleRegenerate}
          />
        ) : (
          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex' }}>
            <WelcomeScreen onActionClick={handleActionClick} />
          </Box>
        )}

        <ChatInput
          onSend={handleSend}
          onPause={handlePauseStreaming}
          isStreaming={isStreaming}
          selectedModel={selectedModel}
        />
      </Box>

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
