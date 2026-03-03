'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Star } from 'lucide-react';
import { Button } from '#components/common/Button';

const FIREWORK_COUNT = 12;
const fireworkColors = [
  'text-pink-500',
  'text-yellow-400',
  'text-blue-500',
  'text-green-500',
  'text-purple-500',
];

const levelStyles = {
  bronze: { bg: 'bg-amber-600' },
  silver: { bg: 'bg-gray-400' },
  gold: { bg: 'bg-yellow-400' },
  default: { bg: 'bg-gray-200' },
};

function BadgeModal({ badge, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!badge) return undefined;

    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    setShowFireworks(true);
    const timer = setTimeout(() => setShowFireworks(false), 2500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalStyle;
    };
  }, [badge]);

  useEffect(() => {
    if (!badge) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [badge, onClose]);

  const fireworks = useMemo(() => {
    if (!showFireworks) return [];
    return Array.from({ length: FIREWORK_COUNT }).map(() => {
      const size = 10 + Math.random() * 12;
      const x = Math.random() * 100;
      const y = Math.random() * 50 + 10;
      const color =
        fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
      const duration = 1000 + Math.random() * 1000;
      const delay = Math.random() * 500;
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `firework-${Math.random().toString(36).slice(2, 10)}`;
      return {
        id,
        size,
        x,
        y,
        color,
        duration,
        delay,
      };
    });
  }, [showFireworks]);

  if (!mounted || !badge) return null;

  const level = badge?.level?.toLowerCase() || 'default';
  const style = levelStyles[level] || levelStyles.default;

  const iconSrc = badge?.iconKey ? `/badge/${badge.iconKey}.png` : '';

  return createPortal(
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center p-4'
      role='dialog'
      aria-modal='true'
      aria-label='Badge unlocked'
    >
      <button
        type='button'
        aria-label='Close badge modal'
        className='absolute inset-0 border-0 m-0 p-0 bg-black/55 dark:bg-black/70 backdrop-blur-[2px]'
        onClick={onClose}
      />

      {/* Fireworks */}
      {showFireworks && (
        <div className='absolute inset-0 pointer-events-none z-10'>
          {fireworks.map((firework) => (
            <Star
              key={firework.id}
              className={`${firework.color} absolute`}
              style={{
                width: `${firework.size}px`,
                height: `${firework.size}px`,
                left: `${firework.x}%`,
                top: `${firework.y}%`,
                transform: 'translate(-50%, -50%) scale(0)',
                animation: `fireworkExplosion ${firework.duration}ms ease-out forwards`,
                animationDelay: `${firework.delay}ms`,
              }}
            />
          ))}
        </div>
      )}

      <div className='relative z-20 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 text-center text-card-foreground shadow-2xl animate-pop'>
        <div className='flex items-center justify-center gap-2 mb-6'>
          <Star className='w-6 h-6 text-yellow-400 animate-pulse' />
          <h2 className='text-xl font-bold'>Badge Unlocked!</h2>
          <Star className='w-6 h-6 text-yellow-400 animate-pulse' />
        </div>

        <div className='mx-auto w-32 h-32 rounded-full flex items-center justify-center shadow-lg mb-4 relative'>
          <span
            className={`absolute inset-0 rounded-full ${style.bg} opacity-40 animate-pulse`}
            style={{ filter: 'blur(12px)' }}
          />
          <img
            src={iconSrc}
            alt={badge.name}
            className='relative w-20 h-20 animate-pop-scale'
          />
        </div>

        <h3 className='text-lg font-semibold'>{badge.name}</h3>
        <p className='mt-1 text-muted-foreground'>{badge.description}</p>
        {badge.threshold && badge.metric && (
          <p className='mt-2 text-sm text-muted-foreground'>
            You&apos;ve completed {badge.threshold}{' '}
            {badge.metric.replace('_', ' ').toLowerCase()}!
          </p>
        )}

        <Button type='button' onClick={onClose} className='mt-6 min-w-28'>
          Close
        </Button>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes fireworkExplosion {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          40% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        }

        @keyframes popScale {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .animate-pop-scale {
          animation: popScale 0.6s ease-out forwards;
        }
      `}</style>
    </div>,
    document.body
  );
}

export default BadgeModal;
