import styles from './AiAssistant.module.css';

export default function TypingIndicator() {
  return (
    <div className={styles.typingRow}>
      <div className={styles.avatar}>
        <span className="material-symbols-outlined">smart_toy</span>
      </div>
      <div className={styles.typingContainer}>
        <span className={styles.typingText}>AgenticX AI is thinking</span>
        <div className={styles.dotBubble}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
      </div>
    </div>
  );
}
