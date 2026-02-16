'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 600),
      setTimeout(() => setStage(3), 1200),
      setTimeout(() => setStage(4), 1800),
      setTimeout(() => setStage(5), 2400),
      setTimeout(() => onComplete(), 3000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Animated gradient orbs */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: stage >= 1 ? 1.5 : 0, 
            opacity: stage >= 1 ? 0.3 : 0 
          }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(99, 102, 241, 0.2) 40%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        
        <motion.div
          initial={{ scale: 0, opacity: 0, x: 200, y: -200 }}
          animate={{ 
            scale: stage >= 2 ? 1 : 0, 
            opacity: stage >= 2 ? 0.25 : 0,
            x: stage >= 2 ? 150 : 200,
            y: stage >= 2 ? -150 : -200
          }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
            filter: 'blur(50px)'
          }}
        />

        <motion.div
          initial={{ scale: 0, opacity: 0, x: -200, y: 200 }}
          animate={{ 
            scale: stage >= 2 ? 1 : 0, 
            opacity: stage >= 2 ? 0.2 : 0,
            x: stage >= 2 ? -150 : -200,
            y: stage >= 2 ? 150 : 200
          }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />

        {/* Film reel decorative elements */}
        <motion.div
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ 
            opacity: stage >= 2 ? 0.1 : 0, 
            rotate: stage >= 2 ? 0 : -180 
          }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -left-20 top-1/4 w-64 h-64"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary-500">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            {[...Array(8)].map((_, i) => (
              <circle
                key={i}
                cx={50 + 25 * Math.cos((i * Math.PI * 2) / 8)}
                cy={50 + 25 * Math.sin((i * Math.PI * 2) / 8)}
                r="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            ))}
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, rotate: 180 }}
          animate={{ 
            opacity: stage >= 2 ? 0.1 : 0, 
            rotate: stage >= 2 ? 0 : 180 
          }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -right-20 bottom-1/4 w-64 h-64"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-500">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            {[...Array(8)].map((_, i) => (
              <circle
                key={i}
                cx={50 + 25 * Math.cos((i * Math.PI * 2) / 8)}
                cy={50 + 25 * Math.sin((i * Math.PI * 2) / 8)}
                r="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            ))}
          </svg>
        </motion.div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ 
              scale: stage >= 1 ? 1 : 0, 
              opacity: stage >= 1 ? 1 : 0,
              y: stage >= 1 ? 0 : 50
            }}
            transition={{ 
              duration: 0.8, 
              ease: [0.22, 1, 0.36, 1]
            }}
            className="mb-6 relative"
          >
            {/* Glowing ring around logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: stage >= 3 ? [1, 1.2, 1] : 0.8, 
                opacity: stage >= 3 ? [0.5, 0.8, 0.5] : 0 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -inset-8 rounded-full bg-gradient-to-r from-primary-500/20 via-indigo-500/20 to-primary-500/20 blur-xl"
            />
            
            {/* Logo container with glow effect */}
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              {/* Outer glow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: stage >= 2 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                  transform: 'scale(1.5)'
                }}
              />
              
              {/* Actual Logo */}
              <motion.div
                initial={{ filter: 'brightness(0)' }}
                animate={{ 
                  filter: stage >= 2 ? 'brightness(1)' : 'brightness(0)'
                }}
                transition={{ duration: 0.8 }}
                className="relative w-full h-full"
              >
                <Image
                  src="/images/E logo.png"
                  alt="EDOLV Media Logo"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>

              {/* Scanning line effect */}
              <motion.div
                initial={{ top: '0%', opacity: 0 }}
                animate={{ 
                  top: stage >= 2 ? ['0%', '100%'] : '0%',
                  opacity: stage >= 2 ? [0, 1, 0] : 0
                }}
                transition={{ 
                  duration: 1,
                  ease: "easeInOut"
                }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent"
                style={{ filter: 'blur(2px)' }}
              />
            </div>
          </motion.div>

          {/* Company name with reveal effect */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ 
                y: stage >= 3 ? 0 : 100,
                opacity: stage >= 3 ? 1 : 0
              }}
              transition={{ 
                duration: 0.7, 
                ease: [0.22, 1, 0.36, 1]
              }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-200 to-white"
            >
              EDOLV
            </motion.h1>
          </div>

          {/* Tagline with typing effect */}
          <div className="overflow-hidden mb-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ 
                y: stage >= 4 ? 0 : 50,
                opacity: stage >= 4 ? 1 : 0
              }}
              transition={{ 
                duration: 0.5, 
                ease: [0.22, 1, 0.36, 1]
              }}
              className="flex items-center gap-3"
            >
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: stage >= 4 ? 40 : 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="h-[1px] bg-gradient-to-r from-transparent to-primary-400"
              />
              <span className="text-lg md:text-xl font-light tracking-[0.4em] text-primary-300/80">
                MEDIA
              </span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: stage >= 4 ? 40 : 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="h-[1px] bg-gradient-to-l from-transparent to-primary-400"
              />
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: stage >= 4 ? 1 : 0,
              y: stage >= 4 ? 0 : 20
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-silver-400 tracking-wider mb-10"
          >
            Crafting Visual Stories
          </motion.p>

          {/* Loading progress bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: stage >= 4 ? 280 : 0, 
              opacity: stage >= 4 ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
            className="relative h-[2px] bg-slate-800/50 rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: stage >= 5 ? '0%' : '-100%' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-400 to-indigo-400"
            />
            
            {/* Glowing dot at the end of progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 5 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-400"
              style={{
                boxShadow: '0 0 10px rgba(139, 92, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.6)'
              }}
            />
          </motion.div>

          {/* Loading text */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 4 ? 0.6 : 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-xs text-silver-500 tracking-widest uppercase"
          >
            Loading Experience
          </motion.span>
        </div>

        {/* Corner decorations - Video frame style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 3 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-8 left-8"
        >
          <div className="w-16 h-16 border-l-2 border-t-2 border-primary-500/30" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: stage >= 4 ? 1 : 0 }}
            className="absolute top-2 left-2 w-2 h-2 rounded-full bg-red-500"
            style={{ boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)' }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 3 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-8 right-8"
        >
          <div className="w-16 h-16 border-r-2 border-t-2 border-primary-500/30" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 3 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="absolute bottom-8 left-8"
        >
          <div className="w-16 h-16 border-l-2 border-b-2 border-indigo-500/30" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 3 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="absolute bottom-8 right-8"
        >
          <div className="w-16 h-16 border-r-2 border-b-2 border-indigo-500/30" />
        </motion.div>

        {/* Recording indicator */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ 
            opacity: stage >= 4 ? 1 : 0,
            x: stage >= 4 ? 0 : 20
          }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-8 right-1/2 translate-x-1/2 flex items-center gap-2"
        >
          <motion.div
            animate={{ 
              opacity: stage >= 4 ? [1, 0.3, 1] : 0
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-2 h-2 rounded-full bg-red-500"
          />
          <span className="text-xs text-silver-500 font-mono">REC 00:00:00</span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

