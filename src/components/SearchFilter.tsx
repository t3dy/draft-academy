import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { Difficulty, NodeType } from '../data/types';

interface SearchFilterProps {
  onSearch: (q: string) => void;
  onFilterDifficulty: (d: Difficulty | null) => void;
  onFilterType: (t: NodeType | null) => void;
}

const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced', 'expert'];
const nodeTypes: NodeType[] = [
  'concept', 'lesson', 'project', 'puzzle', 'quiz', 'theory', 'example', 'tool', 'pathway', 'persona',
];

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--bg-card)',
  color: 'var(--text)',
  fontSize: '0.84rem',
  fontFamily: 'var(--font)',
  cursor: 'pointer',
  outline: 'none',
  minWidth: 130,
  appearance: 'auto' as React.CSSProperties['appearance'],
};

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilterDifficulty,
  onFilterType,
}) => {
  const [query, setQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 20,
      }}
    >
      {/* Search input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
          flex: '1 1 220px',
          minWidth: 180,
        }}
      >
        <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search lessons..."
          value={query}
          onChange={handleSearchChange}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontSize: '0.88rem',
            fontFamily: 'var(--font)',
            width: '100%',
          }}
        />
      </div>

      {/* Difficulty filter */}
      <select
        onChange={(e) =>
          onFilterDifficulty(e.target.value ? (e.target.value as Difficulty) : null)
        }
        defaultValue=""
        style={selectStyle}
      >
        <option value="">All Levels</option>
        {difficulties.map((d) => (
          <option key={d} value={d}>
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </option>
        ))}
      </select>

      {/* Type filter */}
      <select
        onChange={(e) =>
          onFilterType(e.target.value ? (e.target.value as NodeType) : null)
        }
        defaultValue=""
        style={selectStyle}
      >
        <option value="">All Types</option>
        {nodeTypes.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilter;
