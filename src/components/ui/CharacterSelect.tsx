'use client';

import { useGameStore } from '@/stores/useGameStore';
import { useState } from 'react';

const CLASSES = [
  {
    id: 'techno-mage' as const,
    name: 'Techno-Mage',
    description: 'Wielders of data streams and code spells. Their cloaks cascade with scrolling algorithms.',
    stats: { wisdom: 9, agility: 5, strength: 3 },
    color: '#00f0ff',
    icon: '🧙‍♂️',
    weapon: 'Cipher Staff',
  },
  {
    id: 'cyber-knight' as const,
    name: 'Cyber-Knight',
    description: 'Armored sentinels with circuit-veined plate. Their photon blades cut through ignorance.',
    stats: { wisdom: 4, agility: 5, strength: 9 },
    color: '#00d4aa',
    icon: '⚔️',
    weapon: 'Photon Blade',
  },
  {
    id: 'shadow-agent' as const,
    name: 'Shadow Agent',
    description: 'Silent operatives who move between data nodes. Dual energy daggers pierce any firewall.',
    stats: { wisdom: 6, agility: 9, strength: 3 },
    color: '#8b5cf6',
    icon: '🗡️',
    weapon: 'Energy Daggers',
  },
];

export default function CharacterSelect() {
  const { selectClass, setGamePhase } = useGameStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selected === null) return;
    selectClass(CLASSES[selected].id);
    setGamePhase('playing');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(180deg, hsl(220,15%,6%) 0%, hsl(215,20%,10%) 100%)',
      padding: 'var(--space-4)',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--text-primary)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: 'var(--space-6)',
        textShadow: '0 0 30px hsla(187,100%,50%,0.3)',
      }}>
        Choose Your Class
      </h2>

      <div style={{
        display: 'flex',
        gap: 'var(--space-3)',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '960px',
      }}>
        {CLASSES.map((cls, idx) => {
          const isSelected = selected === idx;
          const isHovered = hoveredIdx === idx;
          return (
            <button
              key={cls.id}
              onClick={() => setSelected(idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                width: '280px',
                padding: 'var(--space-4)',
                background: isSelected
                  ? `hsla(${cls.color === '#00f0ff' ? 187 : cls.color === '#00d4aa' ? 160 : 260}, 60%, 15%, 0.6)`
                  : 'var(--surface-glass)',
                border: isSelected
                  ? `2px solid ${cls.color}`
                  : isHovered
                    ? '1px solid hsla(187,100%,50%,0.4)'
                    : 'var(--border-circuit)',
                borderRadius: '2px',
                backdropFilter: 'blur(16px)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-normal)',
                boxShadow: isSelected ? `0 0 30px ${cls.color}33` : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Corner accents */}
              {isSelected && (
                <>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 16, height: 16, borderTop: `2px solid ${cls.color}`, borderLeft: `2px solid ${cls.color}` }} />
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderTop: `2px solid ${cls.color}`, borderRight: `2px solid ${cls.color}` }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: 16, height: 16, borderBottom: `2px solid ${cls.color}`, borderLeft: `2px solid ${cls.color}` }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderBottom: `2px solid ${cls.color}`, borderRight: `2px solid ${cls.color}` }} />
                </>
              )}

              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>
                {cls.icon}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 'var(--weight-bold)',
                color: isSelected ? cls.color : 'var(--text-primary)',
                marginBottom: 'var(--space-1)',
                letterSpacing: '0.1em',
              }}>
                {cls.name}
              </h3>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                marginBottom: 'var(--space-2)',
              }}>
                {cls.description}
              </p>

              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
              }}>
                WEAPON: {cls.weapon}
              </div>

              {/* Stat bars */}
              <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Object.entries(cls.stats).map(([stat, val]) => (
                  <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: 'var(--text-muted)',
                      width: 56,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {stat}
                    </span>
                    <div style={{
                      flex: 1, height: 4,
                      background: 'hsla(220,10%,20%,0.5)',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(val / 10) * 100}%`,
                        background: cls.color,
                        borderRadius: 1,
                        boxShadow: `0 0 8px ${cls.color}66`,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleConfirm}
        disabled={selected === null}
        style={{
          marginTop: 'var(--space-5)',
          padding: 'var(--space-2) var(--space-6)',
          background: selected !== null ? 'hsla(187,100%,50%,0.15)' : 'transparent',
          border: selected !== null ? 'var(--border-circuit-active)' : 'var(--border-stone)',
          color: selected !== null ? 'var(--color-cyan)' : 'var(--text-muted)',
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: 'var(--weight-semibold)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          cursor: selected !== null ? 'pointer' : 'default',
          transition: 'all var(--transition-normal)',
          boxShadow: selected !== null ? 'var(--glow-cyan)' : 'none',
        }}
      >
        Enter the Library
      </button>
    </div>
  );
}
