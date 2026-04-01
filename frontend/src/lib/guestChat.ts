export interface GuestMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface GuestConversation {
  id: string;
  modelId: string;
  title: string;
  messages: GuestMessage[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'nexusai_guest_conversations';

export class GuestChatStorage {
  /**
   * Get all guest conversations from sessionStorage
   */
  static getConversations(): GuestConversation[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading guest conversations:', error);
      return [];
    }
  }

  /**
   * Get a specific conversation by ID
   */
  static getConversation(id: string): GuestConversation | null {
    const conversations = this.getConversations();
    return conversations.find(conv => conv.id === id) || null;
  }

  /**
   * Create a new guest conversation
   */
  static createConversation(modelId: string, title?: string): GuestConversation {
    const conversation: GuestConversation = {
      id: crypto.randomUUID(),
      modelId,
      title: title || 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const conversations = this.getConversations();
    conversations.push(conversation);
    this.saveConversations(conversations);

    return conversation;
  }

  /**
   * Add a message to a conversation
   */
  static addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ): GuestMessage {
    const conversations = this.getConversations();
    const conversation = conversations.find(conv => conv.id === conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const message: GuestMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date().toISOString(),
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date().toISOString();

    // Auto-generate title from first user message
    if (conversation.messages.length === 1 && role === 'user') {
      conversation.title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
    }

    this.saveConversations(conversations);

    return message;
  }

  /**
   * Get messages for a conversation
   */
  static getMessages(conversationId: string): GuestMessage[] {
    const conversation = this.getConversation(conversationId);
    return conversation?.messages || [];
  }

  /**
   * Delete a conversation
   */
  static deleteConversation(id: string): void {
    const conversations = this.getConversations().filter(conv => conv.id !== id);
    this.saveConversations(conversations);
  }

  /**
   * Clear all guest conversations
   */
  static clearAll(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Export conversation as JSON for download
   */
  static exportConversation(id: string): string {
    const conversation = this.getConversation(id);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return JSON.stringify(conversation, null, 2);
  }

  /**
   * Get current conversation ID from sessionStorage
   */
  static getCurrentConversationId(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('nexusai_current_conversation_id');
  }

  /**
   * Set current conversation ID
   */
  static setCurrentConversationId(id: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('nexusai_current_conversation_id', id);
  }

  /**
   * Clear current conversation ID
   */
  static clearCurrentConversationId(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('nexusai_current_conversation_id');
  }

  /**
   * Save conversations to sessionStorage
   */
  private static saveConversations(conversations: GuestConversation[]): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving guest conversations:', error);
    }
  }
}
