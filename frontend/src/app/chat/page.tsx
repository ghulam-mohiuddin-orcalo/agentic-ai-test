'use client';

import { useState, useCallback, useEffect } from 'react';
import { Box, Alert, Button } from '@mui/material';
import Link from 'next/link';
import ModelsSidebar from '@/components/chat/ModelsSidebar';
import QuickActionsPanel from '@/components/chat/QuickActionsPanel';
import WelcomeScreen from '@/components/chat/WelcomeScreen';
import ChatInput from '@/components/chat/ChatInput';
import MessageThread from '@/components/chat/MessageThread';
import { useAuth } from '@/hooks/useAuth';
import { GuestChatStorage } from '@/lib/guestChat';
import { useCreateConversationMutation, useAddMessageMutation } from '@/store/api/chatApi';
import { getSocket } from '@/lib/socket';
import { mockStreamResponse } from '@/lib/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelId?: string;
}

export default function ChatPage() {
  const { isAuthenticated, user } = useAuth();
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [createConversation] = useCreateConversationMutation();
  const [addMessage] = useAddMessageMutation();

  const hasMessages = messages.length > 0 || isStreaming;

  // Load messages on mount
  useEffect(() => {
    if (!isAuthenticated) {
      // Guest mode - load from sessionStorage
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
    // For authenticated users, we'll load conversations from API in a future update
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

      // Save to database
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
    async (content: string) => {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);
      setStreamingContent('');

      if (isAuthenticated) {
        // Authenticated user - use database and Socket.IO
        const socket = getSocket();
        let convId = conversationId;

        try {
          // Create conversation if first message
          if (!convId) {
            const conv = await createConversation({
              modelId: selectedModel,
              title: content.slice(0, 50),
            }).unwrap();
            convId = conv.id;
            setConversationId(conv.id);
          }

          // Best-effort: save user message (but don't block streaming if this fails)
          if (convId) {
            await addMessage({
              conversationId: convId,
              role: 'user',
              content,
            });
          }
        } catch (error) {
          console.error('Failed to persist conversation/message, falling back to stream-only chat:', error);
        }

        // Always attempt to stream a response, even if DB operations failed
        socket.emit('chat', {
          conversationId: convId ?? undefined,
          modelId: selectedModel,
          messages: messages.map((m) => ({ role: m.role, content: m.content })).concat([{ role: 'user', content }]),
        });
      } else {
        // Guest mode - use sessionStorage and mock streaming
        try {
          // Create conversation if first message
          if (!conversationId) {
            const guestConv = GuestChatStorage.createConversation(selectedModel, content.slice(0, 50));
            setConversationId(guestConv.id);
            GuestChatStorage.setCurrentConversationId(guestConv.id);
          }

          // Save user message to sessionStorage
          GuestChatStorage.addMessage(conversationId!, 'user', content);

          // Mock streaming response
          const stream = mockStreamResponse(content);
          let fullResponse = '';

          for await (const chunk of stream) {
            fullResponse += chunk;
            setStreamingContent(fullResponse);
          }

          // Save assistant message
          const assistantMsg: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date(),
            modelId: selectedModel,
          };

          setMessages((prev) => [...prev, assistantMsg]);
          GuestChatStorage.addMessage(conversationId!, 'assistant', fullResponse);
          setIsStreaming(false);
          setStreamingContent('');
        } catch (error) {
          console.error('Failed to send message:', error);
          setIsStreaming(false);
        }
      }
    },
    [selectedModel, conversationId, isAuthenticated, messages, createConversation, addMessage]
  );

  const handleActionClick = useCallback((title: string) => {
    handleSend(`I'd like to: ${title}`);
  }, [handleSend]);

  return (
    <Box
      sx={{
        // Sit directly below the fixed Navbar (64px toolbar height)
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
      {/* Left: Models Sidebar */}
      <ModelsSidebar selectedModel={selectedModel} onSelectModel={setSelectedModel} />

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
              <span>You're chatting as a guest. Sign in to save your conversations.</span>
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
                  Sign in
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
                  Sign up
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

      {/* Right: Quick Actions Panel */}
      <QuickActionsPanel />
    </Box>
  );
}
