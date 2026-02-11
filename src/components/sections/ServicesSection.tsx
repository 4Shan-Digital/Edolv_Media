'use client';

import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Play, 
  Check,
  Film,
  Wand2,
  Palette,
  Music
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/Animations';

const services = [
  {
    id: 'video-editing',
    icon: Film,
    title: 'Video Editing',
    description: 'Professional editing that transforms raw footage into compelling stories. We handle everything from basic cuts to complex narrative structures.',
    features: ['Story-driven editing', 'Multi-cam editing', 'Documentary style', 'Seamless transitions', 'Format optimization'],
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    bgGradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    number: '01',
  },
  {
    id: 'motion-graphics',
    icon: Wand2,
    title: 'Motion Graphics',
    description: 'Eye-catching animations and visual effects that bring your content to life. From logos to full animated sequences.',
    features: ['2D/3D animation', 'Logo animation', 'Kinetic typography', 'Explainer videos', 'Social animations'],
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    bgGradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    number: '02',
  },
  {
    id: 'color-grading',
    icon: Palette,
    title: 'Color Grading',
    description: 'Cinema-quality color correction and grading that sets the perfect mood and enhances the visual appeal of your content.',
    features: ['Cinematic looks', 'Color matching', 'HDR grading', 'Custom LUTs', 'Skin tone optimization'],
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    bgGradient: 'from-orange-500/20 via-amber-500/10 to-transparent',
    number: '03',
  },
  {
    id: 'sound-design',
    icon: Music,
    title: 'Sound Design',
    description: 'Professional audio editing, mixing, and sound design that perfectly complements your visuals and enhances viewer engagement.',
    features: ['Audio mixing', 'Sound effects', 'Music selection', 'Dialogue enhancement', 'Spatial audio'],
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    bgGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    number: '04',
  },
];

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalServices = services.length;
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      const newIndex = Math.min(
        Math.floor(value * totalServices),
        totalServices - 1
      );
      setActiveIndex(newIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress, totalServices]);

  const currentService = services[activeIndex];
  const IconComponent = currentService.icon;

  return (
    <section 
      ref={containerRef}
      className="relative bg-silver-900"
      style={{ height: `${(totalServices + 0.5) * 60}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 bg-gradient-to-br ${currentService.bgGradient} from-10% via-30%`}
            />
          </AnimatePresence>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${currentService.gradient} opacity-20`}
                animate={{
                  x: [
                    Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                    Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  ],
                  y: [
                    Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                    Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  ],
                  scale: [1, 1.5, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Section header - fixed at top */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center">
          {/* Spacing where badge was */}
          <div className="mb-6 h-8" />
          
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            Our <span className={`bg-gradient-to-r ${currentService.gradient} bg-clip-text text-transparent`}>Services</span>
          </motion.h2>
        </div>

        {/* Progress indicators - Left side */}
        <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-4">
          {services.map((service, index) => (
            <motion.button
              key={service.id}
              onClick={() => {
                const progress = index / totalServices;
                const scrollTarget = containerRef.current!.offsetTop + 
                  (containerRef.current!.scrollHeight - window.innerHeight) * progress;
                window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
              }}
              className="group relative flex items-center gap-3"
              whileHover={{ x: 5 }}
            >
              <motion.div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  index === activeIndex 
                    ? `bg-gradient-to-r ${service.gradient} border-transparent scale-125` 
                    : index < activeIndex 
                      ? 'bg-white/50 border-white/50' 
                      : 'bg-transparent border-white/30'
                }`}
              />
              <span className={`text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                index === activeIndex ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-70 text-white/70'
              }`}>
                {service.title}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Main content */}
        <div className="relative h-full flex items-center justify-center pt-20">
          <div className="container-custom">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 80, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -80, scale: 0.95 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
              >
                {/* Left side - Service Info */}
                <div className="order-2 lg:order-1 text-center lg:text-left">
                  {/* Service number */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="mb-4"
                  >
                    <span className={`text-7xl md:text-8xl font-bold bg-gradient-to-r ${currentService.gradient} bg-clip-text text-transparent opacity-25`}>
                      {currentService.number}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                  >
                    {currentService.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="text-base md:text-lg text-white/70 mb-6 leading-relaxed max-w-lg"
                  >
                    {currentService.description}
                  </motion.p>

                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start"
                  >
                    {currentService.features.map((feature, idx) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + idx * 0.05 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
                      >
                        <Check className={`w-3 h-3 text-white`} />
                        <span className="text-xs text-white/80">{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                    className="flex gap-4 justify-center lg:justify-start"
                  >
                    <Link href={`/services#${currentService.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 rounded-xl bg-gradient-to-r ${currentService.gradient} text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2`}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>

                {/* Right side - Visual */}
                <div className="order-1 lg:order-2 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, rotateY: -20 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                  >
                    {/* Rotating rings */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 -m-6 rounded-full border-2 border-dashed border-white/10"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 -m-12 rounded-full border border-white/5"
                    />

                    {/* Main icon container */}
                    <motion.div
                      animate={{ 
                        y: [0, -8, 0],
                        rotateZ: [0, 1, -1, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className={`relative w-48 h-48 md:w-64 md:h-64 rounded-[3rem] bg-gradient-to-br ${currentService.gradient} p-1 shadow-2xl`}
                    >
                      <div className="w-full h-full rounded-[2.5rem] bg-silver-900/90 backdrop-blur-xl flex items-center justify-center">
                        <IconComponent className="w-20 h-20 md:w-28 md:h-28 text-white/90" strokeWidth={1.5} />
                      </div>

                      {/* Floating sparkle */}
                      <motion.div
                        animate={{ y: [-8, 8, -8], x: [-4, 4, -4] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute -top-3 -right-3 w-12 h-12 rounded-xl bg-gradient-to-br ${currentService.gradient} shadow-lg flex items-center justify-center`}
                      >
                        <Sparkles className="w-6 h-6 text-white" />
                      </motion.div>

                      {/* Play button accent */}
                      <motion.div
                        animate={{ y: [8, -8, 8], x: [4, -4, 4] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                        className="absolute -bottom-3 -left-3 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center"
                      >
                        <Play className="w-4 h-4 text-white fill-white" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Spacing where scroll indicator was */}
        <div className="h-16" />

        {/* Mobile indicator dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
          {services.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'w-6 bg-white' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* View All Services - Bottom right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 right-6 md:right-12 hidden md:block"
        >
          <Link href="/services">
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
            >
              View All Services
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
