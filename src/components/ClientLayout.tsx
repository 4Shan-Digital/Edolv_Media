'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import SplashScreen from '@/components/SplashScreen';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ClientLayoutProps {
  children: React.ReactNode;
}

/** Skip splash on mobile / small-screen devices to avoid lag */
function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState<boolean | null>(() => {
    if (typeof window === 'undefined') {
      return pathname === '/';
    }

    if (pathname !== '/' || isMobileDevice()) {
      return false;
    }

    const navEntry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isReload = navEntry?.type === 'reload';
    const hasSeenSplash = sessionStorage.getItem('edolv-splash-seen') === 'true';

    return !hasSeenSplash || isReload;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (pathname !== '/' || isMobileDevice()) {
      setShowSplash(false);
      return;
    }

    const navEntry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isReload = navEntry?.type === 'reload';
    const hasSeenSplash = sessionStorage.getItem('edolv-splash-seen') === 'true';
    const shouldShowSplash = !hasSeenSplash || isReload;

    setShowSplash(shouldShowSplash);
  }, [pathname]);

  const handleSplashComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('edolv-splash-seen', 'true');
    }
    setShowSplash(false);
  };

  // Prefetch portfolio data + thumbnails immediately on home page
  // so everything is in browser cache before user scrolls to portfolio section
  useEffect(() => {
    if (pathname !== '/') return;
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch('/api/portfolio?limit=6', { signal: controller.signal });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          // Preload each thumbnail into browser image cache
          data.data.forEach((item: { thumbnailUrl?: string }) => {
            if (item.thumbnailUrl) {
              const img = new window.Image();
              img.src = item.thumbnailUrl;
            }
          });
        }
      } catch {
        // Silently fail — this is just a prefetch optimization
      }
    })();
    return () => controller.abort();
  }, [pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {showSplash === false && (
        <>
          <Header />
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="min-h-screen"
          >
            {children}
          </motion.main>
          <Footer />
        </>
      )}
    </>
  );
}
