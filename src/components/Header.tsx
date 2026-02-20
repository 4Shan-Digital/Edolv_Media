'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const isScrolled = true; // Always use dark navbar style on all pages
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 animate-header-slide-down',
          isScrolled
            ? 'py-3 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-700/80 backdrop-blur-xl shadow-soft border-b border-white/10'
            : 'py-5 bg-transparent'
        )}
      >
        <nav className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2"
            >
              {/* Logo Image */}
              <div className={cn(
                "relative w-12 h-12 md:w-14 md:h-14 transition-all duration-300 scale-[1.8] md:scale-[2]",
                isScrolled && "drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
              )}>
                <Image
                  src="/images/E logo.png"
                  alt="Edolv Media"
                  fill
                  className={cn(
                    "object-contain transition-all duration-300",
                    isScrolled && "[filter:drop-shadow(0_0_2px_rgba(0,0,0,0.75))]"
                  )}
                  priority
                />
              </div>
              {/* Logo Text */}
              <div className="flex flex-col items-center leading-none">
                <span className={cn(
                  "text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300",
                  isScrolled ? "text-white" : "text-silver-800"
                )}>
                  EDOLV
                </span>
                <span className={cn(
                  "text-[9px] md:text-[11px] font-medium tracking-[0.3em] mt-0 transition-colors duration-300",
                  isScrolled ? "text-silver-300" : "text-silver-500"
                )}>
                  MEDIA
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-[15px] font-medium transition-colors duration-300 rounded-lg',
                  pathname === link.href
                    ? (isScrolled ? 'text-white' : 'text-primary-600')
                    : (isScrolled ? 'text-slate-200 hover:text-white' : 'text-silver-600 hover:text-primary-600')
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    className={cn(
                      "absolute inset-0 rounded-lg -z-10",
                      isScrolled ? 'bg-white/10' : 'bg-primary-50'
                    )}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-sm"
              >
                Get Started
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative z-10 p-2 -mr-2"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className={cn('w-6 h-6', isScrolled ? 'text-white' : 'text-silver-700')} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className={cn('w-6 h-6', isScrolled ? 'text-white' : 'text-silver-700')} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-soft-xl"
            >
              <div className="flex flex-col h-full pt-24 pb-8 px-6">
                {/* Nav Links */}
                <nav className="flex-1 space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center justify-between py-4 px-4 rounded-xl text-lg font-medium transition-all duration-300',
                          pathname === link.href
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-silver-700 hover:text-primary-600 hover:bg-silver-50'
                        )}
                      >
                        {link.label}
                        <ChevronRight className={cn(
                          'w-5 h-5 transition-transform duration-300',
                          pathname === link.href ? 'text-primary-400' : 'text-silver-300'
                        )} />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-6 border-t border-silver-100"
                >
                  <Link href="/contact" className="block">
                    <button className="w-full btn-primary py-4 text-lg">
                      Get Started
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

