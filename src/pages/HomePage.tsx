import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, BarChart3, Layers, ArrowRight } from 'lucide-react';
import { contentNodes, pipelineStages } from '../data/content';
import LessonCard from '../components/LessonCard';
import PipelineDiagram from '../components/PipelineDiagram';

const layers = [
  { name: 'Intuition', description: 'Everyday analogies that build understanding before formalism. No jargon, no code.' },
  { name: 'System', description: 'How components fit together — data flows, architectural decisions, and integration points.' },
  { name: 'Technical', description: 'Code-level implementation: algorithms, data structures, and concrete TypeScript patterns.' },
  { name: 'Build Guide', description: 'Step-by-step instructions for building a working implementation you can test.' },
  { name: 'Foundations', description: 'The CS, statistics, and design theory behind the practical work.' },
];

const startHereCards = [
  {
    pathwayId: 'mtg-player-path',
    icon: <BookOpen size={28} />,
    title: 'MTG Player',
    description: 'You know drafting. Learn the data behind the decisions.',
    color: 'var(--green)',
    bgColor: 'var(--green-dim)',
  },
  {
    pathwayId: 'developer-path',
    icon: <Code size={28} />,
    title: 'Developer',
    description: 'You know code. Build a real-time data pipeline.',
    color: 'var(--blue)',
    bgColor: 'var(--blue-dim)',
  },
  {
    pathwayId: 'data-scientist-path',
    icon: <BarChart3 size={28} />,
    title: 'Data Scientist',
    description: 'You know analysis. Explore a rich new domain.',
    color: 'var(--orange)',
    bgColor: 'var(--orange-dim)',
  },
];

const featuredIds = [
  'signals-as-data',
  'streaming-json-parser',
  'gih-winrate',
  'pipeline-architecture',
  'deterministic-vs-llm',
  'feature-engineering',
];

const HomePage: React.FC = () => {
  const featuredNodes = featuredIds
    .map((id) => contentNodes.find((n) => n.id === id))
    .filter(Boolean);

  return (
    <div className="container fade-in">
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '80px 0 60px',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            marginBottom: 12,
          }}
        >
          Draft Academy
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: 'var(--accent-light)',
            marginBottom: 16,
            fontWeight: 500,
          }}
        >
          Data engineering, statistics, and AI — taught through a real pipeline
        </p>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-dim)',
            maxWidth: 640,
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          A working data pipeline that teaches you CS, statistics, and AI engineering.
          The domain is Magic: The Gathering draft — but the skills transfer everywhere.
        </p>
      </section>

      {/* Start Here Cards */}
      <section style={{ marginBottom: 64 }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: 24,
            textAlign: 'center',
            color: 'var(--text)',
          }}
        >
          Start Here
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {startHereCards.map((card) => (
            <Link
              key={card.pathwayId}
              to={`/pathways/${card.pathwayId}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: 28,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                  e.currentTarget.style.borderColor = card.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-sm)',
                    background: card.bgColor,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 8,
                  }}
                >
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  {card.description}
                </p>
                <div
                  style={{
                    marginTop: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: card.color,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  Start pathway <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How This Site Works */}
      <section style={{ marginBottom: 64 }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: 8,
            color: 'var(--text)',
          }}
        >
          <Layers size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          How This Site Works
        </h2>
        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '0.95rem',
            marginBottom: 24,
            lineHeight: 1.7,
          }}
        >
          Every concept is presented in five layers of depth. Start at the level that
          matches your background, and dig deeper when you are ready.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {layers.map((layer, i) => (
            <div
              key={layer.name}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '16px 20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--accent-glow)',
                  color: 'var(--accent-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                    marginBottom: 4,
                    textTransform: 'capitalize',
                  }}
                >
                  {layer.name}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  {layer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Concepts */}
      <section style={{ marginBottom: 64 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>
            Featured Concepts
          </h2>
          <Link
            to="/browse"
            style={{
              fontSize: '0.85rem',
              color: 'var(--accent-light)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Browse all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="card-grid">
          {featuredNodes.map(
            (node) => node && <LessonCard key={node.id} node={node} />
          )}
        </div>
      </section>

      {/* Pipeline Preview */}
      <section style={{ marginBottom: 80 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>
            The Draft Pipeline
          </h2>
          <Link
            to="/pipeline"
            style={{
              fontSize: '0.85rem',
              color: 'var(--accent-light)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Explore pipeline <ArrowRight size={14} />
          </Link>
        </div>
        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '0.95rem',
            marginBottom: 24,
            lineHeight: 1.7,
          }}
        >
          Eight stages transform raw MTGA log data into real-time draft advice.
          Each stage is a lesson in data engineering.
        </p>
        <PipelineDiagram stages={pipelineStages} />
      </section>
    </div>
  );
};

export default HomePage;
