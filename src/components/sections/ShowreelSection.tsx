'use client';

import { motion } from 'framer-motion';
import { Play, Film, Volume2, Maximize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ScrollReveal } from '@/components/ui/Animations';
import VideoPlayerModal from '@/components/ui/VideoPlayerModal';

interface ShowreelData {
  _id: string;
  title: string;
  description?: string;
  duration: string;
  year: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export default function ShowreelSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showreel, setShowreel] = useState<ShowreelData | null>(null);
  useEffect(() => {
    async function fetchShowreel() {
      try {
        const res = await fetch('/api/showreel');
        const data = await res.json();
        if (data.success && data.data) {
          setShowreel(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch showreel:', err);
      }
    }
    fetchShowreel();
  }, []);

  return (
    <section id="showreel" className="section-padding bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container-custom relative">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-12 md:mb-16">
          {/* Spacing where icon and label were */}
          <div className="mb-12 h-10" />
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Showreel</span>
          </h2>
          <p className="text-lg text-silver-400 max-w-2xl mx-auto">
            A glimpse into our creative journey. From stunning visuals to seamless edits, 
            experience the quality that defines Edolv Media.
          </p>
        </ScrollReveal>

        {/* Video Player */}
        <ScrollReveal delay={0.2}>
          <div className="relative max-w-6xl mx-auto">
            {/* Decorative frame glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary-500/20 via-transparent to-indigo-500/20 blur-xl opacity-60" />
            
            {/* Video container */}
            <motion.div
              className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group border border-white/10"
              onClick={() => setIsPlaying(true)}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              {/* Thumbnail */}
              {!isPlaying ? (
                <>
                  {/* Background image */}
                  <img
                    src={showreel?.thumbnailUrl || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1920&q=80'}
                    alt={showreel?.title || 'Showreel'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-900/20 to-indigo-900/20 group-hover:opacity-75 transition-opacity" />

                  {/* Video frame corner marks */}
                  <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-white/30" />
                  <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-white/30" />
                  <div className="absolute bottom-20 left-6 w-16 h-16 border-l-2 border-b-2 border-white/30" />
                  <div className="absolute bottom-20 right-6 w-16 h-16 border-r-2 border-b-2 border-white/30" />

                  {/* Recording indicator */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-red-500"
                    />
                    <span className="text-xs text-white/70 font-mono">REC</span>
                  </div>

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      {/* Pulse rings */}
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="absolute inset-0 rounded-full bg-white/30"
                      />
                      <motion.div
                        animate={{
                          scale: [1, 1.8, 1],
                          opacity: [0.3, 0, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.4,
                        }}
                        className="absolute inset-0 rounded-full bg-white/20"
                      />
                      
                      {/* Button */}
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-primary-500/40 group-hover:shadow-primary-500/60 transition-shadow">
                        <Play className="w-10 h-10 md:w-14 md:h-14 text-white ml-2" fill="currentColor" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom info bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/90 to-transparent">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-white font-bold text-xl md:text-2xl mb-1">
                          {showreel?.title || 'Edolv Media Showreel'}
                        </h3>
                        <div className="flex items-center gap-4 text-silver-400 text-sm">
                          <span className="flex items-center gap-1">
                            <Film className="w-4 h-4" />
                            {showreel?.duration || '2:30'}
                          </span>
                          <span>Motion Graphics • Editing • VFX</span>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-4">
                        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                          <Volume2 className="w-5 h-5 text-white" />
                        </button>
                        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Progress bar placeholder */}
                    <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '35%' }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Click to play hint */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-20 text-white/60 text-sm flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                    
                  </motion.div>
                </>
              ) : null}
            </motion.div>

            {/* Video Player Modal */}
            <VideoPlayerModal
              isOpen={isPlaying}
              onClose={() => setIsPlaying(false)}
              videoUrl={showreel?.videoUrl || '/videos/showreel.mp4'}
              title={showreel?.title || 'Edolv Media Showreel'}
              duration={showreel?.duration}
              year={showreel?.year}
              description={showreel?.description}
            />

            {/* Side decorations - Film reels */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -right-16 -top-16 w-32 h-32 opacity-10 hidden lg:block"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="50" r="10" fill="currentColor" />
                {[...Array(8)].map((_, i) => (
                  <circle
                    key={i}
                    cx={50 + 25 * Math.cos((i * Math.PI * 2) / 8)}
                    cy={50 + 25 * Math.sin((i * Math.PI * 2) / 8)}
                    r="5"
                    fill="currentColor"
                  />
                ))}
              </svg>
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -left-12 -bottom-12 w-24 h-24 opacity-10 hidden lg:block"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="50" r="10" fill="currentColor" />
              </svg>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Video categories */}
        <ScrollReveal delay={0.4} className="mt-12">
          <div className="flex flex-wrap justify-center gap-4">
            {['Corporate Videos', 'Social Media', 'Motion Graphics', 'Documentaries', 'Music Videos'].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-silver-300 text-sm hover:bg-white/10 hover:border-primary-500/30 transition-all cursor-pointer"
              >
                {category}
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
