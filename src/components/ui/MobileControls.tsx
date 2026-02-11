'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Mobile Touch Controls Component
 * - Virtual joystick for movement
 * - Touch buttons for actions
 * - Responsive design
 * - Optimized for mobile devices
 */

interface JoystickState {
  active: boolean;
  x: number;
  y: number;
  startX: number;
  startY: number;
}

export default function MobileControls() {
  const [isMobile, setIsMobile] = useState(false);
  const [joystick, setJoystick] = useState<JoystickState>({
    active: false,
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
  });

  const joystickRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Joystick touch handlers
  const handleJoystickStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;

    touchIdRef.current = touch.identifier;

    const rect = joystickRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setJoystick({
      active: true,
      x: 0,
      y: 0,
      startX: centerX,
      startY: centerY,
    });
  };

  const handleJoystickMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!joystick.active) return;

    const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current);
    if (!touch) return;

    const maxDistance = 50; // Maximum joystick distance in pixels

    let deltaX = touch.clientX - joystick.startX;
    let deltaY = touch.clientY - joystick.startY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      deltaX = Math.cos(angle) * maxDistance;
      deltaY = Math.sin(angle) * maxDistance;
    }

    setJoystick(prev => ({
      ...prev,
      x: deltaX,
      y: deltaY,
    }));

    // Normalize movement input
    const normalizedX = deltaX / maxDistance;
    const normalizedY = -deltaY / maxDistance; // Inverted Y for proper forward movement

    // Simulate keyboard events for movement
    const newKeys = new Set<string>();
    if (normalizedY > 0.2) newKeys.add('KeyW');
    if (normalizedY < -0.2) newKeys.add('KeyS');
    if (normalizedX < -0.2) newKeys.add('KeyA');
    if (normalizedX > 0.2) newKeys.add('KeyD');
    if (distance > maxDistance * 0.7) newKeys.add('ShiftLeft');

    // Update keyboard state
    newKeys.forEach(key => {
      if (!keysPressed.current.has(key)) {
        keysPressed.current.add(key);
        window.dispatchEvent(new KeyboardEvent('keydown', { code: key }));
      }
    });

    // Release keys that are no longer pressed
    keysPressed.current.forEach(key => {
      if (!newKeys.has(key)) {
        keysPressed.current.delete(key);
        window.dispatchEvent(new KeyboardEvent('keyup', { code: key }));
      }
    });
  };

  const handleJoystickEnd = (e: React.TouchEvent) => {
    e.preventDefault();

    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current);
    if (!touch) return;

    setJoystick({
      active: false,
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
    });

    touchIdRef.current = null;

    // Release all keys
    keysPressed.current.forEach(key => {
      window.dispatchEvent(new KeyboardEvent('keyup', { code: key }));
    });
    keysPressed.current.clear();
  };

  // Action button handler
  const handleInteract = () => {
    // Simulate 'E' key press for interaction
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE' }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyE' }));
    }, 100);
  };

  if (!isMobile) return null;

  return (
    <div className="mobile-controls">
      {/* Virtual Joystick */}
      <div
        ref={joystickRef}
        className="joystick-container"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
      >
        <div className="joystick-base">
          <div
            className="joystick-stick"
            style={{
              transform: `translate(${joystick.x}px, ${joystick.y}px)`,
              opacity: joystick.active ? 1 : 0.6,
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="action-button interact-button"
          onTouchStart={handleInteract}
        >
          <span>INTERACT</span>
        </button>
      </div>

      <style jsx>{`
        .mobile-controls {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          pointer-events: none;
          z-index: 100;
          padding: 20px;
        }

        .joystick-container {
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 140px;
          height: 140px;
          pointer-events: auto;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }

        .joystick-base {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(0, 240, 255, 0.1);
          border: 3px solid rgba(0, 240, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
        }

        .joystick-stick {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00f0ff 0%, #00d4aa 100%);
          box-shadow:
            0 0 20px rgba(0, 240, 255, 0.6),
            inset 0 0 10px rgba(255, 255, 255, 0.3);
          transition: opacity 0.2s;
          border: 2px solid rgba(255, 255, 255, 0.5);
        }

        .action-buttons {
          position: absolute;
          bottom: 40px;
          right: 20px;
          display: flex;
          gap: 15px;
          pointer-events: auto;
        }

        .action-button {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 3px solid rgba(0, 240, 255, 0.6);
          background: linear-gradient(135deg,
            rgba(0, 240, 255, 0.2) 0%,
            rgba(0, 212, 170, 0.2) 100%
          );
          color: #00f0ff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          box-shadow:
            0 0 20px rgba(0, 240, 255, 0.4),
            inset 0 0 15px rgba(0, 240, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .action-button:active {
          transform: scale(0.95);
          background: linear-gradient(135deg,
            rgba(0, 240, 255, 0.4) 0%,
            rgba(0, 212, 170, 0.4) 100%
          );
          box-shadow:
            0 0 30px rgba(0, 240, 255, 0.8),
            inset 0 0 20px rgba(0, 240, 255, 0.3);
        }

        .action-button span {
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
        }

        /* Tablet landscape */
        @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
          .joystick-container {
            bottom: 40px;
            left: 40px;
          }

          .action-buttons {
            bottom: 60px;
            right: 40px;
          }

          .action-button {
            width: 90px;
            height: 90px;
            font-size: 12px;
          }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
          .joystick-container {
            width: 120px;
            height: 120px;
          }

          .joystick-base {
            width: 100px;
            height: 100px;
          }

          .joystick-stick {
            width: 40px;
            height: 40px;
          }

          .action-button {
            width: 70px;
            height: 70px;
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
