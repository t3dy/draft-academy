import React, { useState } from 'react';
import { BookOpen, Puzzle, Lightbulb, Wrench, FlaskConical, GraduationCap, FileText, Box, Map, User } from 'lucide-react';
import type { ContentNode } from '../data/types';

interface LessonCardProps {
  node: ContentNode;
  onClick?: () => void;
}

const difficultyColors: Record<string, { bg: string; color: string }> = {
  beginner: { bg: 'var(--green-dim)', color: 'var(--green)' },
  intermediate: { bg: 'var(--blue-dim)', color: 'var(--blue)' },
  advanced: { bg: 'var(--orange-dim)', color: 'var(--orange)' },
  expert: { bg: 'var(--red-dim)', color: 'var(--red)' },
};

const typeIcons: Record<string, React.ReactNode> = {
  concept: <Lightbulb size={14} />,
  lesson: <BookOpen size={14} />,
  project: <Wrench size={14} />,
  puzzle: <Puzzle size={14} />,
  quiz: <GraduationCap size={14} />,
  theory: <FlaskConical size={14} />,
  example: <FileText size={14} />,
  tool: <Box size={14} />,
  pathway: <Map size={14} />,
  persona: <User size={14} />,
};

const LessonCard: React.FC<LessonCardProps> = ({ node, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const diff = difficultyColors[node.difficulty] || difficultyColors.beginner;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '18px 20px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 32px rgba(108, 92, 231, 0.1)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--accent-light)', display: 'flex', alignItems: 'center' }}>
            {typeIcons[node.type] || <BookOpen size={14} />}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
            }}
          >
            {node.type}
          </span>
        </div>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: 12,
            fontSize: '0.72rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: diff.bg,
            color: diff.color,
          }}
        >
          {node.difficulty}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text)',
          lineHeight: 1.3,
          margin: 0,
        }}
      >
        {node.title}
      </h3>

      {/* Summary */}
      <p
        style={{
          fontSize: '0.84rem',
          color: 'var(--text-dim)',
          lineHeight: 1.5,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {node.summary}
      </p>

      {/* Tags */}
      {node.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
          {node.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: 10,
                background: 'var(--bg-surface)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
            >
              {tag}
            </span>
          ))}
          {node.tags.length > 5 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '2px 4px' }}>
              +{node.tags.length - 5}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonCard;
