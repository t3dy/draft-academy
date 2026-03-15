import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container fade-in" style={{ paddingTop: 80, textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 8, color: 'var(--text)' }}>
        404
      </h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', marginBottom: 24 }}>
        This page doesn't exist.
      </p>
      <Link
        to="/"
        style={{
          color: 'var(--accent-light)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.9rem',
        }}
      >
        <ArrowLeft size={16} /> Back to home
      </Link>
    </div>
  );
};

export default NotFoundPage;
