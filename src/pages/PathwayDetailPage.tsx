import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { pathways, contentNodes } from '../data/content';

const PathwayDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pathway = pathways.find((p) => p.id === id);

  if (!pathway) {
    return (
      <div className="container fade-in" style={{ paddingTop: 80, textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16 }}>Not Found</h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>
          No pathway found with id "{id}".
        </p>
        <Link
          to="/pathways"
          style={{
            color: 'var(--accent-light)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <ArrowLeft size={16} /> Back to Pathways
        </Link>
      </div>
    );
  }

  const lessonNodes = pathway.nodeIds
    .map((nid) => contentNodes.find((n) => n.id === nid))
    .filter(Boolean);

  return (
    <div className="container fade-in" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <Link
        to="/pathways"
        style={{
          color: 'var(--text-muted)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.85rem',
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={14} /> All Pathways
      </Link>

      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {pathway.title}
          </h1>
          <span className={`badge badge-${pathway.difficulty}`}>{pathway.difficulty}</span>
        </div>
        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '0.95rem',
            lineHeight: 1.7,
            maxWidth: 720,
          }}
        >
          {pathway.description}
        </p>
        <div
          style={{
            marginTop: 12,
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          {lessonNodes.length} lessons in this pathway
        </div>
      </div>

      {/* Lesson Progression */}
      <div style={{ position: 'relative' }}>
        {lessonNodes.map((node, i) => {
          if (!node) return null;
          const isLast = i === lessonNodes.length - 1;

          return (
            <div key={node.id} style={{ display: 'flex', gap: 20, position: 'relative' }}>
              {/* Vertical line + number */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                  width: 40,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--accent-glow)',
                    border: '2px solid var(--accent)',
                    color: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                >
                  {i + 1}
                </div>
                {!isLast && (
                  <div
                    style={{
                      width: 2,
                      flexGrow: 1,
                      background: 'var(--border)',
                      minHeight: 20,
                    }}
                  />
                )}
              </div>

              {/* Lesson Card */}
              <Link
                to={`/lesson/${node.id}?pathway=${pathway.id}`}
                style={{
                  textDecoration: 'none',
                  flexGrow: 1,
                  marginBottom: isLast ? 0 : 8,
                }}
              >
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '18px 20px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 6,
                        flexWrap: 'wrap',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--text)',
                        }}
                      >
                        {node.title}
                      </h3>
                      <span className={`badge badge-${node.difficulty}`}>
                        {node.difficulty}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-dim)',
                        lineHeight: 1.6,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {node.summary}
                    </p>
                  </div>
                  <ChevronRight
                    size={18}
                    style={{ color: 'var(--text-muted)', flexShrink: 0 }}
                  />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PathwayDetailPage;
