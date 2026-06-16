import React, { useState, useRef, useEffect } from 'react';
import styles from './AiAssistant.module.css';

interface ChatInputProps {
  onSend: (text: string) => void;
  isTyping: boolean;
}

export default function ChatInput({ onSend, isTyping }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow height on value change
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to compute scrollHeight accurately
    textarea.style.height = 'auto';
    
    // Set to scrollHeight up to max 120px
    const newHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = `${newHeight}px`;
  }, [inputValue]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    onSend(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form className={styles.inputForm} onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        rows={1}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isTyping ? "AgenticX AI is typing..." : "Type your question..."}
        disabled={isTyping}
        className={styles.textarea}
        aria-label="Write a message"
      />
      <button 
        type="submit" 
        disabled={!inputValue.trim() || isTyping}
        className={styles.sendBtn}
        aria-label="Send message"
      >
        <span className="material-symbols-outlined">send</span>
      </button>
    </form>
  );
}
