import React, { useState } from 'react';
import { ChevronRight, Route, BookOpen } from 'lucide-react';
import type { Pathway } from '../data/types';

interface PathwayCardProps {
  pathway: Pathway;
  nodeCount: number;
  onClick?: () => void;
}

const difficultyColors: Record<string, { bg: string; color: string }> = {
  beginner: { bg: 'var(--green-dim)', color: 'var(--green)' },
  intermediate: { bg: 'var(--blue-dim)', color: 'var(--blue)' },
  advanced: { bg: 'var(--orange-dim)', color: 'var(--orange)' },
  expert: { bg: 'var(--red-dim)', color: 'var(--red)' },
};

const personaLabels: Record<string, string> = {
  'curious-beginner': 'Curious Beginner',
  'data-scientist': 'Data Scientist',
  developer: 'Developer',
  'mtg-player': 'MTG Player',
  educator: 'Educator',
};

const PathwayCard: React.FC<PathwayCardProps> = ({ pathway, nodeCount, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const diff = difficultyColors[pathway.difficulty] || difficultyColors.beginner;

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
        padding: '20px 22px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 32px rgba(108, 92, 231, 0.1)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
      }}
    >
      {/* Header with icon and badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Route size={18} color="var(--accent-light)" />
          <span
            style={{
              display: 'inline-block',
              padding: '2px 10px',
              borderRadius: 12,
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: 'var(--accent-glow)',
              color: 'var(--accent-light)',
            }}
          >
            {personaLabels[pathway.persona] || pathway.persona}
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
          {pathway.difficulty}
        </span>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', margin: 0, lineHeight: 1.3 }}>
        {pathway.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.84rem',
          color: 'var(--text-dim)',
          lineHeight: 1.5,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {pathway.description}
      </p>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: 8,
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <BookOpen size={14} />
          <span>
            {nodeCount} {nodeCount === 1 ? 'lesson' : 'lessons'}
          </span>
        </div>
        <ChevronRight
          size={18}
          color="var(--accent-light)"
          style={{
            transition: 'transform 0.2s',
            transform: hovered ? 'translateX(3px)' : 'translateX(0)',
          }}
        />
      </div>
    </div>
  );
};

export default PathwayCard;
