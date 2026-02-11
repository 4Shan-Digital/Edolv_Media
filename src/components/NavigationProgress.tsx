'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Instant navigation loader — fires on link click (event delegation).
 * Uses pure CSS animations (no framer-motion) so it renders before
 * any JS chunk has been downloaded for the target route.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  // Navigation complete → hide loader
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  // Intercept internal link clicks for immediate feedback
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Only internal, non-API, non-hash links
      if (
        !href.startsWith('/') ||
        href.startsWith('/api') ||
        href.startsWith('//')
      )
        return;
      if (href === '#' || href.startsWith('#')) return;

      // Skip modifier-key clicks (new tab, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (anchor.getAttribute('target') === '_blank') return;

      // Compare normalized paths
      const targetPath =
        href.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
      const currentPath = pathname.replace(/\/$/, '') || '/';
      if (targetPath === currentPath) return;

      setIsNavigating(true);
    };

    // Capture phase → fires before Next.js link handler
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname]);

  if (!isNavigating) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: '#0b0f14',
        animation: 'navFadeIn 0.15s ease-out both',
      }}
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Gradient blobs */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25), transparent 45%), radial-gradient(circle at 80% 10%, rgba(139,92,246,0.28), transparent 50%), radial-gradient(circle at 70% 80%, rgba(56,189,248,0.22), transparent 55%)',
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />

      {/* Content card */}
      <div className="relative w-full max-w-2xl px-6">
        {/* Spinning gear */}
        <div className="absolute -top-12 left-1/2 h-24 w-24 -translate-x-1/2">
          <svg
            viewBox="0 0 120 120"
            className="h-full w-full"
            style={{
              color: 'rgb(165 180 252)',
              animation: 'navSpin 3s linear infinite',
            }}
          >
            <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.35" />
            <circle cx="60" cy="60" r="18" fill="none" stroke="currentColor" strokeWidth="4" />
            {[...Array(8)].map((_, i) => (
              <circle
                key={i}
                cx={60 + 28 * Math.cos((i * Math.PI * 2) / 8)}
                cy={60 + 28 * Math.sin((i * Math.PI * 2) / 8)}
                r="6"
                fill="currentColor"
              />
            ))}
          </svg>
        </div>

        {/* Editor card */}
        <div
          className="relative rounded-3xl border border-white/10 p-6 backdrop-blur"
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            boxShadow: '0 30px 80px rgba(2,8,23,0.6)',
          }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-300">
            <span>Edolv Edit Suite</span>
            <span>Exporting</span>
          </div>

          {/* Timeline bar */}
          <div className="mt-6">
            <div
              className="relative h-20 overflow-hidden rounded-2xl border border-white/10"
              style={{ backgroundColor: '#111821' }}
            >
              {/* Sliding gradient */}
              <div
                className="absolute inset-y-0 left-0 w-[220%]"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, rgba(79,70,229,0.2) 0%, rgba(99,102,241,0.35) 20%, rgba(14,165,233,0.32) 45%, rgba(79,70,229,0.2) 70%), repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 12px, transparent 12px 24px)',
                  animation: 'navSlide 1.8s linear infinite',
                }}
              />
              {/* Top tick marks */}
              <div
                className="absolute inset-x-0 top-1 h-4"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0 6px, transparent 6px 12px)',
                }}
              />
              {/* Bottom tick marks */}
              <div
                className="absolute inset-x-0 bottom-1 h-4"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0 6px, transparent 6px 12px)',
                }}
              />
              {/* Playhead */}
              <div
                className="absolute inset-y-0 left-0 w-[3px]"
                style={{
                  backgroundColor: 'rgb(165 180 252)',
                  boxShadow: '0 0 18px rgba(129,140,248,0.8)',
                  animation: 'navPlayhead 2.6s ease-in-out infinite',
                }}
              />
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-300">
              <span className="tracking-[0.35em]">TIMELINE</span>
              <span>Color + Cuts + SFX</span>
            </div>
          </div>

          {/* Audio-bar grid */}
          <div className="mt-7 grid grid-cols-12 gap-2">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-9 rounded-lg"
                style={{
                  backgroundImage:
                    'linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.05), transparent)',
                  animation: `navBar 1.6s ${i * 0.05}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>

          {/* Status line */}
          <div className="mt-7 flex items-center gap-3 text-sm text-slate-300">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: 'rgb(129 140 248)',
                boxShadow: '0 0 12px rgba(129,140,248,0.75)',
                animation: 'navPulse 1.5s ease-in-out infinite',
              }}
            />
            <span className="tracking-widest">Rendering Footage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
