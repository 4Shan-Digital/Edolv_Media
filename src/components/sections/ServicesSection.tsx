'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { 
  ArrowRight,
  Check,
  Film,
  Wand2,
  PenTool,
  Share2
} from 'lucide-react';

const services = [
  {
    id: 'video-editing',
    icon: Film,
    title: 'Video Editing',
    description: 'Professional editing that transforms raw footage into compelling stories. We handle everything from basic cuts to complex narrative structures.',
    features: ['Story-driven editing', 'Multi-cam editing', 'Documentary style', 'Seamless transitions', 'Format optimization'],
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    accentColor: '#8b5cf6',
    bgImage: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&q=60',
    number: '01',
  },
  {
    id: 'motion-graphics',
    icon: Wand2,
    title: 'Motion Graphics',
    description: 'Eye-catching animations and visual effects that bring your content to life. From logos to full animated sequences.',
    features: ['2D/3D animation', 'Logo animation', 'Kinetic typography', 'Explainer videos', 'Social animations'],
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    accentColor: '#06b6d4',
    bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=60',
    number: '02',
  },
  {
    id: 'graphic-design',
    icon: PenTool,
    title: 'Graphic Design',
    description: 'Creative visual designs that capture attention and communicate your brand message effectively across all platforms.',
    features: ['Brand identity', 'Poster design', 'Social graphics', 'Thumbnail design', 'Marketing materials'],
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    accentColor: '#f59e0b',
    bgImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=60',
    number: '03',
  },
  {
    id: 'social-media',
    icon: Share2,
    title: 'Social Media Management',
    description: 'Strategic content creation and management to grow your social media presence and engage your audience effectively.',
    features: ['Content strategy', 'Post scheduling', 'Platform optimization', 'Analytics tracking', 'Community engagement'],
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    accentColor: '#10b981',
    bgImage: 'https://images.unsplash.com/photo-1579869847557-1f67382cc158?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    number: '04',
  },
];

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedMobile, setExpandedMobile] = useState<number | null>(null);
  const currentService = services[activeIndex];
  const IconComponent = currentService.icon;

  const handleMobileToggle = (index: number) => {
    setExpandedMobile(expandedMobile === index ? null : index);
  };

  return (
    <section className="relative py-12 md:py-16 bg-silver-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Services</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-base md:text-lg">
              End-to-end video production services tailored to your unique vision.
            </p>
          </motion.div>

          {/* Services Interactive Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Desktop Layout - Hidden on Mobile */}
            <div className="hidden lg:grid lg:grid-cols-[380px_1fr] gap-6 lg:gap-8">
              {/* Left - Service Boxes */}
              <div className="flex flex-col gap-3">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  const isActive = index === activeIndex;
                  return (
                    <motion.button
                      key={service.id}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => setActiveIndex(index)}
                      className={`group relative w-full text-left p-5 rounded-2xl border transition-all duration-500 ${
                        isActive 
                          ? 'bg-white/[0.08] border-white/20 shadow-lg shadow-black/20' 
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10'
                      }`}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Active indicator bar */}
                      <motion.div
                        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b ${service.gradient}`}
                        initial={false}
                        animate={{ 
                          opacity: isActive ? 1 : 0,
                          scaleY: isActive ? 1 : 0.3,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <div className="flex items-center gap-4 pl-3">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                          isActive 
                            ? `bg-gradient-to-br ${service.gradient} shadow-lg`
                            : 'bg-white/[0.06]'
                        }`}>
                          <Icon className={`w-5 h-5 transition-colors duration-300 ${
                            isActive ? 'text-white' : 'text-white/50'
                          }`} />
                        </div>
                        
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-semibold text-base transition-colors duration-300 ${
                              isActive ? 'text-white' : 'text-white/70'
                            }`}>
                              {service.title}
                            </h3>
                            <span className={`text-xs font-mono transition-colors duration-300 ${
                              isActive ? 'text-white/40' : 'text-white/20'
                            }`}>
                              {service.number}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 transition-all duration-300 line-clamp-1 ${
                            isActive ? 'text-white/50' : 'text-white/30'
                          }`}>
                            {service.description}
                          </p>
                        </div>
                        
                        {/* Arrow */}
                        <motion.div
                          animate={{ x: isActive ? 0 : -5, opacity: isActive ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="w-4 h-4 text-white/40" />
                        </motion.div>
                      </div>
                    </motion.button>
                  );
                })}

                {/* View all link */}
                <Link href="/services" className="mt-2">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors pl-5 py-2"
                  >
                    View All Services
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.div>
                </Link>
              </div>

              {/* Right - Service Detail Panel */}
              <div className="relative min-h-[420px] lg:min-h-[480px] rounded-3xl overflow-hidden">
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
                      className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                      style={{ backgroundImage: `url(${currentService.bgImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentService.gradient} opacity-10`} />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                      {/* Service number - large watermark */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="absolute top-6 right-8"
                      >
                        <span className={`text-7xl lg:text-8xl font-bold bg-gradient-to-b ${currentService.gradient} bg-clip-text text-transparent opacity-20`}>
                          {currentService.number}
                        </span>
                      </motion.div>

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
                        <h3 className="text-2xl lg:text-3xl font-bold text-white">
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

                      {/* Features */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-2 mb-8"
                      >
                        {currentService.features.map((feature, idx) => (
                          <motion.span
                            key={feature}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.25 + idx * 0.05 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.08] text-xs text-white/70"
                          >
                            <Check className="w-3 h-3 text-white/50" />
                            {feature}
                          </motion.span>
                        ))}
                      </motion.div>

                      {/* CTA */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link href={`/services#${currentService.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.03, x: 4 }}
                            whileTap={{ scale: 0.97 }}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${currentService.gradient} text-white font-medium text-sm shadow-xl hover:shadow-2xl transition-shadow`}
                          >
                            Learn More
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
                      className={`group relative w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                        isExpanded
                          ? 'bg-white/[0.08] border-white/20 shadow-lg shadow-black/20' 
                          : 'bg-white/[0.02] border-white/[0.06]'
                      }`}
                      layout
                    >
                      {/* Active indicator bar */}
                      <motion.div
                        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b ${service.gradient}`}
                        initial={false}
                        animate={{ 
                          opacity: isExpanded ? 1 : 0,
                          scaleY: isExpanded ? 1 : 0.3,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <div className="flex items-center gap-4 pl-3">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isExpanded
                            ? `bg-gradient-to-br ${service.gradient} shadow-lg`
                            : 'bg-white/[0.06]'
                        }`}>
                          <Icon className={`w-5 h-5 transition-colors duration-300 ${
                            isExpanded ? 'text-white' : 'text-white/50'
                          }`} />
                        </div>
                        
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-semibold text-base transition-colors duration-300 ${
                              isExpanded ? 'text-white' : 'text-white/70'
                            }`}>
                              {service.title}
                            </h3>
                            <span className={`text-xs font-mono transition-colors duration-300 ${
                              isExpanded ? 'text-white/40' : 'text-white/20'
                            }`}>
                              {service.number}
                            </span>
                          </div>
                          {!isExpanded && (
                            <p className="text-xs mt-1 text-white/30 line-clamp-1">
                              {service.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Arrow */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="w-4 h-4 text-white/40" />
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
                            <div className="relative min-h-[360px] rounded-2xl overflow-hidden">
                              {/* Background image with overlay */}
                              <div 
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${service.bgImage})` }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/50" />
                              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-10`} />
                              
                              {/* Content */}
                              <div className="relative z-10 p-6">
                                {/* Service number - watermark */}
                                <div className="absolute top-4 right-4">
                                  <span className={`text-6xl font-bold bg-gradient-to-b ${service.gradient} bg-clip-text text-transparent opacity-15`}>
                                    {service.number}
                                  </span>
                                </div>

                                {/* Description */}
                                <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-lg">
                                  {service.description}
                                </p>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                  {service.features.map((feature) => (
                                    <span
                                      key={feature}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.08] text-xs text-white/70"
                                    >
                                      <Check className="w-3 h-3 text-white/50" />
                                      {feature}
                                    </span>
                                  ))}
                                </div>

                                {/* CTA */}
                                <Link href={`/services#${service.id}`}>
                                  <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${service.gradient} text-white font-medium text-sm shadow-xl`}
                                  >
                                    Learn More
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

              {/* View all link */}
              <Link href="/services" className="mt-2">
                <motion.div
                  className="flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors py-3"
                >
                  View All Services
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
