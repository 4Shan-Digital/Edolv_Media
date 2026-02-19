'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/Animations';

const testimonials = [
  {
    id: 1,
    name: 'Darpan is Live',
    subscribers: '86.4k Subscribers',
    image: '/images/Testimonials/review1.svg',
    content: 'Edolv Media has been incredible to work with! They understand our vision perfectly and deliver high-quality content every time. Their professionalism and creativity make them a top choice. Highly recommend!',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 2,
    name: 'Gaming Guru',
    subscribers: '1.14M Subscribers',
    image: '/images/Testimonials/review2.jpg',
    content: 'Awesome Work By Whole Team ❤️ Very Professional, Always Projects Done On Time.',
    color: 'from-red-500 to-pink-600',
  },
  {
    id: 3,
    name: 'REBEL PLAYS',
    subscribers: '110k Subscribers',
    image: '/images/Testimonials/review3.jpg',
    content: 'Team Edolv has very talented editors. I\'ve recently started working with them and they haven\'t disappointed me at all. All of their work shows how much efforts they put in and they deliver the content on time as well.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 4,
    name: 'ASLA SARDAR',
    subscribers: '98.9k Subscribers',
    image: '/images/Testimonials/review4.jpg',
    content: 'It\'s great to work with Edolv Media. It\'s been more than six months and never faced any issue with content also they also help to improve my content on youtube and give me ideas what new we can try on youtube. Always provide videos, shorts & thumbnail on time.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 5,
    name: 'curlbury',
    subscribers: '94.6k Subscribers',
    image: '/images/Testimonials/review5.jpg',
    content: 'Love the way they put in alot of efforts via editing to show the best of our content on our channel. They don\'t only do amazing work but make sure to deliver the work on time, which is the best part.',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 6,
    name: 'Gaming with Latifa',
    subscribers: '34.8k Subscribers',
    image: '/images/Testimonials/review6.jpg',
    content: '~ professional ~ good ~ quality work ~ affordable ~ punctual ~ friendly.',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 7,
    name: 'Kiwi Shio',
    subscribers: '28.3k Subscribers',
    image: '/images/Testimonials/review7.jpg',
    content: 'I feel that joining Edolv has made my youtube journey a lot easier as they provide all the convenience for the creator along with amazing coordination ! The editing team is very talented and the management team is polite and helpful , always ready to help with everything i need- The pricing is reasonable and the outputs are commendable !',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 8,
    name: 'DemondproX Gaming',
    subscribers: '22k Subscribers',
    image: '/images/Testimonials/review8.jpg',
    content: 'Edolv has been amazing to work with! Their creativity and attention to detail really stand out. They consistently deliver top-tier work that aligns perfectly with my brand. Highly recommend their services!',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 9,
    name: 'AshX',
    subscribers: '20.3k Subscribers',
    image: '/images/Testimonials/review9.jpg',
    content: 'Working with Edolv Media has been fantastic! Their team is efficient, creative, and delivers outstanding results every time. Highly recommend them for all your digital needs!',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 10,
    name: 'Gaming MagZ',
    subscribers: '18.4k Subscribers',
    image: '/images/Testimonials/review10.jpg',
    content: 'Amazing Packages and Top Notch editing at this budget is extremely rare ✔️',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 11,
    name: 'Dynamic Jatt',
    subscribers: '10.4k Subscribers',
    image: '/images/Testimonials/review11.jpg',
    content: '1. On time delivery of videos/thumbnails 2. Best thumbnail editors as far as I have seen till now. 3. Co-operative team to assist me. 4. Management is top-notch as well. 5. Pricing is as good as it can be.',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 12,
    name: 'DORE the PRO',
    subscribers: '6.08k Subscribers',
    image: '/images/Testimonials/review12.jpg',
    content: 'Very good edits , on time video thumbnails are available, discipline staf',
    color: 'from-teal-500 to-cyan-600',
  },
  {
    id: 13,
    name: 'Reckless',
    subscribers: '5.82k Subscribers',
    image: '/images/Testimonials/review13.jpg',
    content: 'Good professional people focused on getting things done in given timeframe.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 14,
    name: 'Darpan Arora Vlogs',
    subscribers: '5.57k Subscribers',
    image: '/images/Testimonials/review14.jpg',
    content: 'Great work, on Time work , Thumbnail and shorts editors are jod.',
    color: 'from-lime-500 to-green-600',
  },
  {
    id: 15,
    name: 'RiGiStar',
    subscribers: '2.02k Subscribers',
    image: '/images/Testimonials/review15.jpg',
    content: 'Experience went well. Edolv doing great in the field of providing editing and YT services. Impressive !!',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 16,
    name: 'Damnguy Plays',
    subscribers: '956 Subscribers',
    image: '/images/Testimonials/review16.jpg',
    content: 'Professional and good working ethics',
    color: 'from-sky-500 to-blue-600',
  },
];

// Position configurations for 5-card layout
const positionConfigs = {
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
} as const;

// Testimonial card component - optimized: removed mouse-tracking 3D, spring animations, floating orbs
function TestimonialCard({
  testimonial,
  position,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  testimonial: typeof testimonials[0];
  position: 'far-left' | 'left' | 'center' | 'right' | 'far-right';
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const isCenter = position === 'center';
  const config = positionConfigs[position];

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      animate={{
        scale: config.scale,
        opacity: config.opacity,
        x: `${config.x}%`,
        y: config.y,
        zIndex: config.zIndex,
        filter: `blur(${config.blur}px)`,
      }}
      transition={{
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`absolute w-full max-w-md ${
        !isCenter ? 'cursor-pointer' : ''
      }`}
    >
      <div className="relative h-[420px]">
        {/* Glassmorphism card */}
        <div className="relative h-full rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-2xl overflow-hidden flex flex-col">
          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-10`}
          />
          <div className="absolute inset-[1px] bg-white/90 backdrop-blur-xl rounded-2xl" />

          {/* Content */}
          <div className="relative p-8 flex flex-col h-full">
            {/* Static gradient orb (no animation) */}
            <div
              className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${testimonial.color} blur-3xl opacity-30`}
            />

            <div className="flex items-center gap-4 mb-6">
              {/* Profile image - static (no floating animation) */}
              <div className="relative flex-shrink-0">
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${testimonial.color} blur-lg opacity-50`}
                />
                <div
                  className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${testimonial.color} p-1`}
                >
                  <div
                    className="w-full h-full rounded-full bg-cover bg-center border-2 border-white"
                    style={{ backgroundImage: `url(${testimonial.image})` }}
                  />
                </div>
                {/* Quote badge */}
                <div
                  className={`absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center shadow-lg`}
                >
                  <Quote className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Channel name and subscribers */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-bold text-gray-900 mb-1.5">
                  {testimonial.name}
                </h4>
                <p
                  className={`text-sm font-semibold bg-gradient-to-r ${testimonial.color} bg-clip-text text-transparent flex items-center gap-1.5`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  {testimonial.subscribers}
                </p>
              </div>
            </div>

            {/* 5 Star Rating - static (no spring animations) */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    isCenter ? 'text-amber-400' : 'text-amber-300'
                  }`}
                  fill="currentColor"
                />
              ))}
            </div>

            {/* Testimonial content */}
            <blockquote className="text-gray-700 text-base leading-relaxed flex-1 overflow-y-auto">
              &ldquo;{testimonial.content}&rdquo;
            </blockquote>

            {/* Center indicator */}
            {isCenter && (
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-white" fill="currentColor" />
              </div>
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
      {/* Static background elements (no framer-motion animations) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-violet-300/30 to-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-rose-300/20 rounded-full blur-3xl" />
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
        <div className="relative max-w-6xl mx-auto">
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
                onMouseEnter={card.position === 'center' ? () => setIsPaused(true) : undefined}
                onMouseLeave={card.position === 'center' ? () => setIsPaused(false) : undefined}
              />
            ))}
          </div>

          {/* Navigation arrows - simplified */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
            <button
              onClick={handlePrev}
              className="pointer-events-auto w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:shadow-xl transition-all shadow-lg active:scale-90"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <button
              onClick={handleNext}
              className="pointer-events-auto w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:shadow-xl transition-all shadow-lg active:scale-90"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive progress dots - simplified */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((testimonial, index) => {
              const isCurrent = index === currentIndex;
              return (
                <button
                  key={testimonial.id}
                  onClick={() => setCurrentIndex(index)}
                  className="relative group"
                >
                  <div
                    className={`rounded-full transition-all duration-300 overflow-hidden ${
                      isCurrent
                        ? `h-3 w-12 bg-gradient-to-r ${testimonial.color}`
                        : 'h-3 w-3 bg-gray-300 group-hover:bg-gray-400'
                    }`}
                  >
                    {isCurrent && !isPaused && (
                      <div
                        className="h-full bg-white/30 rounded-full animate-[progressFill_3s_linear]"
                        key={currentIndex}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

