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
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearInitialPrompt, type AttachedFile } from '@/store/slices/chatSlice';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelId?: string;
  attachments?: AttachedFile[];
}

function describeAttachmentsForTransport(attachments?: AttachedFile[]) {
  if (!attachments?.length) {
    return '';
  }

  return attachments
    .map((attachment) => {
      switch (attachment.kind) {
        case 'audio':
          return 'Voice note';
        case 'image':
          return `Image: ${attachment.name}`;
        case 'screen':
          return 'Screen recording';
        case 'video':
          return 'Video message';
        default:
          return `File: ${attachment.name}`;
      }
    })
    .join(', ');
}

function getConversationTitle(content: string, attachments?: AttachedFile[]) {
  const trimmed = content.trim();
  if (trimmed) {
    return trimmed.slice(0, 50);
  }

  return attachments?.[0]?.name || describeAttachmentsForTransport(attachments) || 'New chat';
}

function getHistory(messages: Message[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content.trim() || describeAttachmentsForTransport(message.attachments),
  }));
}

function ChatPageContent() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const initialPrompt = useAppSelector((state) => state.chat.initialPrompt);
  const attachedFiles = useAppSelector((state) => state.chat.attachedFiles);
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
  const conversationIdRef = useRef<string | null>(null);

  const hasMessages = messages.length > 0 || isStreaming;

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    const guestConvId = GuestChatStorage.getCurrentConversationId();
    if (!guestConvId) {
      return;
    }

    const guestMessages = GuestChatStorage.getMessages(guestConvId);
    setMessages(
      guestMessages
        .filter((message) => message.role !== 'system')
        .map((message) => ({
          id: message.id,
          role: message.role as 'user' | 'assistant',
          content: message.content,
          timestamp: new Date(message.timestamp),
          attachments:
            message.attachments ??
            ('attachment' in message && message.attachment
              ? [message.attachment as AttachedFile]
              : undefined),
        }))
    );
    setConversationId(guestConvId);
  }, [isAuthenticated]);

  const ensureConversation = useCallback(
    async (title: string) => {
      if (conversationIdRef.current) {
        return conversationIdRef.current;
      }

      if (isAuthenticated) {
        const conversation = await createConversation({
          modelId: selectedModel,
          title,
        }).unwrap();

        conversationIdRef.current = conversation.id;
        setConversationId(conversation.id);
        return conversation.id;
      }

      const guestConversation = GuestChatStorage.createConversation(selectedModel, title);
      GuestChatStorage.setCurrentConversationId(guestConversation.id);
      conversationIdRef.current = guestConversation.id;
      setConversationId(guestConversation.id);
      return guestConversation.id;
    },
    [createConversation, isAuthenticated, selectedModel]
  );

  const persistAssistantMessage = useCallback(
    async (convId: string | null, content: string) => {
      if (!convId || !content.trim()) {
        return;
      }

      if (!isAuthenticated) {
        GuestChatStorage.addMessage(convId, 'assistant', content);
        return;
      }

      try {
        await addMessage({
          conversationId: convId,
          role: 'assistant',
          content,
        });
      } catch (error) {
        console.error('Failed to persist assistant message:', error);
      }
    },
    [addMessage, isAuthenticated]
  );

  const streamViaApi = useCallback(
    async (transportText: string, convId: string | null) => {
      const abortController = new AbortController();
      streamAbortRef.current = abortController;

      try {
        const stream = streamChatMessage({
          message: transportText,
          model: selectedModel,
          conversationId: convId || undefined,
          history: getHistory(messagesRef.current),
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

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date(),
          modelId: selectedModel,
        };

        setMessages((previous) => [...previous, assistantMessage]);
        await persistAssistantMessage(convId, fullResponse);
        setIsStreaming(false);
        setStreamingContent('');
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Failed to stream response:', error);
        }
        setIsStreaming(false);
      } finally {
        setStreamingContent('');
        streamAbortRef.current = null;
      }
    },
    [persistAssistantMessage, selectedModel]
  );

  const handleSend = useCallback(
    async (content: string, nextAttachments: AttachedFile[] = []) => {
      if (isStreaming) {
        return;
      }

      const trimmed = content.trim();
      const attachments = nextAttachments.filter(Boolean);
      if (!trimmed && attachments.length === 0) {
        return;
      }

      const transportText = trimmed || describeAttachmentsForTransport(attachments);
      const conversationTitle = getConversationTitle(content, attachments);

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
        attachments: attachments.length ? attachments : undefined,
      };

      setMessages((previous) => [...previous, userMessage]);
      setIsStreaming(true);
      setStreamingContent('');

      let convId: string | null = null;

      try {
        convId = await ensureConversation(conversationTitle);

        if (isAuthenticated) {
          await addMessage({
            conversationId: convId,
            role: 'user',
            content: transportText,
            attachments: attachments.length ? attachments : undefined,
          });
        } else {
          GuestChatStorage.addMessage(convId, 'user', trimmed, attachments.length ? attachments : undefined);
        }
      } catch (error) {
        console.error('Failed to persist user message before streaming:', error);
      }

      await streamViaApi(transportText, convId);
    },
    [addMessage, ensureConversation, isAuthenticated, isStreaming, streamViaApi]
  );

  const handlePauseStreaming = useCallback(() => {
    streamAbortRef.current?.abort();

    const partial = streamingContent.trim();
    if (!partial) {
      setIsStreaming(false);
      setStreamingContent('');
      return;
    }

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: partial,
      timestamp: new Date(),
      modelId: selectedModel,
    };

    setMessages((previous) => [...previous, assistantMessage]);
    void persistAssistantMessage(conversationIdRef.current, partial);
    setIsStreaming(false);
    setStreamingContent('');
  }, [persistAssistantMessage, selectedModel, streamingContent]);

  useEffect(() => {
    if (hasAutoSent.current) {
      return;
    }

    const prompt = initialPrompt ?? searchParams.get('q');
    if (!prompt && attachedFiles.length === 0) {
      return;
    }

    hasAutoSent.current = true;
    dispatch(clearInitialPrompt());
    void handleSend(prompt ?? '', attachedFiles);
  }, [attachedFiles, dispatch, handleSend, initialPrompt, searchParams]);

  const handleNewChat = useCallback(() => {
    streamAbortRef.current?.abort();
    setMessages([]);
    setConversationId(null);
    conversationIdRef.current = null;
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
    conversationIdRef.current = null;
    setStreamingContent('');
    setIsStreaming(false);
    hasAutoSent.current = false;
    if (!isAuthenticated) {
      GuestChatStorage.clearAll();
      GuestChatStorage.clearCurrentConversationId();
    }
  }, [isAuthenticated]);

  const handleExportChat = useCallback(() => {
    if (messages.length === 0) {
      return;
    }

    const exportData = {
      model: selectedModel,
      exportedAt: new Date().toISOString(),
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content,
        timestamp: message.timestamp.toISOString(),
        modelId: message.modelId,
        attachments: message.attachments,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `nexusai-chat-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [messages, selectedModel]);

  const handleActionClick = useCallback(
    (title: string) => {
      void handleSend(`I'd like to: ${title}`);
    },
    [handleSend]
  );

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
          />
        ) : (
          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex' }}>
            <WelcomeScreen onActionClick={handleActionClick} />
          </Box>
        )}

        <ChatInput onSend={handleSend} onPause={handlePauseStreaming} isStreaming={isStreaming} selectedModel={selectedModel} />
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
