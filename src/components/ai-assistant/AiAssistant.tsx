import { useState, useEffect, useCallback } from 'react';
import ChatWindow from './ChatWindow';
import { getResponse } from './mockResponses';
import styles from './AiAssistant.module.css';

export interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId] = useState(() => `conv_${Math.random().toString(36).substr(2, 9)}`);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: `👋 Welcome to AgenticX.

I'm your AI Assistant.

I can help you explore:
• Courses
• Internships
• Software Development Services
• AI Solutions
• Corporate Training
• Demo Bookings

How can I help you today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  // Handle ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // Append user message
    const userMsg: Message = {
      id: `msg_${Math.random().toString(36).substr(2, 9)}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate RAG AI API call
    const delay = 800 + Math.random() * 400; // 800-1200ms
    setTimeout(() => {
      const botResponseText = getResponse(text);
      const botMsg: Message = {
        id: `msg_${Math.random().toString(36).substr(2, 9)}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  }, []);

  // Listen to global open-ai-assistant custom events
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      setIsOpen(true);
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.message) {
        handleSendMessage(customEvent.detail.message);
      }
    };

    window.addEventListener('open-ai-assistant', handleOpenChat);
    return () => {
      window.removeEventListener('open-ai-assistant', handleOpenChat);
    };
  }, [handleSendMessage]);

  return (
    <div className={styles.assistantRoot}>
      {/* Floating Trigger Button */}
      <button
        className={`${styles.triggerFab} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
      >
        <span className={`material-symbols-outlined ${styles.fabIcon} animate-pulse`}>smart_toy</span>
        <span className={styles.triggerPulse}></span>

        {/* Hover Tooltip */}
        <div className={styles.fabTooltip}>
          <div className={styles.tooltipTitle}>AgenticX AI</div>
          <div className={styles.tooltipDesc}>Active Session: How can I help with your career track today?</div>
          <div className={styles.tooltipAction}>New Chat</div>
        </div>
      </button>

      {/* Chat Window Panel */}
      <ChatWindow
        isOpen={isOpen}
        messages={messages}
        isTyping={isTyping}
        conversationId={conversationId}
        onClose={() => setIsOpen(false)}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
