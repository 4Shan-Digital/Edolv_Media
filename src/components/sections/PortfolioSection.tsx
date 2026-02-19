'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Play, ArrowRight, Loader2, Clock, ImageIcon, Film } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/Animations';
import VideoPlayerModal from '@/components/ui/VideoPlayerModal';

interface PortfolioItem {
  _id: string;
  title: string;
  category: string;
  client: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
}

interface ThumbnailItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
}

// Preload thumbnail images into browser cache
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

export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState<'videos' | 'thumbnails'>('videos');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [thumbnailCategories, setThumbnailCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [thumbnailItems, setThumbnailItems] = useState<ThumbnailItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<ThumbnailItem | null>(null);
  const hasPrefetched = useRef(false);

  // Eagerly fetch portfolio data on mount so thumbnails are ready before user scrolls
  useEffect(() => {
    if (hasPrefetched.current) return;
    hasPrefetched.current = true;

    // Fetch categories + portfolio data in parallel immediately
    Promise.all([
      fetch('/api/categories').then((r) => r.json()).catch(() => null),
      fetch('/api/portfolio?limit=6').then((r) => r.json()).catch(() => null),
      fetch('/api/thumbnail-categories').then((r) => r.json()).catch(() => null),
    ]).then(([catData, portData, thumbCatData]) => {
      if (catData?.success) {
        setCategories(['All', ...catData.data.map((c: { name: string }) => c.name)]);
      }
      if (portData?.success) {
        setPortfolioItems(portData.data);
        // Immediately preload all thumbnail images into browser cache
        preloadImages(portData.data);
      }
      if (thumbCatData?.success) {
        setThumbnailCategories(['All', ...thumbCatData.data.map((c: { name: string }) => c.name)]);
      }
      setIsLoading(false);
    });
  }, []);

  // When category changes (after initial load), re-fetch
  useEffect(() => {
    if (!hasPrefetched.current) return; // skip on mount, handled above
    async function fetchPortfolio() {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({ limit: '6' });
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
    }
    if (activeTab === 'videos') {
      fetchPortfolio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, activeTab]);

  // When thumbnail category changes, fetch thumbnails
  useEffect(() => {
    if (!hasPrefetched.current) return;
    if (activeTab !== 'thumbnails') return;
    async function fetchThumbnails() {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({ limit: '6' });
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
    }
    fetchThumbnails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, activeTab]);

  // Reset category when switching tabs
  const handleTabSwitch = (tab: 'videos' | 'thumbnails') => {
    setActiveTab(tab);
    setActiveCategory('All');
  };

  const currentCategories = activeTab === 'videos' ? categories : thumbnailCategories;

  return (
    <section className="section-padding bg-gradient-to-b from-primary-50/40 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Soft background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary-100/60 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-indigo-100/60 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-violet-50/30 to-transparent rounded-full" />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-14">
          
          <h2 className="heading-lg text-silver-900 mb-4">
            Featured <span className="gradient-text">Work</span>
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Explore our latest projects and see how we help brands tell their stories
            through compelling video content.
          </p>
        </ScrollReveal>

        {/* Videos / Thumbnails Tab Switcher */}
        <ScrollReveal delay={0.1} className="flex justify-center mb-8">
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
        <ScrollReveal delay={0.15} className="flex flex-wrap justify-center gap-3 mb-14">
          {currentCategories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white text-silver-600 hover:bg-silver-50 border border-silver-200 hover:border-primary-200 hover:text-primary-600'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </ScrollReveal>

        {/* Content Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : activeTab === 'videos' ? (
          /* ========== VIDEOS TAB ========== */
          portfolioItems.length === 0 ? (
            <div className="text-center py-24">
              <Play className="w-12 h-12 mx-auto mb-4 text-silver-300" />
              <p className="text-silver-500">No portfolio items yet.</p>
            </div>
          ) : (
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              <AnimatePresence mode="popLayout">
                {portfolioItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-silver-100 shadow-soft hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1"
                    onMouseEnter={() => setHoveredItem(item._id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => setSelectedVideo(item)}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] overflow-hidden">
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
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 via-silver-100 to-indigo-100 flex items-center justify-center">
                          <Play className="w-10 h-10 text-silver-300" />
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                      {/* Play Button - appears on hover */}
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{
                          scale: hoveredItem === item._id ? 1 : 0.6,
                          opacity: hoveredItem === item._id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 flex items-center justify-center z-10"
                      >
                        <div className="relative">
                          <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-3 rounded-full bg-white/25"
                          />
                          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl">
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
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-primary-700 backdrop-blur-sm shadow-sm">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Card info */}
                    <div className="p-5">
                      <h3 className="text-silver-900 font-semibold text-lg mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-silver-500 text-sm">{item.client}</p>
                    </div>

                    {/* Bottom accent line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: hoveredItem === item._id ? 1 : 0 }}
                      transition={{ duration: 0.35 }}
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 via-purple-500 to-indigo-500 origin-left"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )
        ) : (
          /* ========== THUMBNAILS TAB ========== */
          thumbnailItems.length === 0 ? (
            <div className="text-center py-24">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-silver-300" />
              <p className="text-silver-500">No thumbnails yet.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-7">
              <AnimatePresence mode="popLayout">
                {thumbnailItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-silver-100 shadow-soft hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1"
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
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 via-silver-100 to-indigo-100 flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-silver-300" />
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                      {/* Category badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-primary-700 backdrop-blur-sm shadow-sm">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Card info */}
                    <div className="p-4">
                      <h3 className="text-silver-900 font-semibold text-base group-hover:text-primary-600 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )
        )}

        {/* View All CTA */}
        <ScrollReveal delay={0.3} className="text-center mt-14">
          <Link href="/portfolio">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(139, 92, 246, 0.15)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-silver-900 font-semibold border-2 border-silver-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-300 group"
            >
              View Full Portfolio
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </ScrollReveal>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.videoUrl || ''}
        title={selectedVideo?.title}
        category={selectedVideo?.category}
        client={selectedVideo?.client}
        duration={selectedVideo?.duration}
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
    </section>
  );
}
