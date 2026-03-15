import React from 'react';

/**
 * Renders layer content with basic formatting:
 * - Splits on sentence boundaries to create readable paragraphs
 * - Renders `backtick` content as inline code
 * - Renders content between ``` as code blocks
 */

function splitIntoParagraphs(text: string): string[] {
  // If the text already has double newlines, use those
  if (text.includes('\n\n')) {
    return text.split('\n\n').filter((p) => p.trim());
  }

  // Otherwise, intelligently break long text into paragraphs
  // Split on sentence boundaries where a new topic begins
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
  if (sentences.length <= 3) return [text];

  // Group into paragraphs of 2-4 sentences
  const paragraphs: string[] = [];
  let current = '';
  let sentenceCount = 0;
  const targetSize = Math.max(2, Math.ceil(sentences.length / Math.ceil(sentences.length / 3)));

  for (const sentence of sentences) {
    current += sentence;
    sentenceCount++;
    if (sentenceCount >= targetSize) {
      paragraphs.push(current.trim());
      current = '';
      sentenceCount = 0;
    }
  }
  if (current.trim()) {
    paragraphs.push(current.trim());
  }
  return paragraphs;
}

function renderInlineCode(text: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 3,
            padding: '1px 5px',
            fontSize: '0.88em',
            fontFamily: 'var(--font-mono, "SF Mono", "Fira Code", monospace)',
            color: 'var(--accent-light)',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

interface LayerContentProps {
  content: string;
  layer: string;
}

const LayerContent: React.FC<LayerContentProps> = ({ content, layer }) => {
  if (!content) {
    return (
      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
        No content available for this layer.
      </span>
    );
  }

  const paragraphs = splitIntoParagraphs(content);
  const isTechnical = layer === 'technical' || layer === 'project';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isTechnical ? 16 : 20 }}>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          style={{
            margin: 0,
            lineHeight: 1.8,
            fontSize: '0.95rem',
            color: 'var(--text)',
          }}
        >
          {renderInlineCode(para)}
        </p>
      ))}
    </div>
  );
};

export default LayerContent;
