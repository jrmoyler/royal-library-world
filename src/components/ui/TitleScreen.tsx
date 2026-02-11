'use client';

import { useGameStore } from '@/stores/useGameStore';
import { useEffect, useState } from 'react';

export default function TitleScreen() {
  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const [show, setShow] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 300);
    const t2 = setTimeout(() => setPulse(true), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, hsl(220,15%,6%) 0%, hsl(210,20%,10%) 50%, hsl(220,15%,6%) 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Animated circuit lines background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.15,
        backgroundImage: `
          linear-gradient(90deg, transparent 49.5%, hsla(187,100%,50%,0.3) 49.5%, hsla(187,100%,50%,0.3) 50.5%, transparent 50.5%),
          linear-gradient(0deg, transparent 49.5%, hsla(187,100%,50%,0.3) 49.5%, hsla(187,100%,50%,0.3) 50.5%, transparent 50.5%)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* Beam of light */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '4px',
        height: '100%',
        background: 'linear-gradient(180deg, hsla(187,100%,50%,0.8), transparent 70%)',
        boxShadow: '0 0 40px 10px hsla(187,100%,50%,0.2)',
        opacity: show ? 1 : 0,
        transition: 'opacity 2s ease',
      }} />

      {/* Title */}
      <div style={{
        textAlign: 'center',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--text-primary)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textShadow: '0 0 40px hsla(187,100%,50%,0.5), 0 0 80px hsla(187,100%,50%,0.2)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          Royal Library
          <br />
          <span style={{
            color: 'var(--color-cyan)',
            fontSize: '0.6em',
            letterSpacing: '0.3em',
          }}>
            World
          </span>
        </h1>

        <div style={{
          marginTop: 'var(--space-3)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          {'// Aetheria Library Protocol v1.0'}
        </div>
      </div>

      {/* Press Start Button */}
      <button
        onClick={() => setGamePhase('character-select')}
        style={{
          marginTop: 'var(--space-8)',
          padding: 'var(--space-2) var(--space-6)',
          background: 'transparent',
          border: 'var(--border-circuit-active)',
          color: 'var(--color-cyan)',
          fontFamily: 'var(--font-display)',
          fontSize: '1.2rem',
          fontWeight: 'var(--weight-semibold)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          opacity: pulse ? 1 : 0,
          transform: pulse ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease',
          animation: pulse ? 'titlePulse 2s ease-in-out infinite' : 'none',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'hsla(187,100%,50%,0.1)';
          e.currentTarget.style.boxShadow = 'var(--glow-cyan)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        Press Start
      </button>

      {/* Bottom credits */}
      <div style={{
        position: 'absolute',
        bottom: 'var(--space-4)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.15em',
        textAlign: 'center',
      }}>
        BUILT WITH NEXT.JS • R3F • RAPIER PHYSICS
        <br />
        A HATAALII PRODUCTION
      </div>

      <style>{`
        @keyframes titlePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
