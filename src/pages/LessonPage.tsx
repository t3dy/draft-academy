import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock, Unlock, Tag, Eye } from 'lucide-react';
import { contentNodes, pathways } from '../data/content';
import type { Layer } from '../data/types';
import LayerTabs from '../components/LayerTabs';
import LayerContent from '../components/LayerContent';
import QuizCard from '../components/QuizCard';

const allLayers: Layer[] = ['intuition', 'system', 'technical', 'project', 'theory'];

const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const pathwayId = searchParams.get('pathway');
  const node = contentNodes.find((n) => n.id === id);
  const [activeLayer, setActiveLayer] = useState<Layer>('intuition');

  // Pathway navigation context
  const currentPathway = pathwayId ? pathways.find((p) => p.id === pathwayId) : null;
  const pathwayIndex = currentPathway ? currentPathway.nodeIds.indexOf(id || '') : -1;
  const prevNodeId = currentPathway && pathwayIndex > 0 ? currentPathway.nodeIds[pathwayIndex - 1] : null;
  const nextNodeId = currentPathway && pathwayIndex >= 0 && pathwayIndex < currentPathway.nodeIds.length - 1
    ? currentPathway.nodeIds[pathwayIndex + 1] : null;
  const prevNode = prevNodeId ? contentNodes.find((n) => n.id === prevNodeId) : null;
  const nextNode = nextNodeId ? contentNodes.find((n) => n.id === nextNodeId) : null;

  if (!node) {
    return (
      <div className="container fade-in" style={{ paddingTop: 80, textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16 }}>Not Found</h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>
          No lesson found with id "{id}".
        </p>
        <Link
          to="/browse"
          style={{
            color: 'var(--accent-light)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <ArrowLeft size={16} /> Back to Browse
        </Link>
      </div>
    );
  }

  const availableLayers = allLayers.filter((l) => node.layers[l]);
  const currentContent = node.layers[activeLayer] || '';

  const prereqNodes = node.prerequisites
    .map((pid) => contentNodes.find((n) => n.id === pid))
    .filter(Boolean);

  const unlockNodes = (node.unlocks || [])
    .map((uid) => contentNodes.find((n) => n.id === uid))
    .filter(Boolean);

  const relatedNodes = node.relatedNodes
    .map((rid) => contentNodes.find((n) => n.id === rid))
    .filter(Boolean);

  return (
    <div className="container fade-in" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <Link
        to="/browse"
        style={{
          color: 'var(--text-muted)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.85rem',
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={14} /> All Lessons
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {node.title}
          </h1>
          <span className={`badge badge-${node.difficulty}`}>{node.difficulty}</span>
          <span
            className="badge"
            style={{
              background: 'var(--bg-surface)',
              color: 'var(--text-dim)',
              border: '1px solid var(--border)',
            }}
          >
            {node.type}
          </span>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.7 }}>
          {node.summary}
        </p>
      </div>

      {/* Tags */}
      {node.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          <Tag size={14} style={{ color: 'var(--text-muted)', marginTop: 3 }} />
          {node.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: '3px 10px',
                borderRadius: 12,
                background: 'var(--bg-surface)',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                border: '1px solid var(--border)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Prerequisites */}
      {prereqNodes.length > 0 && (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px 18px',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
              color: 'var(--orange)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <Lock size={14} /> Prerequisites
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {prereqNodes.map(
              (pn) =>
                pn && (
                  <Link
                    key={pn.id}
                    to={`/lesson/${pn.id}`}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--orange-dim)',
                      color: 'var(--orange)',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {pn.title}
                  </Link>
                )
            )}
          </div>
        </div>
      )}

      {/* Pathway Navigation (top) */}
      {currentPathway && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
            padding: '10px 16px',
            background: 'var(--accent-glow)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
          }}
        >
          <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>
            {currentPathway.title}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            — Lesson {pathwayIndex + 1} of {currentPathway.nodeIds.length}
          </span>
        </div>
      )}

      {/* Layer Tabs + Content */}
      <div style={{ marginBottom: 32 }}>
        <LayerTabs
          layers={availableLayers}
          activeLayer={activeLayer}
          onLayerChange={setActiveLayer}
        />
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '28px 24px',
          }}
        >
          <LayerContent content={currentContent} layer={activeLayer} />
        </div>
      </div>

      {/* Visual Callout */}
      {node.visual && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '14px 18px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderLeft: '3px solid var(--accent)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 24,
          }}
        >
          <Eye size={16} style={{ color: 'var(--accent-light)', marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-light)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Suggested {node.visual.type}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.6, margin: 0 }}>
              {node.visual.description}
            </p>
          </div>
        </div>
      )}

      {/* Quiz */}
      {node.quizItems && node.quizItems.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: 16,
              color: 'var(--text)',
            }}
          >
            Check Your Understanding
          </h2>
          <QuizCard items={node.quizItems} />
        </div>
      )}

      {/* Unlocks */}
      {unlockNodes.length > 0 && (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px 18px',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
              color: 'var(--green)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <Unlock size={14} /> This Lesson Unlocks
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {unlockNodes.map(
              (un) =>
                un && (
                  <Link
                    key={un.id}
                    to={`/lesson/${un.id}`}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--green-dim)',
                      color: 'var(--green)',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    {un.title}
                  </Link>
                )
            )}
          </div>
        </div>
      )}

      {/* Related Nodes */}
      {relatedNodes.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              marginBottom: 14,
              color: 'var(--text)',
            }}
          >
            Related Concepts
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {relatedNodes.map(
              (rn) =>
                rn && (
                  <Link
                    key={rn.id}
                    to={`/lesson/${rn.id}`}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--accent-light)',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.background = 'var(--accent-glow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--bg-card)';
                    }}
                  >
                    {rn.title}
                  </Link>
                )
            )}
          </div>
        </div>
      )}

      {/* Pathway Navigation (bottom) */}
      {currentPathway && (prevNode || nextNode) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 32,
            paddingTop: 24,
            borderTop: '1px solid var(--border)',
          }}
        >
          {prevNode ? (
            <Link
              to={`/lesson/${prevNode.id}?pathway=${currentPathway.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--accent-light)',
                fontSize: '0.88rem',
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={16} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Previous</div>
                <div style={{ fontWeight: 600 }}>{prevNode.title}</div>
              </div>
            </Link>
          ) : <div />}
          {nextNode ? (
            <Link
              to={`/lesson/${nextNode.id}?pathway=${currentPathway.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--accent-light)',
                fontSize: '0.88rem',
                textDecoration: 'none',
                textAlign: 'right',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Next</div>
                <div style={{ fontWeight: 600 }}>{nextNode.title}</div>
              </div>
              <ArrowRight size={16} />
            </Link>
          ) : <div />}
        </div>
      )}
    </div>
  );
};

export default LessonPage;
