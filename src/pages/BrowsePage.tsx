import React, { useState, useMemo } from 'react';
import { contentNodes } from '../data/content';
import type { Difficulty, NodeType } from '../data/types';
import LessonCard from '../components/LessonCard';
import SearchFilter from '../components/SearchFilter';

const BrowsePage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | null>(null);
  const [typeFilter, setTypeFilter] = useState<NodeType | null>(null);

  const filteredNodes = useMemo(() => {
    return contentNodes.filter((node) => {
      if (difficultyFilter !== null && node.difficulty !== difficultyFilter) return false;
      if (typeFilter !== null && node.type !== typeFilter) return false;
      if (searchText) {
        const query = searchText.toLowerCase();
        const matchesTitle = node.title.toLowerCase().includes(query);
        const matchesSummary = node.summary.toLowerCase().includes(query);
        const matchesTags = node.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesSummary && !matchesTags) return false;
      }
      return true;
    });
  }, [searchText, difficultyFilter, typeFilter]);

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
        Browse Concepts
      </h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: 28, fontSize: '0.95rem' }}>
        Search and filter all lessons, concepts, and projects.
      </p>

      <SearchFilter
        onSearch={setSearchText}
        onFilterDifficulty={setDifficultyFilter}
        onFilterType={setTypeFilter}
      />

      <div
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: 20,
        }}
      >
        {filteredNodes.length} {filteredNodes.length === 1 ? 'result' : 'results'}
      </div>

      {filteredNodes.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 0',
            color: 'var(--text-muted)',
          }}
        >
          <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No matching content found.</p>
          <p style={{ fontSize: '0.9rem' }}>Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="card-grid">
          {filteredNodes.map((node) => (
            <LessonCard key={node.id} node={node} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;
