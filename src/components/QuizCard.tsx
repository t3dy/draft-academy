import React, { useState, useCallback } from 'react';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import type { QuizItem } from '../data/types';

interface QuizCardProps {
  items: QuizItem[];
}

const QuizCard: React.FC<QuizCardProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = items[currentIndex];

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (answered) return;
      setSelectedOption(optionIndex);
      setAnswered(true);
      if (optionIndex === current.correctIndex) {
        setScore((s) => s + 1);
      }
    },
    [answered, current]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= items.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  }, [currentIndex, items.length]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnswered(false);
    setFinished(false);
  }, []);

  if (items.length === 0) {
    return (
      <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
        No quiz items available.
      </div>
    );
  }

  if (finished) {
    return (
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 32,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Trophy size={40} color="var(--orange)" />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
          Quiz Complete!
        </h3>
        <p style={{ fontSize: '1rem', color: 'var(--text-dim)', margin: 0 }}>
          You scored{' '}
          <span style={{ color: 'var(--accent-light)', fontWeight: 700 }}>
            {score}
          </span>{' '}
          out of {items.length}
        </p>
        <button
          onClick={handleRestart}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 20px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--accent)',
            background: 'var(--accent-glow)',
            color: 'var(--accent-light)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontFamily: 'var(--font)',
            fontWeight: 500,
            marginTop: 8,
          }}
        >
          <RotateCcw size={14} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Score bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}
      >
        <span>
          Question {currentIndex + 1} of {items.length}
        </span>
        <span style={{ color: 'var(--green)', fontWeight: 600 }}>
          Score: {score}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          height: 3,
          background: 'var(--border)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${((currentIndex + (answered ? 1 : 0)) / items.length) * 100}%`,
            height: '100%',
            background: 'var(--accent)',
            borderRadius: 2,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Question */}
      <h4
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text)',
          lineHeight: 1.4,
          margin: 0,
        }}
      >
        {current.question}
      </h4>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {current.options.map((option, i) => {
          const isSelected = selectedOption === i;
          const isCorrect = i === current.correctIndex;
          let borderColor = 'var(--border)';
          let bgColor = 'transparent';
          let textColor = 'var(--text-dim)';

          if (answered) {
            if (isCorrect) {
              borderColor = 'var(--green)';
              bgColor = 'var(--green-dim)';
              textColor = 'var(--green)';
            } else if (isSelected && !isCorrect) {
              borderColor = 'var(--red)';
              bgColor = 'var(--red-dim)';
              textColor = 'var(--red)';
            }
          } else if (isSelected) {
            borderColor = 'var(--accent)';
            bgColor = 'var(--accent-glow)';
            textColor = 'var(--accent-light)';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                cursor: answered ? 'default' : 'pointer',
                fontSize: '0.88rem',
                fontFamily: 'var(--font)',
                textAlign: 'left',
                transition: 'all 0.2s',
                width: '100%',
              }}
            >
              {answered && isCorrect && <CheckCircle size={16} color="var(--green)" />}
              {answered && isSelected && !isCorrect && <XCircle size={16} color="var(--red)" />}
              {option}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            fontSize: '0.84rem',
            color: 'var(--text-dim)',
            lineHeight: 1.5,
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {current.explanation}
        </div>
      )}

      {/* Next button */}
      {answered && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleNext}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 18px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'var(--accent)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontFamily: 'var(--font)',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            {currentIndex + 1 >= items.length ? 'Finish' : 'Next'}
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
