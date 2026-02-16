'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
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
    bgImage: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&q=60',
    number: '01',
  },
  {
    id: 'motion-graphics',
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
    bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=60',
    number: '02',
  },
  {
    id: 'color-grading',
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
    bgImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=60',
    number: '03',
  },
  {
    id: 'sound-design',
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
    bgImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=60',
    number: '04',
  },
  {
    id: 'vfx',
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
    bgImage: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=800&q=60',
    number: '05',
  },
  {
    id: 'social-media',
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
    bgImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=60',
    number: '06',
  },
  {
    id: 'corporate',
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
    gradient: 'from-slate-400 via-gray-400 to-zinc-400',
    bgImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=60',
    number: '07',
  },
  {
    id: 'youtube',
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
    bgImage: 'https://plus.unsplash.com/premium_photo-1683287925874-f8b46c6437ae?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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

// Interactive Services Section Component with hover-based navigation
function InteractiveServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedMobile, setExpandedMobile] = useState<number | null>(null);
  const currentService = services[activeIndex];
  const IconComponent = currentService.icon;

  const handleMobileToggle = (index: number) => {
    setExpandedMobile(expandedMobile === index ? null : index);
  };

  return (
    <section className="relative py-20 md:py-28 bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout - Hidden on Mobile */}
          <div className="hidden lg:grid lg:grid-cols-[340px_1fr] gap-6 lg:gap-8">
            {/* Left - Service Boxes */}
            <div className="flex flex-col gap-2">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isActive = index === activeIndex;
                return (
                  <motion.button
                    key={service.id}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    className={`group relative w-full text-left p-4 rounded-xl border transition-all duration-400 ${
                      isActive 
                        ? 'bg-white/[0.08] border-white/20 shadow-lg shadow-black/20' 
                        : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10'
                    }`}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Active indicator bar */}
                    <motion.div
                      className={`absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-gradient-to-b ${service.gradient}`}
                      initial={false}
                      animate={{ 
                        opacity: isActive ? 1 : 0,
                        scaleY: isActive ? 1 : 0.3,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="flex items-center gap-3.5 pl-2.5">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                        isActive 
                          ? `bg-gradient-to-br ${service.gradient} shadow-lg`
                          : 'bg-white/[0.06]'
                      }`}>
                        <Icon className={`w-4 h-4 transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-white/50'
                        }`} />
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold text-sm transition-colors duration-300 ${
                            isActive ? 'text-white' : 'text-white/60'
                          }`}>
                            {service.title}
                          </h3>
                          <span className={`text-[10px] font-mono transition-colors duration-300 ${
                            isActive ? 'text-white/40' : 'text-white/15'
                          }`}>
                            {service.number}
                          </span>
                        </div>
                        <p className={`text-[11px] mt-0.5 transition-all duration-300 line-clamp-1 ${
                          isActive ? 'text-white/40' : 'text-white/25'
                        }`}>
                          {service.shortDesc}
                        </p>
                      </div>
                      
                      {/* Arrow */}
                      <motion.div
                        animate={{ x: isActive ? 0 : -5, opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                      </motion.div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Right - Service Detail Panel */}
            <div className="relative min-h-[520px] lg:min-h-[580px] rounded-3xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  {/* Background image with overlay */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${currentService.bgImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/50" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${currentService.gradient} opacity-10`} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                    {/* Service number - large watermark */}
                    <div className="absolute top-6 right-8">
                      <span className={`text-8xl lg:text-9xl font-bold bg-gradient-to-b ${currentService.gradient} bg-clip-text text-transparent opacity-15`}>
                        {currentService.number}
                      </span>
                    </div>

                    {/* Icon and title */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mb-4"
                    >
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${currentService.gradient} shadow-lg mb-4`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                        {currentService.title}
                      </h3>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-white/60 text-sm lg:text-base leading-relaxed mb-6 max-w-lg"
                    >
                      {currentService.description}
                    </motion.p>

                    {/* Features grid */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="grid grid-cols-2 gap-2 mb-8 max-w-xl"
                    >
                      {currentService.features.map((feature, idx) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25 + idx * 0.04 }}
                          className="flex items-center gap-2"
                        >
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${currentService.gradient} flex items-center justify-center flex-shrink-0`}>
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                          <span className="text-xs text-white/70">{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ scale: 1.03, x: 4 }}
                          whileTap={{ scale: 0.97 }}
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${currentService.gradient} text-white font-medium text-sm shadow-xl hover:shadow-2xl transition-shadow`}
                        >
                          Get Started
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile/Tablet Accordion Layout */}
          <div className="lg:hidden flex flex-col gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isExpanded = expandedMobile === index;
              return (
                <motion.div
                  key={service.id}
                  layout
                  className="relative"
                >
                  {/* Service Card Header */}
                  <motion.button
                    onClick={() => handleMobileToggle(index)}
                    className={`group relative w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                      isExpanded
                        ? 'bg-white/[0.08] border-white/20 shadow-lg shadow-black/20' 
                        : 'bg-white/[0.02] border-white/[0.05]'
                    }`}
                    layout
                  >
                    {/* Active indicator bar */}
                    <motion.div
                      className={`absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-gradient-to-b ${service.gradient}`}
                      initial={false}
                      animate={{ 
                        opacity: isExpanded ? 1 : 0,
                        scaleY: isExpanded ? 1 : 0.3,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="flex items-center gap-3.5 pl-2.5">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isExpanded
                          ? `bg-gradient-to-br ${service.gradient} shadow-lg`
                          : 'bg-white/[0.06]'
                      }`}>
                        <Icon className={`w-4 h-4 transition-colors duration-300 ${
                          isExpanded ? 'text-white' : 'text-white/50'
                        }`} />
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold text-sm transition-colors duration-300 ${
                            isExpanded ? 'text-white' : 'text-white/60'
                          }`}>
                            {service.title}
                          </h3>
                          <span className={`text-[10px] font-mono transition-colors duration-300 ${
                            isExpanded ? 'text-white/40' : 'text-white/15'
                          }`}>
                            {service.number}
                          </span>
                        </div>
                        {!isExpanded && (
                          <p className="text-[11px] mt-0.5 text-white/25 line-clamp-1">
                            {service.shortDesc}
                          </p>
                        )}
                      </div>
                      
                      {/* Arrow */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                      </motion.div>
                    </div>
                  </motion.button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4">
                          <div className="relative min-h-[400px] rounded-2xl overflow-hidden">
                            {/* Background image with overlay */}
                            <div 
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url(${service.bgImage})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/88 to-slate-950/55" />
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-10`} />
                            
                            {/* Content */}
                            <div className="relative z-10 p-6">
                              {/* Service number - watermark */}
                              <div className="absolute top-4 right-4">
                                <span className={`text-7xl font-bold bg-gradient-to-b ${service.gradient} bg-clip-text text-transparent opacity-15`}>
                                  {service.number}
                                </span>
                              </div>

                              {/* Description */}
                              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-lg">
                                {service.description}
                              </p>

                              {/* Features */}
                              <div className="grid grid-cols-1 gap-2 mb-6">
                                {service.features.map((feature) => (
                                  <div
                                    key={feature}
                                    className="flex items-center gap-2"
                                  >
                                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center flex-shrink-0`}>
                                      <Check className="w-2.5 h-2.5 text-white" />
                                    </div>
                                    <span className="text-xs text-white/70">{feature}</span>
                                  </div>
                                ))}
                              </div>

                              {/* CTA */}
                              <Link href="/contact">
                                <motion.button
                                  whileTap={{ scale: 0.97 }}
                                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${service.gradient} text-white font-medium text-sm shadow-xl`}
                                >
                                  Get Started
                                  <ArrowRight className="w-4 h-4" />
                                </motion.button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
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
          </ScrollReveal>
        </div>
      </section>

      {/* Interactive Hover Services Section */}
      <InteractiveServicesSection />

      {/* Process Section - Zigzag Layout */}
      <section className="py-16 md:py-20 bg-white overflow-hidden">
        <div className="container-custom">
          <ScrollReveal className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-sm text-primary-700 font-medium mb-4">
              Our Process
            </span>
            <h2 className="heading-lg text-silver-900 mb-3">
              How We <span className="gradient-text">Work</span>
            </h2>
            <p className="text-body max-w-xl mx-auto">
              Our streamlined process ensures efficient delivery without compromising on quality.
            </p>
          </ScrollReveal>

          <div className="max-w-6xl mx-auto space-y-6 md:space-y-0">
            {processSteps.map((step, index) => {
              const isEven = index % 2 === 0;
              const colors = [
                { bg: 'from-violet-500 to-purple-600', light: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
                { bg: 'from-cyan-500 to-blue-600', light: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
                { bg: 'from-amber-500 to-orange-600', light: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
                { bg: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
                { bg: 'from-pink-500 to-rose-600', light: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
              ];
              const color = colors[index % colors.length];

              return (
                <ScrollReveal
                  key={step.step}
                  delay={index * 0.1}
                  direction={isEven ? 'left' : 'right'}
                >
                  <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                    {/* Step Card */}
                    <motion.div
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`flex-1 relative p-6 md:p-8 rounded-2xl border ${color.border} ${color.light} hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-start gap-5">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${color.bg} flex items-center justify-center shadow-lg`}>
                          <span className="text-xl font-bold text-white">{step.step}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-silver-900 mb-2">{step.title}</h3>
                          <p className="text-silver-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Connector - visible on md+ */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden md:flex items-center justify-center w-10 flex-shrink-0">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          className={`w-3 h-3 rounded-full bg-gradient-to-br ${color.bg}`}
                        />
                      </div>
                    )}

                    {/* Spacer for zigzag alignment */}
                    <div className="hidden md:block flex-1" />
                  </div>

                  {/* Mobile connector arrow */}
                  {index < processSteps.length - 1 && (
                    <div className="flex md:hidden justify-center py-2">
                      <motion.div
                        animate={{ y: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`w-8 h-8 rounded-full ${color.light} flex items-center justify-center`}
                      >
                        <ArrowRight className={`w-4 h-4 ${color.text} rotate-90`} />
                      </motion.div>
                    </div>
                  )}
                </ScrollReveal>
              );
            })}
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
