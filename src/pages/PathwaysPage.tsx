import React from 'react';
import { pathways } from '../data/content';
import PathwayCard from '../components/PathwayCard';

const PathwaysPage: React.FC = () => {
  return (
    <div className="container fade-in" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          marginBottom: 8,
        }}
      >
        Learning Pathways
      </h1>
      <p
        style={{
          color: 'var(--text-dim)',
          fontSize: '0.95rem',
          marginBottom: 32,
          maxWidth: 640,
          lineHeight: 1.7,
        }}
      >
        Pathways are curated sequences of lessons designed for different backgrounds.
        Each pathway guides you through concepts in the order that makes sense for
        your experience level, building from foundations to advanced topics.
      </p>
      <div className="card-grid">
        {pathways.map((pathway) => (
          <PathwayCard key={pathway.id} pathway={pathway} nodeCount={pathway.nodeIds.length} />
        ))}
      </div>
    </div>
  );
};

export default PathwaysPage;
