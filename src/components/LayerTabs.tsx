import React from 'react';
import { Lightbulb, Layers, Code, Wrench, BookOpen } from 'lucide-react';
import type { Layer } from '../data/types';

interface LayerTabsProps {
  layers?: Layer[];
  activeLayer: Layer;
  onLayerChange: (layer: Layer) => void;
}

const layerConfig: { key: Layer; label: string; icon: React.ReactNode }[] = [
  { key: 'intuition', label: 'Intuition', icon: <Lightbulb size={15} /> },
  { key: 'system', label: 'System View', icon: <Layers size={15} /> },
  { key: 'technical', label: 'Technical', icon: <Code size={15} /> },
  { key: 'project', label: 'Build Guide', icon: <Wrench size={15} /> },
  { key: 'theory', label: 'Foundations', icon: <BookOpen size={15} /> },
];

const LayerTabs: React.FC<LayerTabsProps> = ({ layers, activeLayer, onLayerChange }) => {
  const visibleLayers = layers
    ? layerConfig.filter(({ key }) => layers.includes(key))
    : layerConfig;

  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        marginBottom: 16,
        flexWrap: 'wrap',
      }}
    >
      {visibleLayers.map(({ key, label, icon }) => {
        const isActive = activeLayer === key;
        return (
          <button
            key={key}
            onClick={() => onLayerChange(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
              background: isActive ? 'var(--accent-glow)' : 'transparent',
              color: isActive ? 'var(--accent-light)' : 'var(--text-dim)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontFamily: 'var(--font)',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {icon}
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default LayerTabs;
