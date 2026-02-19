'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Play,
  ArrowRight,
  Loader2,
  Clock,
  User,
  Calendar,
  Film,
  ImageIcon,
  Video,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/Animations';
import VideoPlayerModal from '@/components/ui/VideoPlayerModal';

interface PortfolioItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  client: string;
  duration: string;
  year: string;
  thumbnailUrl: string;
  videoUrl: string;
}

interface ThumbnailItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
}

interface ReelItem {
  _id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
}

function preloadImages(items: { thumbnailUrl?: string }[]) {
  items.forEach((item) => {
    if (item.thumbnailUrl) {
      const img = new Image();
      img.src = item.thumbnailUrl;
    }
  });
}

export default function PortfolioPageContent() {
  const [activeTab, setActiveTab] = useState<'videos' | 'thumbnails' | 'reels'>('reels');
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItem | ReelItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<ThumbnailItem | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [thumbnailItems, setThumbnailItems] = useState<ThumbnailItem[]>([]);
  const [reelItems, setReelItems] = useState<ReelItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const initialFetch = useRef(false);

  const fetchAll = useCallback(async () => {
    try {
      const [portData, thumbData, reelData] = await Promise.all([
        fetch('/api/portfolio').then((r) => r.json()).catch(() => null),
        fetch('/api/thumbnails').then((r) => r.json()).catch(() => null),
        fetch('/api/reels').then((r) => r.json()).catch(() => null),
      ]);
      if (portData?.success) {
        setPortfolioItems(portData.data);
        preloadImages(portData.data);
      }
      if (thumbData?.success) setThumbnailItems(thumbData.data);
      if (reelData?.success) {
        setReelItems(reelData.data);
        preloadImages(reelData.data);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialFetch.current) return;
    initialFetch.current = true;
    fetchAll();
  }, [fetchAll]);

  const handleTabSwitch = (tab: 'videos' | 'thumbnails' | 'reels') => {
    setActiveTab(tab);
    setVisibleCount(9);
  };

  const visibleItems = portfolioItems.slice(0, visibleCount);
  const visibleThumbnails = thumbnailItems.slice(0, visibleCount);
  const visibleReels = reelItems.slice(0, visibleCount);

  const selectedAsPortfolio = selectedVideo as PortfolioItem | null;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-6 md:pt-44 md:pb-8 overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-gradient-to-br from-primary-200/40 to-indigo-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-violet-200/30 to-primary-100/20 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative">
          <ScrollReveal className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-silver-900 mb-6 leading-tight"
            >
              Featured <span className="gradient-text">Portfolio</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-silver-500 max-w-2xl mx-auto leading-relaxed"
            >
              Every frame tells a story. Explore our collection of meticulously crafted
              videos, thumbnails, and reels spanning brands, creators, and industries.
            </motion.p>
          </ScrollReveal>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="relative bg-gradient-to-b from-white via-primary-50/20 to-indigo-50/30 pb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-silver-200 to-transparent" />
        </div>

        <div className="container-custom relative">
          {/* Tab Switcher */}
          <ScrollReveal className="flex justify-center mb-10 pt-4">
            <div className="inline-flex items-center bg-white rounded-full border border-silver-200 p-1 shadow-sm">
              {(['reels', 'videos', 'thumbnails'] as const).map((tab) => {
                const Icon = tab === 'reels' ? Video : tab === 'videos' ? Film : ImageIcon;
                const label = tab.charAt(0).toUpperCase() + tab.slice(1);
                return (
                  <button
                    key={tab}
                    onClick={() => handleTabSwitch(tab)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/25'
                        : 'text-silver-600 hover:text-primary-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Loading */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
              <p className="text-silver-400 mt-4 text-sm">Loading projects...</p>
            </div>
          ) : activeTab === 'videos' ? (
            /* VIDEOS */
            portfolioItems.length === 0 ? (
              <div className="text-center py-16">
                <Play className="w-12 h-12 mx-auto mb-4 text-silver-300" />
                <p className="text-silver-500 text-lg">No projects found.</p>
              </div>
            ) : (
              <>
                <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                  <AnimatePresence mode="popLayout">
                    {visibleItems.map((item, index) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.45, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-silver-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 transition-all duration-500"
                        onMouseEnter={() => setHoveredId(item._id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setSelectedVideo(item)}
                      >
                        <div className="relative aspect-video overflow-hidden">
                          {item.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" loading="eager" decoding="async" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-50 via-silver-50 to-indigo-50 flex items-center justify-center">
                              <Play className="w-8 h-8 text-silver-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                          <motion.div
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: hoveredId === item._id ? 1 : 0.6, opacity: hoveredId === item._id ? 1 : 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 flex items-center justify-center z-10"
                          >
                            <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl">
                              <Play className="w-7 h-7 text-primary-600 ml-1" fill="currentColor" />
                            </div>
                          </motion.div>
                          {item.duration && (
                            <div className="absolute bottom-3 right-3 z-10">
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white/90 text-xs font-mono">
                                <Clock className="w-3 h-3" />{item.duration}
                              </span>
                            </div>
                          )}
                          <div className="absolute top-3 left-3 z-10">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-primary-700 border border-white/50 backdrop-blur-sm shadow-sm">{item.category}</span>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-silver-900 font-semibold text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">{item.title}</h3>
                          {item.description && <p className="text-silver-400 text-sm mb-3 line-clamp-2 leading-relaxed">{item.description}</p>}
                          <div className="flex items-center gap-4 text-xs text-silver-400">
                            {item.client && <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{item.client}</span>}
                            {item.year && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{item.year}</span>}
                          </div>
                        </div>
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: hoveredId === item._id ? 1 : 0 }} transition={{ duration: 0.35 }} className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 via-purple-500 to-indigo-500 origin-left" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
                {visibleCount < portfolioItems.length && (
                  <ScrollReveal className="text-center mt-14">
                    <motion.button onClick={() => setVisibleCount((p) => p + 9)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-silver-700 font-medium border-2 border-silver-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-300 group">
                      Load More Projects<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </ScrollReveal>
                )}
              </>
            )
          ) : activeTab === 'thumbnails' ? (
            /* THUMBNAILS */
            thumbnailItems.length === 0 ? (
              <div className="text-center py-16">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-silver-300" />
                <p className="text-silver-500 text-lg">No thumbnails found.</p>
              </div>
            ) : (
              <>
                <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-7">
                  <AnimatePresence mode="popLayout">
                    {visibleThumbnails.map((item, index) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.45, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-silver-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 transition-all duration-500"
                        onClick={() => setLightboxImage(item)}
                      >
                        <div className="relative aspect-video overflow-hidden">
                          {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" loading="eager" decoding="async" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-50 via-silver-50 to-indigo-50 flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-silver-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                          <div className="absolute top-3 left-3 z-10">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-primary-700 border border-white/50 backdrop-blur-sm shadow-sm">{item.category}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-silver-900 font-semibold text-base group-hover:text-primary-600 transition-colors line-clamp-1">{item.title}</h3>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
                {visibleCount < thumbnailItems.length && (
                  <ScrollReveal className="text-center mt-14">
                    <motion.button onClick={() => setVisibleCount((p) => p + 9)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-silver-700 font-medium border-2 border-silver-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-300 group">
                      Load More Thumbnails<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </ScrollReveal>
                )}
              </>
            )
          ) : (
            /* REELS */
            reelItems.length === 0 ? (
              <div className="text-center py-16">
                <Video className="w-12 h-12 mx-auto mb-4 text-silver-300" />
                <p className="text-silver-500 text-lg">No reels found.</p>
              </div>
            ) : (
              <>
                <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-7">
                  <AnimatePresence mode="popLayout">
                    {visibleReels.map((item, index) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.45, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-silver-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 transition-all duration-500"
                        onMouseEnter={() => setHoveredId(item._id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setSelectedVideo(item)}
                      >
                        <div className="relative aspect-[3/4] overflow-hidden">
                          {item.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" loading="eager" decoding="async" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-50 via-silver-50 to-indigo-50 flex items-center justify-center">
                              <Video className="w-8 h-8 text-silver-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                          <motion.div
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: hoveredId === item._id ? 1 : 0.6, opacity: hoveredId === item._id ? 1 : 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 flex items-center justify-center z-10"
                          >
                            <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl">
                              <Play className="w-7 h-7 text-primary-600 ml-1" fill="currentColor" />
                            </div>
                          </motion.div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-silver-900 font-semibold text-base group-hover:text-primary-600 transition-colors line-clamp-1">{item.title}</h3>
                        </div>
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: hoveredId === item._id ? 1 : 0 }} transition={{ duration: 0.35 }} className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 via-purple-500 to-indigo-500 origin-left" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
                {visibleCount < reelItems.length && (
                  <ScrollReveal className="text-center mt-14">
                    <motion.button onClick={() => setVisibleCount((p) => p + 9)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-silver-700 font-medium border-2 border-silver-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-300 group">
                      Load More Reels<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </ScrollReveal>
                )}
              </>
            )
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-700 overflow-hidden">
        <div className="container-custom relative">
          <ScrollReveal className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create <span className="text-primary-200">Something Amazing?</span>
            </h2>
            <p className="text-primary-100/80 text-lg mb-10 leading-relaxed">
              Let&apos;s bring your vision to life. Our team is ready to transform your ideas into stunning video content.
            </p>
            <Link href="/contact">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-primary-700 font-semibold shadow-xl shadow-black/15 hover:shadow-2xl transition-all duration-300 group">
                Start Your Project<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Video / Reel Player Modal */}
      <VideoPlayerModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.videoUrl || ''}
        title={selectedVideo?.title}
        category={selectedAsPortfolio?.category}
        client={selectedAsPortfolio?.client}
        duration={selectedAsPortfolio?.duration}
        year={selectedAsPortfolio?.year}
        description={selectedAsPortfolio?.description}
      />

      {/* Thumbnail Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-5xl w-full max-h-[90vh] cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lightboxImage.imageUrl} alt={lightboxImage.title} className="w-full h-auto max-h-[85vh] object-contain rounded-xl" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                <h3 className="text-white text-lg font-semibold">{lightboxImage.title}</h3>
                <p className="text-white/60 text-sm">{lightboxImage.category}</p>
              </div>
              <button onClick={() => setLightboxImage(null)} className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition">
                &#10005;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
