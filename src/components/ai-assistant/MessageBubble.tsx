import type { Message } from './AiAssistant';
import styles from './AiAssistant.module.css';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.sender === 'bot';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const parseMessageText = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      let content = line;
      // Bold: **text** -> <strong>text</strong>
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Links: [text](url) -> <a href="url">text</a>
      content = content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="chat-link">$1</a>');

      if (line.startsWith('• ')) {
        const itemContent = content.substring(2);
        currentList.push(
          <li key={`li-${i}`} dangerouslySetInnerHTML={{ __html: itemContent }} />
        );
      } else {
        // If we were building a list, push it now
        if (currentList.length > 0) {
          elements.push(<ul key={`ul-${i}`} className={styles.msgList}>{...currentList}</ul>);
          currentList = [];
        }

        if (line.trim() === '') {
          elements.push(<div key={`space-${i}`} className={styles.msgLineBreak} />);
        } else {
          elements.push(
            <p key={`p-${i}`} className={styles.msgPara} dangerouslySetInnerHTML={{ __html: content }} />
          );
        }
      }
    });

    // Handle any trailing list items
    if (currentList.length > 0) {
      elements.push(<ul key="ul-trailing" className={styles.msgList}>{...currentList}</ul>);
    }

    return elements;
  };

  return (
    <div className={`${styles.bubbleContainer} ${isBot ? styles.botAlign : styles.userAlign}`}>
      {/* Bot Avatar */}
      {isBot && (
        <div className={styles.avatar}>
          <span className="material-symbols-outlined">smart_toy</span>
        </div>
      )}

      {/* Bubble Details */}
      <div className={styles.bubbleWrapper}>
        <div className={`${styles.bubble} ${isBot ? styles.botBubble : styles.userBubble}`}>
          {parseMessageText(message.text)}
        </div>
        <span className={styles.timestamp}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
