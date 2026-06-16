import styles from './AiAssistant.module.css';

interface QuickActionsProps {
  onSelectAction: (actionText: string) => void;
}

export default function QuickActions({ onSelectAction }: QuickActionsProps) {
  const actions = [
    { label: 'Explore Courses', text: 'Tell me about Explore Courses' },
    { label: 'Internships', text: 'Tell me about Internships' },
    { label: 'AI Solutions', text: 'Tell me about AI Solutions' },
    { label: 'Corporate Training', text: 'Tell me about Corporate Training' },
    { label: 'Book Demo', text: 'How do I Book Demo?' },
    { label: 'Contact Us', text: 'How do I Contact Us?' }
  ];

  return (
    <div className={styles.quickActionsContainer}>
      <p className={styles.quickActionsHint}>Suggested actions:</p>
      <div className={styles.chipsWrapper}>
        {actions.map((act, i) => (
          <button
            key={i}
            className={styles.actionChip}
            onClick={() => onSelectAction(act.text)}
            type="button"
          >
            {act.label}
          </button>
        ))}
      </div>
    </div>
  );
}
