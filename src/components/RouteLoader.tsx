'use client';

import { motion } from 'framer-motion';

export default function RouteLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0b0f14]"
      aria-live="polite"
      aria-label="Loading"
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.25), transparent 45%), radial-gradient(circle at 80% 10%, rgba(139, 92, 246, 0.28), transparent 50%), radial-gradient(circle at 70% 80%, rgba(56, 189, 248, 0.22), transparent 55%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />

      <div className="relative w-full max-w-2xl px-6">
        <div className="absolute -top-12 left-1/2 h-24 w-24 -translate-x-1/2">
          <motion.svg
            viewBox="0 0 120 120"
            className="h-full w-full text-primary-300"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
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
          </motion.svg>
        </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(2,8,23,0.6)] backdrop-blur">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-300">
            <span>Edolv Edit Suite</span>
            <span>Exporting</span>
          </div>

          <div className="mt-6">
            <div className="relative h-20 overflow-hidden rounded-2xl border border-white/10 bg-[#111821]">
              <motion.div
                className="absolute inset-y-0 left-0 w-[220%]"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, rgba(79, 70, 229, 0.2) 0%, rgba(99, 102, 241, 0.35) 20%, rgba(14, 165, 233, 0.32) 45%, rgba(79, 70, 229, 0.2) 70%), repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 12px, transparent 12px 24px)',
                }}
                initial={{ x: '-40%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              />
              <div
                className="absolute inset-x-0 top-1 h-4"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0 6px, transparent 6px 12px)',
                }}
              />
              <div
                className="absolute inset-x-0 bottom-1 h-4"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0 6px, transparent 6px 12px)',
                }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 w-[3px] bg-primary-300"
                initial={{ x: '10%' }}
                animate={{ x: ['10%', '85%', '10%'] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ boxShadow: '0 0 18px rgba(129, 140, 248, 0.8)' }}
              />
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-300">
              <span className="tracking-[0.35em]">TIMELINE</span>
              <span>Color + Cuts + SFX</span>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-12 gap-2">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="h-9 rounded-lg bg-gradient-to-b from-white/10 via-white/5 to-transparent"
                animate={{ opacity: [0.2, 0.8, 0.2], y: [6, 0, 6] }}
                transition={{ duration: 1.6, delay: i * 0.05, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>

          <div className="mt-7 flex items-center gap-3 text-sm text-slate-300">
            <div className="h-2 w-2 rounded-full bg-primary-400 shadow-[0_0_12px_rgba(129,140,248,0.75)]" />
            <span className="tracking-widest">Rendering Footage</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
