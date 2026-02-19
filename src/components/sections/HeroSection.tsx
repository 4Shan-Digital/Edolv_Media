'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

const wordReveal = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.15,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const scrollToShowreel = () => {
    const showreelSection = document.getElementById('showreel');
    if (showreelSection) {
      showreelSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const headlineWords = ['Where', 'Creativity', 'Evolves', 'Into', 'Real', 'Growth.'];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video/Image Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/85 to-slate-950/95" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-indigo-900/20" />
      </div>

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      {/* Floating gradient orbs - desktop only */}
      {!isMobile && (
        <>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3], x: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-500/20 to-indigo-500/10 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2], x: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-500/15 to-primary-500/10 blur-3xl"
          />
        </>
      )}

      {/* Static gradient orbs for mobile */}
      {isMobile && (
        <>
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-primary-500/15 to-indigo-500/8 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-blue-500/10 to-primary-500/8 blur-3xl" />
        </>
      )}

      {/* Floating particles - desktop only */}
      {!isMobile && [...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          animate={{
            y: [0, -60, 0],
            x: [0, (i % 2 === 0 ? 20 : -20), 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeInOut',
          }}
          className="absolute w-1 h-1 rounded-full bg-primary-400"
          style={{ left: `${15 + i * 14}%`, top: `${30 + (i % 3) * 20}%` }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 w-full px-6 sm:px-10 md:px-16 lg:px-20 xl:px-28 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Small label */}
            {isMobile ? (
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm text-sm text-white/70">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-indigo-400" />
                  Premium Video Production Studio
                </span>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm text-sm text-white/70">
                  <motion.span 
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-indigo-400"
                  />
                  Premium Video Production Studio
                </span>
              </motion.div>
            )}

            {/* Headline */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight">
                <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-5 lg:gap-x-6">
                  {headlineWords.map((word, i) => {
                    const isGradient = word === 'Creativity' || word === 'Growth.';
                    if (isMobile) {
                      return (
                        <span
                          key={word}
                          className={`inline-block ${
                            isGradient
                              ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-indigo-400'
                              : 'text-white'
                          }`}
                        >
                          {word}
                        </span>
                      );
                    }
                    return (
                      <motion.span
                        key={word}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={wordReveal}
                        className={`inline-block ${
                          isGradient 
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-indigo-400' 
                            : 'text-white'
                        }`}
                      >
                        {word}
                      </motion.span>
                    );
                  })}
                </div>
                {/* Underline */}
                {isMobile ? (
                  <div className="mx-auto mt-3 w-32 md:w-48 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-indigo-500 rounded-full" />
                ) : (
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mt-3 w-32 md:w-48 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-indigo-500 rounded-full origin-center"
                  />
                )}
              </h1>
            </div>

            {/* Subheadline */}
            {isMobile ? (
              <p className="text-base md:text-lg lg:text-xl text-white/55 max-w-2xl mb-12 leading-relaxed">
                We craft compelling visual stories that captivate audiences and elevate brands.
                From concept to final cut, we bring your ideas to life with precision and creativity.
              </p>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-base md:text-lg lg:text-xl text-white/55 max-w-2xl mb-12 leading-relaxed"
              >
                We craft compelling visual stories that captivate audiences and elevate brands. 
                From concept to final cut, we bring your ideas to life with precision and creativity.
              </motion.p>
            )}

            {/* CTA Buttons */}
            {isMobile ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/contact">
                  <button className="px-9 py-4 rounded-full bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-semibold text-lg shadow-lg shadow-primary-500/30 flex items-center gap-2 group">
                    Start Your Project
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <button
                  onClick={scrollToShowreel}
                  className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg flex items-center gap-2 group transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                  </div>
                  Watch Showreel
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 20px 50px rgba(139, 92, 246, 0.5)' }}
                    whileTap={{ scale: 0.97 }}
                    className="px-9 py-4 rounded-full bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-semibold text-lg shadow-lg shadow-primary-500/30 flex items-center gap-2 group"
                  >
                    Start Your Project
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={scrollToShowreel}
                  className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg flex items-center gap-2 group transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                  </div>
                  Watch Showreel
                </motion.button>
              </motion.div>
            )}

            {/* Scrolling text band - CSS-only marquee, works on all devices */}
            {isMobile ? (
              <div className="mt-20 w-full overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap">
                  {[...Array(2)].map((_, idx) => (
                    <div key={idx} className="flex items-center gap-8 mr-8">
                      {['VIDEO EDITING', 'MOTION GRAPHICS', 'COLOR GRADING', 'VFX', 'SOUND DESIGN', 'YOUTUBE', 'CORPORATE'].map((item, i) => (
                        <span key={`${idx}-${i}`} className="flex items-center gap-8 text-sm md:text-base font-medium tracking-[0.2em] text-white/20 uppercase">
                          {item}
                          <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="mt-20 w-full overflow-hidden"
              >
                <div className="flex animate-marquee whitespace-nowrap">
                  {[...Array(2)].map((_, idx) => (
                    <div key={idx} className="flex items-center gap-8 mr-8">
                      {['VIDEO EDITING', 'MOTION GRAPHICS', 'COLOR GRADING', 'VFX', 'SOUND DESIGN', 'YOUTUBE', 'CORPORATE'].map((item, i) => (
                        <span key={`${idx}-${i}`} className="flex items-center gap-8 text-sm md:text-base font-medium tracking-[0.2em] text-white/20 uppercase">
                          {item}
                          <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>


    </section>
  );
}
