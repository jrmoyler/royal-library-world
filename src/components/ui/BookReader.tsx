'use client';

import { useGameStore } from '@/stores/useGameStore';

export default function BookReader() {
  const { activeBook, setActiveBook } = useGameStore();

  if (!activeBook) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--surface-overlay)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={() => setActiveBook(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 560,
          width: '90%',
          background: 'var(--surface-stone)',
          border: `2px solid ${activeBook.color}`,
          padding: 'var(--space-5)',
          position: 'relative',
          boxShadow: `0 0 60px ${activeBook.color}22, var(--shadow-stone)`,
        }}
      >
        {/* Corner accents */}
        <div style={{ position: 'absolute', top: -1, left: -1, width: 24, height: 24, borderTop: `2px solid ${activeBook.color}`, borderLeft: `2px solid ${activeBook.color}` }} />
        <div style={{ position: 'absolute', top: -1, right: -1, width: 24, height: 24, borderTop: `2px solid ${activeBook.color}`, borderRight: `2px solid ${activeBook.color}` }} />
        <div style={{ position: 'absolute', bottom: -1, left: -1, width: 24, height: 24, borderBottom: `2px solid ${activeBook.color}`, borderLeft: `2px solid ${activeBook.color}` }} />
        <div style={{ position: 'absolute', bottom: -1, right: -1, width: 24, height: 24, borderBottom: `2px solid ${activeBook.color}`, borderRight: `2px solid ${activeBook.color}` }} />

        {/* Category tag */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: activeBook.color,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-1)',
        }}>
          [{activeBook.category}]
        </div>

        {/* Icon and title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <span style={{ fontSize: '2rem' }}>{activeBook.icon}</span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--text-primary)',
            letterSpacing: '0.05em',
          }}>
            {activeBook.title}
          </h2>
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          fontWeight: 'var(--weight-medium)',
          color: activeBook.color,
          marginBottom: 'var(--space-3)',
          lineHeight: 1.4,
        }}>
          {activeBook.description}
        </p>

        {/* Divider */}
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${activeBook.color}44, transparent)`,
          marginBottom: 'var(--space-3)',
        }} />

        {/* Content */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          fontWeight: 'var(--weight-regular)',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: 'var(--space-4)',
        }}>
          {activeBook.content}
        </p>

        {/* Close hint */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          letterSpacing: '0.15em',
        }}>
          CLICK OUTSIDE OR PRESS ESC TO CLOSE
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
