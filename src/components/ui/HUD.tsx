'use client';

import { useGameStore } from '@/stores/useGameStore';

export default function HUD() {
  const { energy, maxEnergy, discoveredBooks, totalBooks, playerClass, nearbyArtifact } = useGameStore();

  const energyPct = (energy / maxEnergy) * 100;
  const progressPct = (discoveredBooks.length / totalBooks) * 100;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none' }}>
      {/* Top bar */}
      <div style={{
        position: 'absolute',
        top: 'var(--space-2)',
        left: 'var(--space-2)',
        right: 'var(--space-2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        {/* Player info */}
        <div style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(16px)',
          border: 'var(--border-circuit)',
          padding: 'var(--space-2) var(--space-3)',
          minWidth: 200,
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            {playerClass?.replace('-', ' ') || 'Unknown'}
          </div>

          {/* Energy bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--color-cyan)',
              width: 48,
            }}>
              ENERGY
            </span>
            <div style={{
              flex: 1, height: 6,
              background: 'hsla(220,10%,20%,0.5)',
              borderRadius: 1,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${energyPct}%`,
                background: energyPct > 30
                  ? 'linear-gradient(90deg, var(--color-cyan-dim), var(--color-cyan))'
                  : 'linear-gradient(90deg, hsl(0,80%,40%), hsl(0,80%,55%))',
                borderRadius: 1,
                boxShadow: `0 0 8px ${energyPct > 30 ? 'hsla(187,100%,50%,0.4)' : 'hsla(0,80%,50%,0.4)'}`,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--text-secondary)',
              width: 32,
              textAlign: 'right',
            }}>
              {Math.round(energy)}
            </span>
          </div>
        </div>

        {/* Discovery counter */}
        <div style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(16px)',
          border: 'var(--border-circuit)',
          padding: 'var(--space-2) var(--space-3)',
          textAlign: 'right',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
            marginBottom: 4,
          }}>
            KNOWLEDGE SYNCED
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--color-cyan)',
          }}>
            {discoveredBooks.length}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}> / {totalBooks}</span>
          </div>
          <div style={{
            width: 120, height: 3,
            background: 'hsla(220,10%,20%,0.5)',
            borderRadius: 1,
            marginTop: 4,
            marginLeft: 'auto',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progressPct}%`,
              background: 'var(--color-teal)',
              borderRadius: 1,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Proximity prompt */}
      {nearbyArtifact && (
        <div style={{
          position: 'absolute',
          bottom: 'var(--space-10)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(16px)',
          border: 'var(--border-circuit-active)',
          padding: 'var(--space-2) var(--space-4)',
          boxShadow: 'var(--glow-cyan)',
          animation: 'promptPulse 1.5s ease-in-out infinite',
          pointerEvents: 'auto',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--color-cyan)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            Press <span style={{ fontWeight: 'var(--weight-bold)', color: 'var(--text-primary)', padding: '2px 8px', border: 'var(--border-circuit-active)', marginInline: 4 }}>E</span> to Sync Knowledge
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div style={{
        position: 'absolute',
        bottom: 'var(--space-2)',
        left: 'var(--space-2)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
      }}>
        WASD Move • Mouse Look • E Interact • Click to lock cursor
      </div>

      <style>{`
        @keyframes promptPulse {
          0%, 100% { box-shadow: var(--glow-cyan); }
          50% { box-shadow: var(--glow-cyan-strong); }
        }
      `}</style>
    </div>
  );
}
