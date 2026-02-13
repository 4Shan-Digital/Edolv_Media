'use client';

import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { 
  Sparkles,
  ArrowRight,
  Check,
  Play,
  Film,
  Palette,
  Wand2,
  Music,
  Zap,
  Share2,
  Building2,
  Youtube
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/Animations';

const services = [
  {
    id: 'video-editing',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2991/2991195.png',
    icon: Film,
    title: 'Video Editing',
    shortDesc: 'Professional editing that transforms raw footage into compelling stories.',
    description: 'Our expert editors transform your raw footage into polished, engaging content. We handle everything from basic cuts to complex narrative structures, ensuring your message resonates with your audience.',
    features: [
      'Story-driven editing approach',
      'Multi-camera editing',
      'Documentary & narrative styles',
      'Pacing and rhythm optimization',
      'Seamless transitions',
      'Format optimization for all platforms',
    ],
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    bgGradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    accentColor: 'violet',
    number: '01',
  },
  {
    id: 'motion-graphics',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3159/3159310.png',
    icon: Wand2,
    title: 'Motion Graphics',
    shortDesc: 'Eye-catching animations that bring your content to life.',
    description: 'From animated logos to complex visual sequences, our motion graphics team creates stunning animations that capture attention and elevate your brand. We blend creativity with technical precision.',
    features: [
      '2D & 3D animation',
      'Logo & brand animation',
      'Kinetic typography',
      'Explainer video graphics',
      'Social media animations',
      'Broadcast graphics',
    ],
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    bgGradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    accentColor: 'cyan',
    number: '02',
  },
  {
    id: 'color-grading',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3171/3171927.png',
    icon: Palette,
    title: 'Color Grading',
    shortDesc: 'Cinema-quality color that sets the perfect mood.',
    description: 'Professional color grading that transforms your footage. We create cinematic looks, match colors across scenes, and enhance the visual appeal to evoke the right emotions from your audience.',
    features: [
      'Cinematic color looks',
      'Color correction & matching',
      'HDR grading',
      'Custom LUT creation',
      'Skin tone optimization',
      'Day-for-night effects',
    ],
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    bgGradient: 'from-orange-500/20 via-amber-500/10 to-transparent',
    accentColor: 'orange',
    number: '03',
  },
  {
    id: 'sound-design',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3059/3059590.png',
    icon: Music,
    title: 'Sound Design',
    shortDesc: 'Professional audio that enhances your visual story.',
    description: 'Great visuals need great audio. Our sound design services include mixing, sound effects, music selection, and dialogue enhancement to create an immersive audio-visual experience.',
    features: [
      'Professional audio mixing',
      'Sound effects & foley',
      'Music selection & licensing',
      'Dialogue enhancement',
      'Noise reduction',
      'Spatial audio design',
    ],
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    bgGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    accentColor: 'emerald',
    number: '04',
  },
  {
    id: 'vfx',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1584/1584892.png',
    icon: Zap,
    title: 'Visual Effects',
    shortDesc: 'Stunning effects that make the impossible possible.',
    description: 'From subtle enhancements to full CGI integration, our VFX team brings imagination to reality. We use industry-standard tools to create seamless visual effects that amaze.',
    features: [
      'Compositing & green screen',
      'CGI integration',
      'Particle effects',
      'Environment enhancement',
      'Object removal/addition',
      'Digital cleanup',
    ],
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    bgGradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    accentColor: 'pink',
    number: '05',
  },
  {
    id: 'social-media',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
    icon: Share2,
    title: 'Social Media',
    shortDesc: 'Platform-optimized content that drives engagement.',
    description: 'We create scroll-stopping content optimized for each social platform. From TikTok and Reels to YouTube and LinkedIn, we know what works and how to make your content stand out.',
    features: [
      'Platform-specific editing',
      'Vertical & square formats',
      'Trending style adaptations',
      'Caption & subtitle design',
      'Thumbnail creation',
      'Content repurposing',
    ],
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    bgGradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    accentColor: 'blue',
    number: '06',
  },
  {
    id: 'corporate',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    icon: Building2,
    title: 'Corporate Videos',
    shortDesc: 'Professional videos that represent your brand.',
    description: 'From company profiles to training videos, we create professional corporate content that communicates your message effectively while maintaining brand consistency and quality.',
    features: [
      'Company profiles',
      'Training & educational videos',
      'Product demonstrations',
      'Event coverage editing',
      'Testimonial videos',
      'Internal communications',
    ],
    gradient: 'from-slate-500 via-gray-500 to-zinc-500',
    bgGradient: 'from-slate-500/20 via-gray-500/10 to-transparent',
    accentColor: 'slate',
    number: '07',
  },
  {
    id: 'youtube',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
    icon: Youtube,
    title: 'YouTube Production',
    shortDesc: 'End-to-end YouTube content creation.',
    description: 'We help YouTubers and brands create engaging long-form content. From editing to thumbnails, we handle everything needed to grow your channel and keep viewers watching.',
    features: [
      'Engaging long-form edits',
      'Retention-focused pacing',
      'Custom thumbnail design',
      'End screen optimization',
      'Chapter markers',
      'SEO-optimized descriptions',
    ],
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    bgGradient: 'from-red-500/20 via-rose-500/10 to-transparent',
    accentColor: 'red',
    number: '08',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Discovery Call',
    description: 'We start with a detailed consultation to understand your vision, goals, and requirements.',
  },
  {
    step: '02',
    title: 'Project Planning',
    description: 'We create a detailed project timeline, outline deliverables, and establish clear milestones.',
  },
  {
    step: '03',
    title: 'Production',
    description: 'Our team gets to work, keeping you updated with regular progress reports and drafts.',
  },
  {
    step: '04',
    title: 'Review & Revise',
    description: 'We refine the content based on your feedback until it perfectly matches your vision.',
  },
  {
    step: '05',
    title: 'Final Delivery',
    description: 'You receive your polished content in all required formats, ready to publish.',
  },
];

// Scroll-locked Services Section Component
function StickyServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalServices = services.length;
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate which service to show based on scroll progress
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
      style={{ height: `${(totalServices + 0.5) * 50}vh` }}
    >
      {/* Sticky container that stays in view */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          {/* Dynamic gradient background */}
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
          
          {/* Animated particles/orbs */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
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

          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Progress indicators - Left side */}
        <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-4">
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
              <span className={`text-xs font-medium transition-all duration-300 ${
                index === activeIndex ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-70 text-white/70'
              }`}>
                {service.title}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Main content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="container-custom">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -100, scale: 0.9 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
              >
                {/* Left side - Service Info */}
                <div className="order-2 lg:order-1 text-center lg:text-left px-4 lg:px-0">
                  {/* Service number */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-4 lg:mb-6"
                  >
                    <span className={`text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r ${currentService.gradient} bg-clip-text text-transparent opacity-30`}>
                      {currentService.number}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight"
                  >
                    {currentService.title}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-base md:text-lg lg:text-xl text-white/70 mb-6 lg:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0"
                  >
                    {currentService.description}
                  </motion.p>

                  {/* Features grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-8 lg:mb-10 max-w-xl mx-auto lg:mx-0"
                  >
                    {currentService.features.map((feature, idx) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.05 }}
                        className="flex items-start gap-2 lg:gap-3"
                      >
                        <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-gradient-to-r ${currentService.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                        </div>
                        <span className="text-xs md:text-sm text-white/80 text-left">{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <Link href="/contact">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 lg:px-8 py-3 lg:py-4 rounded-2xl bg-gradient-to-r ${currentService.gradient} text-white font-semibold text-base lg:text-lg shadow-2xl hover:shadow-glow transition-all duration-300 flex items-center gap-2 mx-auto lg:mx-0`}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>

                {/* Right side - Visual */}
                <div className="order-1 lg:order-2 flex items-center justify-center px-4 lg:px-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                  >
                    {/* Glowing rings */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className={`absolute inset-0 -m-8 rounded-full border-2 border-dashed opacity-20`}
                      style={{ borderColor: 'currentColor' }}
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      className={`absolute inset-0 -m-16 rounded-full border opacity-10`}
                      style={{ borderColor: 'currentColor' }}
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                      className={`absolute inset-0 -m-24 rounded-full border border-dashed opacity-5`}
                      style={{ borderColor: 'currentColor' }}
                    />

                    {/* Main icon container */}
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotateZ: [0, 2, -2, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className={`relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[4rem] bg-gradient-to-br ${currentService.gradient} p-1 shadow-2xl`}
                    >
                      <div className="w-full h-full rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3.5rem] bg-silver-900/90 backdrop-blur-xl flex items-center justify-center">
                        <IconComponent className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 text-white/90" strokeWidth={1.5} />
                      </div>

                      {/* Floating accent elements */}
                      <motion.div
                        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute -top-3 -right-3 lg:-top-4 lg:-right-4 w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-gradient-to-br ${currentService.gradient} shadow-lg flex items-center justify-center`}
                      >
                        <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </motion.div>

                      <motion.div
                        animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className={`absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center`}
                      >
                        <Play className="w-4 h-4 lg:w-5 lg:h-5 text-white fill-white" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-sm">
            {activeIndex < totalServices - 1 ? 'Scroll to explore' : 'Continue scrolling'}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2`}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`w-1.5 h-1.5 rounded-full bg-gradient-to-b ${currentService.gradient}`}
            />
          </motion.div>
        </motion.div>

        {/* Current service indicator - Mobile */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
          {services.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'w-8 bg-white' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServicesPageContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-mesh" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-1/4 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl"
        />

        <div className="container-custom relative">
          <ScrollReveal className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-700">Our Services</span>
            </span>
            <h1 className="heading-xl text-silver-900 mb-6">
              Comprehensive <span className="gradient-text">Video Production</span> Services
            </h1>
            <p className="text-body text-lg max-w-2xl mx-auto mb-8">
              From concept to final delivery, we offer end-to-end video production services 
              tailored to your unique needs. Let's bring your vision to life.
            </p>
            
            {/* Scroll hint */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-silver-400"
            >
              <span className="text-sm">Scroll to explore services</span>
              <div className="w-6 h-10 rounded-full border-2 border-silver-300 flex items-start justify-center p-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-primary-500"
                />
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* Sticky Scroll Services Section */}
      <StickyServicesSection />

      {/* Process Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block text-sm font-medium text-primary-600 uppercase tracking-wider mb-4">
              Our Process
            </span>
            <h2 className="heading-lg text-silver-900 mb-4">
              How We <span className="gradient-text">Work</span>
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              Our streamlined process ensures efficient delivery without compromising on quality.
            </p>
          </ScrollReveal>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-indigo-500 to-blue-500 hidden md:block" />

            {processSteps.map((step, index) => (
              <ScrollReveal
                key={step.step}
                delay={index * 0.1}
                direction={index % 2 === 0 ? 'left' : 'right'}
              >
                <div className={`relative flex items-center gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Step number */}
                  <div className="hidden md:flex w-1/2 items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-glow"
                    >
                      <span className="text-2xl font-bold text-white">{step.step}</span>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <div className="bg-silver-50 rounded-2xl p-6 hover:shadow-soft transition-shadow">
                      <div className="flex md:hidden items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{step.step}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-silver-900">{step.title}</h3>
                      </div>
                      <h3 className="hidden md:block text-xl font-semibold text-silver-900 mb-2">{step.title}</h3>
                      <p className="text-silver-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-10">
              Let's discuss your project and create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold text-lg shadow-soft-lg hover:shadow-glow-lg transition-all duration-300 flex items-center"
                >
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </Link>
              <Link href="/portfolio">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-transparent text-white font-semibold text-lg border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300 flex items-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  View Our Work
                </motion.button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
