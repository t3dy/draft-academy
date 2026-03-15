import React, { useState } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import type { PipelineStage } from '../data/types';

interface PipelineDiagramProps {
  stages: PipelineStage[];
  activeStage?: string;
  onStageClick?: (stageId: string) => void;
}

const PipelineDiagram: React.FC<PipelineDiagramProps> = ({ stages, activeStage, onStageClick }) => {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  return (
    <>
      {/* Desktop: horizontal */}
      <div
        className="pipeline-desktop"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          overflowX: 'auto',
          padding: '8px 0',
        }}
      >
        {stages.map((stage, i) => {
          const isActive = activeStage === stage.id;
          const isHovered = hoveredStage === stage.id;
          const isDeterministic = stage.deterministic;
          const stageColor = isDeterministic ? 'var(--green)' : 'var(--accent-light)';
          const stageBg = isDeterministic ? 'var(--green-dim)' : 'var(--accent-glow)';

          return (
            <React.Fragment key={stage.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => onStageClick?.(stage.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onStageClick?.(stage.id); }}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '14px 18px',
                  borderRadius: 'var(--radius)',
                  border: `1px solid ${isActive ? stageColor : isHovered ? 'var(--text-muted)' : 'var(--border)'}`,
                  background: isActive ? stageBg : 'var(--bg-card)',
                  cursor: onStageClick ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  minWidth: 110,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: stageColor,
                    opacity: 0.8,
                  }}
                >
                  {isDeterministic ? 'DET' : 'PROB'}
                </span>
                <span
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: isActive ? stageColor : 'var(--text)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {stage.name}
                </span>
              </div>
              {i < stages.length - 1 && (
                <div style={{ padding: '0 4px', color: 'var(--text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <ArrowRight size={16} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div
        className="pipeline-mobile"
        style={{
          display: 'none',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          padding: '8px 0',
        }}
      >
        {stages.map((stage, i) => {
          const isActive = activeStage === stage.id;
          const isHovered = hoveredStage === stage.id;
          const isDeterministic = stage.deterministic;
          const stageColor = isDeterministic ? 'var(--green)' : 'var(--accent-light)';
          const stageBg = isDeterministic ? 'var(--green-dim)' : 'var(--accent-glow)';

          return (
            <React.Fragment key={stage.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => onStageClick?.(stage.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onStageClick?.(stage.id); }}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 18px',
                  borderRadius: 'var(--radius)',
                  border: `1px solid ${isActive ? stageColor : isHovered ? 'var(--text-muted)' : 'var(--border)'}`,
                  background: isActive ? stageBg : 'var(--bg-card)',
                  cursor: onStageClick ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  width: '100%',
                  maxWidth: 320,
                }}
              >
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: stageColor,
                    opacity: 0.8,
                    minWidth: 32,
                  }}
                >
                  {isDeterministic ? 'DET' : 'PROB'}
                </span>
                <span
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: isActive ? stageColor : 'var(--text)',
                  }}
                >
                  {stage.name}
                </span>
              </div>
              {i < stages.length - 1 && (
                <div style={{ padding: '4px 0', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <ArrowDown size={16} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pipeline-desktop { display: none !important; }
          .pipeline-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default PipelineDiagram;
