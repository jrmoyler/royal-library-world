'use client';

import { useGameStore, type CharacterStats } from '@/stores/useGameStore';
import { useState } from 'react';

interface CharacterClass {
  id: 'cipher-rogue' | 'data-knight' | 'techno-mage';
  name: string;
  description: string;
  stats: CharacterStats;
  skills: string[];
  color: string;
  icon: string;
  weapon: string;
}

const CLASSES: CharacterClass[] = [
  {
    id: 'cipher-rogue',
    name: 'Cipher-Rogue',
    description: 'Silent operatives who move between data nodes. Dual energy daggers pierce any firewall.',
    stats: { str: 13, dex: 18, int: 17 },
    skills: ['🗡️', '👁️', '⚡', '🌙'],
    color: '#8b5cf6',
    icon: '🗡️',
    weapon: 'Dual Energy Daggers',
  },
  {
    id: 'data-knight',
    name: 'Data-Knight',
    description: 'Armored sentinels with circuit-veined plate. Their photon blades cut through ignorance.',
    stats: { str: 18, dex: 15, int: 13 },
    skills: ['⚔️', '🛡️', '⚡', '💎'],
    color: '#00d4aa',
    icon: '⚔️',
    weapon: 'Dual Photon Blades',
  },
  {
    id: 'techno-mage',
    name: 'Techno-Mage',
    description: 'Wielders of data streams and code spells. Their cloaks cascade with scrolling algorithms.',
    stats: { str: 10, dex: 13, int: 18 },
    skills: ['🔮', '📜', '⚡', '✨'],
    color: '#00f0ff',
    icon: '🧙‍♂️',
    weapon: 'Cipher Staff',
  },
];

export default function CharacterSelect() {
  const { selectClass, setGamePhase } = useGameStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleConfirm = (idx: number) => {
    const cls = CLASSES[idx];
    selectClass(cls.id, cls.stats);
    setGamePhase('playing');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #0a0a15 0%, #1a1a2e 50%, #0a0a15 100%)',
      padding: '2rem',
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
        fontWeight: 900,
        color: '#00f0ff',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        marginBottom: '3rem',
        textShadow: '0 0 40px rgba(0, 240, 255, 0.5), 0 0 80px rgba(0, 240, 255, 0.3)',
        position: 'relative',
        zIndex: 1,
      }}>
        Select Your Avatar
      </h1>

      {/* Character Cards Container */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '1400px',
        position: 'relative',
        zIndex: 1,
      }}>
        {CLASSES.map((cls, idx) => {
          const isSelected = selected === idx;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={cls.id}
              onClick={() => setSelected(idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                position: 'relative',
                width: '380px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isSelected ? 'translateY(-10px) scale(1.02)' : isHovered ? 'translateY(-5px)' : 'none',
              }}
            >
              {/* Circular Glowing Platform */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '20px',
                background: `radial-gradient(ellipse at center, ${cls.color}40 0%, transparent 70%)`,
                filter: 'blur(10px)',
                animation: isSelected ? 'pulse 2s infinite' : 'none',
              }} />

              {/* Card Container */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(20, 20, 35, 0.95) 0%, rgba(30, 30, 45, 0.9) 100%)',
                border: `2px solid ${isSelected ? cls.color : 'rgba(0, 240, 255, 0.2)'}`,
                borderRadius: '12px',
                backdropFilter: 'blur(20px)',
                boxShadow: isSelected
                  ? `0 0 40px ${cls.color}66, 0 20px 60px rgba(0, 0, 0, 0.5)`
                  : '0 10px 30px rgba(0, 0, 0, 0.3)',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Corner Accents */}
                {isSelected && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '30px',
                      height: '30px',
                      borderTop: `3px solid ${cls.color}`,
                      borderLeft: `3px solid ${cls.color}`,
                      borderRadius: '12px 0 0 0',
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '30px',
                      height: '30px',
                      borderTop: `3px solid ${cls.color}`,
                      borderRight: `3px solid ${cls.color}`,
                      borderRadius: '0 12px 0 0',
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '30px',
                      height: '30px',
                      borderBottom: `3px solid ${cls.color}`,
                      borderLeft: `3px solid ${cls.color}`,
                      borderRadius: '0 0 0 12px',
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '30px',
                      height: '30px',
                      borderBottom: `3px solid ${cls.color}`,
                      borderRight: `3px solid ${cls.color}`,
                      borderRadius: '0 0 12px 0',
                    }} />
                  </>
                )}

                {/* Background Glow */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '300px',
                  height: '300px',
                  background: `radial-gradient(circle, ${cls.color}15 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Character Icon */}
                <div style={{
                  fontSize: '4rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  filter: `drop-shadow(0 0 20px ${cls.color})`,
                }}>
                  {cls.icon}
                </div>

                {/* Character Name */}
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: cls.color,
                  textAlign: 'center',
                  marginBottom: '1rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textShadow: `0 0 20px ${cls.color}66`,
                }}>
                  {cls.name}
                </h3>

                {/* Stats Section */}
                <div style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 240, 255, 0.1)',
                }}>
                  {/* STR */}
                  <div style={{ marginBottom: '0.8rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.3rem',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: '#ff6b6b',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em',
                      }}>
                        STR
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        color: '#ffffff',
                        fontWeight: 'bold',
                      }}>
                        {cls.stats.str}
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 107, 107, 0.3)',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(cls.stats.str / 20) * 100}%`,
                        background: 'linear-gradient(90deg, #ff6b6b 0%, #ff8787 100%)',
                        boxShadow: '0 0 10px rgba(255, 107, 107, 0.5)',
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      }} />
                    </div>
                  </div>

                  {/* DEX */}
                  <div style={{ marginBottom: '0.8rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.3rem',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: '#51cf66',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em',
                      }}>
                        DEX
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        color: '#ffffff',
                        fontWeight: 'bold',
                      }}>
                        {cls.stats.dex}
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      border: '1px solid rgba(81, 207, 102, 0.3)',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(cls.stats.dex / 20) * 100}%`,
                        background: 'linear-gradient(90deg, #51cf66 0%, #69db7c 100%)',
                        boxShadow: '0 0 10px rgba(81, 207, 102, 0.5)',
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      }} />
                    </div>
                  </div>

                  {/* INT */}
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.3rem',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: '#748ffc',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em',
                      }}>
                        INT
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        color: '#ffffff',
                        fontWeight: 'bold',
                      }}>
                        {cls.stats.int}
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      border: '1px solid rgba(116, 143, 252, 0.3)',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(cls.stats.int / 20) * 100}%`,
                        background: 'linear-gradient(90deg, #748ffc 0%, #91a7ff 100%)',
                        boxShadow: '0 0 10px rgba(116, 143, 252, 0.5)',
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      }} />
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.8rem',
                  marginBottom: '1.5rem',
                }}>
                  {cls.skills.map((skill, skillIdx) => (
                    <div
                      key={skillIdx}
                      style={{
                        width: '45px',
                        height: '45px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: `1px solid ${cls.color}40`,
                        borderRadius: '8px',
                        fontSize: '1.5rem',
                        filter: `drop-shadow(0 0 8px ${cls.color}66)`,
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>

                {/* Weapon */}
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textAlign: 'center',
                  letterSpacing: '0.1em',
                  marginBottom: '1.5rem',
                  textTransform: 'uppercase',
                }}>
                  {cls.weapon}
                </div>

                {/* Confirm Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirm(idx);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.9rem 2rem',
                    background: isSelected
                      ? `linear-gradient(135deg, ${cls.color}30 0%, ${cls.color}20 100%)`
                      : 'rgba(0, 0, 0, 0.3)',
                    border: `2px solid ${isSelected ? cls.color : 'rgba(0, 240, 255, 0.3)'}`,
                    borderRadius: '8px',
                    color: isSelected ? cls.color : 'rgba(255, 255, 255, 0.6)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected ? `0 0 30px ${cls.color}40` : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (isSelected) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = `0 0 40px ${cls.color}66`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = isSelected ? `0 0 30px ${cls.color}40` : 'none';
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Animated CSS */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
