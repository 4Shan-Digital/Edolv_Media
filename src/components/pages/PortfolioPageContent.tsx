'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Play,
  Filter,
  ArrowRight,
  Loader2,
  Clock,
  User,
  Calendar,
  Film,
  ImageIcon,
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

// Pre-load thumbnail images to browser cache for instant display
function preloadImages(items: PortfolioItem[]) {
  items.forEach((item) => {
    if (item.thumbnailUrl) {
      const img = new Image();
      img.src = item.thumbnailUrl;
    }
  });
}

function preloadThumbnailImages(items: ThumbnailItem[]) {
  items.forEach((item) => {
    if (item.imageUrl) {
      const img = new Image();
      img.src = item.imageUrl;
    }
  });
}

export default function PortfolioPageContent() {
  const [activeTab, setActiveTab] = useState<'videos' | 'thumbnails'>('videos');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [thumbnailCategories, setThumbnailCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<ThumbnailItem | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [thumbnailItems, setThumbnailItems] = useState<ThumbnailItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const initialFetch = useRef(false);

  // Eagerly fetch both categories and portfolio on mount in parallel
  useEffect(() => {
    if (initialFetch.current) return;
    initialFetch.current = true;

    Promise.all([
      fetch('/api/categories').then((r) => r.json()).catch(() => null),
      fetch('/api/portfolio').then((r) => r.json()).catch(() => null),
      fetch('/api/thumbnail-categories').then((r) => r.json()).catch(() => null),
    ]).then(([catData, portData, thumbCatData]) => {
      if (catData?.success) {
        setCategories(['All', ...catData.data.map((c: { name: string }) => c.name)]);
      }
      if (portData?.success) {
        setPortfolioItems(portData.data);
        preloadImages(portData.data);
      }
      if (thumbCatData?.success) {
        setThumbnailCategories(['All', ...thumbCatData.data.map((c: { name: string }) => c.name)]);
      }
      setIsLoading(false);
    });
  }, []);

  const fetchPortfolio = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (activeCategory !== 'All') params.set('category', activeCategory);
      const res = await fetch(`/api/portfolio?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPortfolioItems(data.data);
        preloadImages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  const fetchThumbnails = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (activeCategory !== 'All') params.set('category', activeCategory);
      const res = await fetch(`/api/thumbnails?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setThumbnailItems(data.data);
        preloadThumbnailImages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch thumbnails:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  // Re-fetch when user switches category (skip on initial mount)
  useEffect(() => {
    if (!initialFetch.current) return;
    if (activeTab === 'videos') {
      fetchPortfolio();
    } else {
      fetchThumbnails();
    }
    setVisibleCount(9);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, activeTab]);

  // Reset category when switching tabs
  const handleTabSwitch = (tab: 'videos' | 'thumbnails') => {
    setActiveTab(tab);
    setActiveCategory('All');
    setVisibleCount(9);
  };

  const currentCategories = activeTab === 'videos' ? categories : thumbnailCategories;
  const visibleItems = portfolioItems.slice(0, visibleCount);
  const visibleThumbnails = thumbnailItems.slice(0, visibleCount);

  return (
    <>
      {/* Hero Section - Light elegant gradient */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-gradient-to-br from-primary-200/40 to-indigo-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-violet-200/30 to-primary-100/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-radial from-primary-100/20 to-transparent rounded-full" />
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #8b5cf6 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="container-custom relative">
          <ScrollReveal className="text-center max-w-4xl mx-auto">
           

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-silver-900 mb-6 leading-tight"
            >
              Featured{' '}
              <span className="gradient-text">Portfolio</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-silver-500 max-w-2xl mx-auto leading-relaxed"
            >
              Every frame tells a story. Explore our collection of meticulously crafted
              videos and thumbnails spanning brands, creators, and industries.
            </motion.p>
          </ScrollReveal>
        </div>
      </section>

      {/* Portfolio Grid Section - Light gradient */}
      <section className="relative bg-gradient-to-b from-white via-primary-50/20 to-indigo-50/30 pb-24">
        {/* Very subtle bg texture */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-silver-200 to-transparent" />
          <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-gradient-to-r from-violet-100/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-gradient-to-l from-primary-100/40 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          {/* Videos / Thumbnails Tab Switcher */}
          <ScrollReveal className="flex justify-center mb-8 -mt-2">
            <div className="inline-flex items-center bg-white rounded-full border border-silver-200 p-1 shadow-sm">
              <button
                onClick={() => handleTabSwitch('videos')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'videos'
                    ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/25'
                    : 'text-silver-600 hover:text-primary-600'
                }`}
              >
                <Film className="w-4 h-4" />
                Videos
              </button>
              <button
                onClick={() => handleTabSwitch('thumbnails')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'thumbnails'
                    ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/25'
                    : 'text-silver-600 hover:text-primary-600'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Thumbnails
              </button>
            </div>
          </ScrollReveal>

          {/* Category Filters */}
          <ScrollReveal className="mb-14">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-silver-400 mr-2 hidden sm:block" />
              {currentCategories.map((cat, i) => (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/20 border border-primary-500/30'
                      : 'bg-silver-50 text-silver-600 hover:text-primary-600 hover:bg-primary-50 border border-silver-200 hover:border-primary-200'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {/* Loading */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-silver-200" />
                <Loader2 className="w-16 h-16 text-primary-500 animate-spin absolute inset-0" />
              </div>
              <p className="text-silver-400 mt-4 text-sm">Loading projects...</p>
            </div>
          ) : activeTab === 'videos' ? (
            /* ========== VIDEOS TAB ========== */
            portfolioItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-2xl bg-silver-50 border border-silver-100 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-silver-300" />
                </div>
                <p className="text-silver-500 text-lg">No projects found in this category.</p>
                <p className="text-silver-400 text-sm mt-2">Try selecting a different filter above.</p>
              </div>
            ) : (
              <>
                {/* Grid */}
                <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                  <AnimatePresence mode="popLayout">
                    {visibleItems.map((item, index) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          duration: 0.45,
                          delay: index * 0.06,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-silver-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 transition-all duration-500"
                        onMouseEnter={() => setHoveredId(item._id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setSelectedVideo(item)}
                      >
                        {/* Thumbnail area */}
                        <div className="relative aspect-video overflow-hidden">
                          {item.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                              loading="eager"
                              decoding="async"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-50 via-silver-50 to-indigo-50 flex items-center justify-center">
                              <Play className="w-8 h-8 text-silver-300" />
                            </div>
                          )}

                          {/* Gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                          {/* Purple tint on hover */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoveredId === item._id ? 0.1 : 0 }}
                            className="absolute inset-0 bg-gradient-to-br from-primary-500 to-indigo-500"
                          />

                          {/* Play button */}
                          <motion.div
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{
                              scale: hoveredId === item._id ? 1 : 0.6,
                              opacity: hoveredId === item._id ? 1 : 0,
                            }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 flex items-center justify-center z-10"
                          >
                            <div className="relative">
                              <motion.div
                                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -inset-2 rounded-full bg-white/25"
                              />
                              <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl">
                                <Play className="w-7 h-7 text-primary-600 ml-1" fill="currentColor" />
                              </div>
                            </div>
                          </motion.div>

                          {/* Duration badge */}
                          {item.duration && (
                            <div className="absolute bottom-3 right-3 z-10">
                              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white/90 text-xs font-mono">
                                <Clock className="w-3 h-3" />
                                {item.duration}
                              </span>
                            </div>
                          )}

                          {/* Category badge */}
                          <div className="absolute top-3 left-3 z-10">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-primary-700 border border-white/50 backdrop-blur-sm shadow-sm">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Info section */}
                        <div className="p-5">
                          <h3 className="text-silver-900 font-semibold text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-silver-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-silver-400">
                            {item.client && (
                              <span className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" />
                                {item.client}
                              </span>
                            )}
                            {item.year && (
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {item.year}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom accent line on hover */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: hoveredId === item._id ? 1 : 0 }}
                          transition={{ duration: 0.35 }}
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 via-purple-500 to-indigo-500 origin-left"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Load More */}
                {visibleCount < portfolioItems.length && (
                  <ScrollReveal className="text-center mt-14">
                    <motion.button
                      onClick={() => setVisibleCount((prev) => prev + 9)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-silver-700 font-medium border-2 border-silver-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-300 group"
                    >
                      Load More Projects
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </ScrollReveal>
                )}
              </>
            )
          ) : (
            /* ========== THUMBNAILS TAB ========== */
            thumbnailItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-2xl bg-silver-50 border border-silver-100 flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-silver-300" />
                </div>
                <p className="text-silver-500 text-lg">No thumbnails found in this category.</p>
                <p className="text-silver-400 text-sm mt-2">Try selecting a different filter above.</p>
              </div>
            ) : (
              <>
                {/* Thumbnail Grid */}
                <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-7">
                  <AnimatePresence mode="popLayout">
                    {visibleThumbnails.map((item, index) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          duration: 0.45,
                          delay: index * 0.06,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-silver-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 transition-all duration-500"
                        onClick={() => setLightboxImage(item)}
                      >
                        <div className="relative aspect-video overflow-hidden">
                          {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                              loading="eager"
                              decoding="async"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-50 via-silver-50 to-indigo-50 flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-silver-300" />
                            </div>
                          )}

                          {/* Gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                          {/* Category badge */}
                          <div className="absolute top-3 left-3 z-10">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-primary-700 border border-white/50 backdrop-blur-sm shadow-sm">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Info section */}
                        <div className="p-4">
                          <h3 className="text-silver-900 font-semibold text-base group-hover:text-primary-600 transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Load More */}
                {visibleCount < thumbnailItems.length && (
                  <ScrollReveal className="text-center mt-14">
                    <motion.button
                      onClick={() => setVisibleCount((prev) => prev + 9)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-silver-700 font-medium border-2 border-silver-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-300 group"
                    >
                      Load More Thumbnails
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </ScrollReveal>
                )}
              </>
            )
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-700 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/10 rounded-full blur-3xl"
          />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        <div className="container-custom relative">
          <ScrollReveal className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create{' '}
              <span className="text-primary-200">Something Amazing?</span>
            </h2>
            <p className="text-primary-100/80 text-lg mb-10 leading-relaxed">
              Let&apos;s bring your vision to life. Our team is ready to transform
              your ideas into stunning video content.
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-primary-700 font-semibold shadow-xl shadow-black/15 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 group"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.videoUrl || ''}
        title={selectedVideo?.title}
        category={selectedVideo?.category}
        client={selectedVideo?.client}
        duration={selectedVideo?.duration}
        year={selectedVideo?.year}
        description={selectedVideo?.description}
      />

      {/* Thumbnail Lightbox Modal */}
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
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.title}
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                <h3 className="text-white text-lg font-semibold">{lightboxImage.title}</h3>
                <p className="text-white/60 text-sm">{lightboxImage.category}</p>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
