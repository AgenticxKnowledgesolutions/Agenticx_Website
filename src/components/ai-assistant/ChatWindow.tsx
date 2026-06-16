import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import QuickActions from './QuickActions';
import type { Message } from './AiAssistant';
import styles from './AiAssistant.module.css';

interface ChatWindowProps {
  isOpen: boolean;
  messages: Message[];
  isTyping: boolean;
  conversationId: string;
  onClose: () => void;
  onSendMessage: (text: string) => void;
}

export default function ChatWindow({
  isOpen,
  messages,
  isTyping,
  conversationId,
  onClose,
  onSendMessage
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  return (
    <div className={styles.chatWindow} role="dialog" aria-label="AgenticX AI Assistant">
      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.headerInfo}>
          <div className={styles.titleRow}>
            <span className={styles.dotOnline}></span>
            <h3 className={styles.headerTitle}>AgenticX AI Assistant</h3>
          </div>
          <p className={styles.headerSubtitle}>Ask about courses, internships, services, or training.</p>
        </div>
        <div className={styles.headerControls}>
          <button
            className={styles.headerBtn}
            onClick={onClose}
            title="Minimize"
            aria-label="Minimize Chat"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <button
            className={styles.headerBtn}
            onClick={onClose}
            title="Close"
            aria-label="Close Chat"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className={styles.chatBody} ref={scrollRef}>
        {messages.map((msg, index) => (
          <div key={msg.id} className={styles.bubbleRow}>
            <MessageBubble message={msg} />

            {/* Render Quick Actions right below the first welcome bot message */}
            {index === 0 && msg.sender === 'bot' && (
              <QuickActions onSelectAction={onSendMessage} />
            )}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input Section */}
      <div className={styles.chatFooter}>
        <ChatInput onSend={onSendMessage} isTyping={isTyping} />
        <div className={styles.footerBranding}>
          <span>Powered by AgenticX RAG Platform</span>
          <span className={styles.convId}>ID: {conversationId.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
