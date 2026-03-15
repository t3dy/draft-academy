import React, { useState } from 'react';
import { Bot, ArrowRightLeft } from 'lucide-react';
import type { AgentRole } from '../data/types';

interface AgentCardProps {
  agent: AgentRole;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const [hovered, setHovered] = useState(false);
  const isDet = agent.deterministic;
  const badgeColor = isDet ? 'var(--green)' : 'var(--accent-light)';
  const badgeBg = isDet ? 'var(--green-dim)' : 'var(--accent-glow)';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? badgeColor : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bot size={18} color={badgeColor} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
            {agent.name}
          </h3>
        </div>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: 12,
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: badgeBg,
            color: badgeColor,
          }}
        >
          {isDet ? 'Deterministic' : 'Probabilistic'}
        </span>
      </div>

      {/* Role description */}
      <p style={{ fontSize: '0.86rem', color: 'var(--text-dim)', lineHeight: 1.5, margin: 0 }}>
        {agent.role}
      </p>

      {/* Inputs / Outputs */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 120 }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: 6,
            }}
          >
            Inputs
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {agent.inputs.map((input) => (
              <span
                key={input}
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: 10,
                  background: 'var(--bg-surface)',
                  color: 'var(--blue)',
                  border: '1px solid var(--border)',
                }}
              >
                {input}
              </span>
            ))}
          </div>
        </div>

        <ArrowRightLeft
          size={14}
          color="var(--text-muted)"
          style={{ marginTop: 20, flexShrink: 0 }}
        />

        <div style={{ flex: 1, minWidth: 120 }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: 6,
            }}
          >
            Outputs
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {agent.outputs.map((output) => (
              <span
                key={output}
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: 10,
                  background: 'var(--bg-surface)',
                  color: 'var(--orange)',
                  border: '1px solid var(--border)',
                }}
              >
                {output}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Example task */}
      <p
        style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          fontStyle: 'italic',
          lineHeight: 1.4,
          margin: 0,
          paddingTop: 4,
          borderTop: '1px solid var(--border)',
        }}
      >
        e.g. {agent.exampleTask}
      </p>
    </div>
  );
};

export default AgentCard;
