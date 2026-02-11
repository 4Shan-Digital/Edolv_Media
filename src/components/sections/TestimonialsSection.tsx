'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Quote, Star, Play, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/Animations';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechStart Inc.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    content: 'Edolv Media transformed our brand videos beyond expectations. Their attention to detail and creative approach helped us increase engagement by 300%. Highly recommended!',
    rating: 5,
    project: 'Brand Launch Campaign',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Content Creator',
    company: 'YouTube (2M+ Subscribers)',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    content: 'Working with Edolv Media has been a game-changer for my channel. Their editing quality is unmatched, and they always deliver on time. They truly understand content creation.',
    rating: 5,
    project: 'YouTube Channel Rebrand',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 3,
   name: 'Emily Rodriguez',
    role: 'CEO',
    company: 'GrowthBox Agency',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    content: 'We have partnered with Edolv Media for all our client projects. Their professionalism, creativity, and reliability make them our go-to video production partner.',
    rating: 5,
    project: 'Agency Partnership',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Founder',
    company: 'Wellness Brand Co.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    content: 'The motion graphics and animations Edolv created for our product launch were stunning. They exceeded every expectation and helped us make a massive impact.',
    rating: 5,
    project: 'Product Launch Video',
    color: 'from-emerald-500 to-teal-600',
  },
];

const clientLogos = [
  { name: 'TechStart', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Nike', gradient: 'from-gray-700 to-gray-900' },
  { name: 'Apple', gradient: 'from-gray-600 to-gray-800' },
  { name: 'Google', gradient: 'from-red-500 via-yellow-500 to-green-500' },
  { name: 'Meta', gradient: 'from-blue-600 to-indigo-600' },
];

// Testimonial card component
function TestimonialCard({
  testimonial,
  position,
  onClick,
}: {
  testimonial: typeof testimonials[0];
  position: 'far-left' | 'left' | 'center' | 'right' | 'far-right';
  onClick?: () => void;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), {
    damping: 20,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), {
    damping: 20,
    stiffness: 200,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (position !== 'center') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const isCenter = position === 'center';

  // Position configurations for 5-card layout
  const configs = {
    'far-left': {
      scale: 0.6,
      opacity: 0.3,
      x: -70,
      y: 40,
      blur: 2,
      zIndex: 1,
    },
    left: {
      scale: 0.8,
      opacity: 0.6,
      x: -38,
      y: 20,
      blur: 0.5,
      zIndex: 5,
    },
    center: {
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      blur: 0,
      zIndex: 10,
    },
    right: {
      scale: 0.8,
      opacity: 0.6,
      x: 38,
      y: 20,
      blur: 0.5,
      zIndex: 5,
    },
    'far-right': {
      scale: 0.6,
      opacity: 0.3,
      x: 70,
      y: 40,
      blur: 2,
      zIndex: 1,
    },
  };

  const config = configs[position];

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: config.scale,
        opacity: config.opacity,
        x: `${config.x}%`,
        y: config.y,
        zIndex: config.zIndex,
        filter: `blur(${config.blur}px)`,
      }}
      style={{
        rotateX: isCenter ? rotateX : 0,
        rotateY: isCenter ? rotateY : 0,
      }}
      transition={{
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`absolute w-full max-w-md ${
        !isCenter ? 'cursor-pointer' : ''
      }`}
    >
      <div className="relative">
        {/* Glassmorphism card */}
        <div className="relative rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-2xl overflow-hidden">
          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-10`}
          />
          <div className="absolute inset-[1px] bg-white/90 backdrop-blur-xl rounded-2xl" />

          {/* Content */}
          <div className="relative p-8">
            {/* Floating orb */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${testimonial.color} blur-3xl`}
            />

            <div className="flex items-center gap-4 mb-5">
              {/* Profile image */}
              <motion.div
                animate={{
                  y: isCenter ? [0, -10, 0] : 0,
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative flex-shrink-0"
              >
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${testimonial.color} blur-lg opacity-50`}
                />
                <div
                  className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${testimonial.color} p-0.5`}
                >
                  <div
                    className="w-full h-full rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${testimonial.image})` }}
                  />
                </div>
                {/* Quote badge */}
                <div
                  className={`absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-gradient-to-br ${testimonial.color} flex items-center justify-center shadow-lg`}
                >
                  <Quote className="w-3.5 h-3.5 text-white" />
                </div>
              </motion.div>

              {/* Name and role */}
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <p
                  className={`text-sm font-semibold bg-gradient-to-r ${testimonial.color} bg-clip-text text-transparent`}
                >
                  {testimonial.company}
                </p>
              </div>
            </div>

            {/* Rating stars */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-amber-400 fill-amber-400"
                />
              ))}
            </div>

            {/* Testimonial content */}
            <blockquote className="text-gray-700 text-base leading-relaxed mb-5">
              &ldquo;{testimonial.content}&rdquo;
            </blockquote>

            {/* Project tag */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${testimonial.color} text-white text-sm font-medium shadow-lg`}
            >
              <Play className="w-3.5 h-3.5" fill="currentColor" />
              {testimonial.project}
            </div>

            {/* Center indicator */}
            {isCenter && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
              >
                <Star className="w-5 h-5 text-white" fill="currentColor" />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [hoveredLogo, setHoveredLogo] = useState<number | null>(null);

  const startAutoPlay = useCallback(() => {
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }
    }, 3000);
  }, [isPaused]);

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [isPaused, startAutoPlay]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Get the 5 visible cards
  const getVisibleCards = () => {
    const total = testimonials.length;
    const farLeftIndex = (currentIndex - 2 + total) % total;
    const leftIndex = (currentIndex - 1 + total) % total;
    const rightIndex = (currentIndex + 1) % total;
    const farRightIndex = (currentIndex + 2) % total;

    return [
      { testimonial: testimonials[farLeftIndex], position: 'far-left' as const },
      { testimonial: testimonials[leftIndex], position: 'left' as const },
      { testimonial: testimonials[currentIndex], position: 'center' as const },
      { testimonial: testimonials[rightIndex], position: 'right' as const },
      { testimonial: testimonials[farRightIndex], position: 'far-right' as const },
    ];
  };

  const visibleCards = getVisibleCards();

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-violet-300/30 to-purple-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-rose-300/20 rounded-full blur-3xl"
        />

        {/* Sparkles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
            className="absolute w-1 h-1 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-8">
        

          <h2 className="heading-lg text-gray-900 mb-4">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Real stories from real clients who trusted us with their vision and
            saw extraordinary results.
          </p>
        </ScrollReveal>

        {/* 5-Card Carousel */}
        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="relative h-[550px] flex items-center justify-center"
            style={{ perspective: '2000px' }}
          >
            {visibleCards.map((card) => (
              <TestimonialCard
                key={`${card.testimonial.id}-${card.position}`}
                testimonial={card.testimonial}
                position={card.position}
                onClick={
                  card.position !== 'center'
                    ? card.position === 'left' || card.position === 'far-left'
                      ? handlePrev
                      : handleNext
                    : undefined
                }  
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="pointer-events-auto w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:shadow-xl transition-all shadow-lg"
            >
              <motion.div
                animate={{ x: [-2, 0, -2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </motion.div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="pointer-events-auto w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:shadow-xl transition-all shadow-lg"
            >
              <motion.div
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>

          {/* Interactive progress dots */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((testimonial, index) => {
              const isCurrent = index === currentIndex;
              return (
                <motion.button
                  key={testimonial.id}
                  onClick={() => setCurrentIndex(index)}
                  className="relative group"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={{
                      width: isCurrent ? 48 : 12,
                      height: 12,
                    }}
                    className={`rounded-full transition-all duration-300 overflow-hidden ${
                      isCurrent
                        ? `bg-gradient-to-r ${testimonial.color}`
                        : 'bg-gray-300 group-hover:bg-gray-400'
                    }`}
                  >
                    {isCurrent && (
                      <motion.div
                        className="h-full bg-white/30 rounded-full"
                        initial={{ width: '0%'}}
                        animate={{ width: isPaused ? '0%' : '100%' }}
                        transition={{ duration: 3, ease: 'linear' }}
                        key={currentIndex}
                      />
                    )}
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Client logos with hover effects */}
        <ScrollReveal delay={0.3} className="mt-24">
          <motion.p className="text-center text-sm text-gray-400 mb-10 uppercase tracking-wider font-medium flex items-center justify-center gap-3">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              ✦
            </motion.span>
            Trusted by industry leaders
            <motion.span
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              ✦
            </motion.span>
          </motion.p>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {clientLogos.map((logo, index) => (
              <motion.div
                key={logo.name}
                onHoverStart={() => setHoveredLogo(index)}
                onHoverEnd={() => setHoveredLogo(null)}
                whileHover={{
                  scale: 1.1,
                  y: -5,
                }}
                className="relative group cursor-pointer"
              >
                {/* Glow effect */}
                <motion.div
                  animate={{
                    opacity: hoveredLogo === index ? 1 : 0,
                    scale: hoveredLogo === index ? 1.5 : 1,
                  }}
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${logo.gradient} blur-xl opacity-0 transition-opacity`}
                />

                {/* Logo */}
                <div
                  className={`relative h-12 px-8 flex items-center justify-center rounded-xl bg-gradient-to-r ${logo.gradient} text-white font-bold text-lg shadow-lg transform transition-all`}
                >
                  {logo.name}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

