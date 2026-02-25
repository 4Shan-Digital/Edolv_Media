'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
  SkipBack,
  SkipForward,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
  category?: string;
  client?: string;
  duration?: string;
  year?: string;
  description?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export default function VideoPlayerModal({
  isOpen,
  onClose,
  videoUrl,
  title,
  category,
  client,
  duration,
  year,
  description,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalDuration, setTotalDuration] = useState('0:00');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
    setShowInfo(false);
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setProgress((current / dur) * 100);
    setCurrentTime(formatTime(current));
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setTotalDuration(formatTime(videoRef.current.duration));
    setIsLoading(false);
  };

  const handleProgress = () => {
    if (!videoRef.current) return;
    const buf = videoRef.current.buffered;
    if (buf.length > 0) {
      setBuffered((buf.end(buf.length - 1) / videoRef.current.duration) * 100);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = clickPosition * videoRef.current.duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          skip(-10);
          break;
        case 'ArrowRight':
          skip(10);
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'Escape':
          onClose();
          break;
        case 'n':
        case 'N':
          if (hasNext && onNext) onNext();
          break;
        case 'p':
        case 'P':
          if (hasPrevious && onPrevious) onPrevious();
          break;
      }
      showControlsTemporarily();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, handlePlayPause, hasNext, hasPrevious, onNext, onPrevious]);

  // Auto-play when modal opens
  useEffect(() => {
    if (isOpen && videoRef.current) {
      setIsPlaying(false);
      setProgress(0);
      setIsLoading(true);
      setShowInfo(true);
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [isOpen, videoUrl]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        onClick={onClose}
      >
        {/* Backdrop with blur */}
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

        {/* Ambient glow behind video */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[80%] h-[60%] bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/10 rounded-3xl blur-3xl" />
        </div>

        {/* Previous button */}
        {hasPrevious && onPrevious && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: 0.4 }}
            onClick={(e) => { e.stopPropagation(); onPrevious(); }}
            className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/15 shadow-lg shadow-black/30 group"
            title="Previous (P)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </motion.button>
        )}

        {/* Next button */}
        {hasNext && onNext && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 0.4 }}
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/15 shadow-lg shadow-black/30 group"
            title="Next (N)"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        )}

        {/* Video Container */}
        <motion.div
          ref={containerRef}
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-6xl lg:max-w-[60%] xl:max-w-[55%] mx-2 sm:mx-4 lg:mx-auto rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
          onClick={(e) => e.stopPropagation()}
          onMouseMove={showControlsTemporarily}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {/* Close button - always visible, responsive safe area */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white hover:text-white transition-all border border-white/20 shadow-lg shadow-black/30"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          {/* Video element */}
          <div className="relative aspect-video bg-black cursor-pointer" onClick={handlePlayPause}>
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onProgress={handleProgress}
              onEnded={() => { setIsPlaying(false); setShowControls(true); }}
              onWaiting={() => setIsLoading(true)}
              onCanPlay={() => setIsLoading(false)}
            />

            {/* Loading spinner */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-white/10" />
                    <Loader2 className="w-16 h-16 text-violet-400 animate-spin absolute inset-0" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Center play/pause indicator on click */}
            <AnimatePresence>
              {!isPlaying && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Pulse ring */}
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute w-24 h-24 rounded-full bg-violet-500/30"
                  />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
                    <Play className="w-9 h-9 text-white ml-1" fill="currentColor" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Title overlay (shown initially) — responsive with safe padding for close btn */}
            <AnimatePresence>
              {showInfo && title && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-0 left-0 right-0 p-4 sm:p-6 pr-14 sm:pr-20 bg-gradient-to-b from-black/80 via-black/50 to-transparent pointer-events-none"
                >
                  {category && (
                    <span className="inline-block px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium bg-violet-500/40 text-violet-100 border border-violet-400/30 backdrop-blur-sm mb-2">
                      {category}
                    </span>
                  )}
                  <h3 className="text-white text-base sm:text-xl font-bold leading-snug line-clamp-1">{title}</h3>
                  {client && (
                    <p className="text-white/50 text-xs sm:text-sm mt-1">{client} {year && `• ${year}`}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom controls */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 sm:pt-16 pb-3 sm:pb-4 px-3 sm:px-4"
                >
                  {/* Progress bar */}
                  <div
                    ref={progressRef}
                    className="group/progress w-full h-1.5 hover:h-2.5 bg-white/20 rounded-full cursor-pointer mb-4 transition-all relative"
                    onClick={handleProgressClick}
                  >
                    {/* Buffered */}
                    <div
                      className="absolute inset-y-0 left-0 bg-white/20 rounded-full transition-all"
                      style={{ width: `${buffered}%` }}
                    />
                    {/* Progress */}
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                    {/* Thumb */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg shadow-black/30 opacity-0 group-hover/progress:opacity-100 transition-opacity"
                      style={{ left: `calc(${progress}% - 8px)` }}
                    />
                  </div>

                  {/* Controls row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Play/Pause */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
                        className="text-white hover:text-violet-300 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" fill="currentColor" />
                        ) : (
                          <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                        )}
                      </button>

                      {/* Skip back */}
                      <button
                        onClick={(e) => { e.stopPropagation(); skip(-10); }}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        <SkipBack className="w-5 h-5" />
                      </button>

                      {/* Skip forward */}
                      <button
                        onClick={(e) => { e.stopPropagation(); skip(10); }}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        <SkipForward className="w-5 h-5" />
                      </button>

                      {/* Volume */}
                      <div className="flex items-center gap-2 group/vol">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                          className="text-white/70 hover:text-white transition-colors"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          onClick={(e) => e.stopPropagation()}
                          className="w-0 group-hover/vol:w-20 transition-all duration-200 accent-violet-400 cursor-pointer"
                        />
                      </div>

                      {/* Time */}
                      <span className="text-white/50 text-xs sm:text-sm font-mono tabular-nums hidden sm:inline">
                        {currentTime} / {totalDuration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Fullscreen */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        {isFullscreen ? (
                          <Minimize className="w-5 h-5" />
                        ) : (
                          <Maximize className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Video info panel below */}
          {(title || description) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="px-4 py-4 sm:px-6 sm:py-5 bg-gradient-to-b from-zinc-900 to-zinc-950 border-t border-white/5"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {category && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/20">
                        {category}
                      </span>
                    )}
                    {duration && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/40 border border-white/10">
                        {duration}
                      </span>
                    )}
                    {year && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/40 border border-white/10">
                        {year}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white text-xl font-bold mb-1 truncate">{title}</h3>
                  {client && <p className="text-white/40 text-sm mb-2">By {client}</p>}
                  {description && (
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-2">{description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
