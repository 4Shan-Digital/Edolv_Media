'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useAnimationFrame } from 'framer-motion';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

// Real client data from Edolve Media
const clients = [
  {
    name: 'funmolll',
    logo: '/images/Clients_logo/funmolll.png',
    type: 'Influencer',
    subscribers: '14.7k+',
  },
  {
    name: 'Anshika',
    logo: '/images/Clients_logo/anshika.jpg',
    type: 'Influencer',
    subscribers: '124k+',
  },
  {
    name: 'Anubis',
    logo: '/images/Clients_logo/Anubis.jpg',
    type: 'Creator',
    subscribers: '5.1K+',
  },
  {
    name: 'Bandookbaaz',
    logo: '/images/Clients_logo/Bandookbaaz.jpg',
    type: 'Gamer',
    subscribers: '2.3M+',
  },
  {
    name: 'Bixi',
    logo: '/images/Clients_logo/Bixi.jpg',
    type: 'Gamer',
    subscribers: '889K+',
  },
  {
    name: 'Ipreet',
    logo: '/images/Clients_logo/Ipreet.jpg',
    type: 'Streamer',
    subscribers: '492k+',
  },
  {
    name: 'Knickknack',
    logo: '/images/Clients_logo/Knickknack.png',
    type: 'Brand',
    subscribers: '5K+',
  },
  {
    name: 'Mavi',
    logo: '/images/Clients_logo/mavi.jpg',
    type: 'Creator',
    subscribers: '1.25M+',
  },
  {
    name: 'Mystic 69',
    logo: '/images/Clients_logo/Mystic 69.jpg',
    type: 'Gaming',
    subscribers: '23.6k+',
  },
  {
    name: 'Piyush',
    logo: '/images/Clients_logo/Piyush.jpg',
    type: 'Podcast',
    subscribers: '1.27k+',
  },
  {
    name: 'Prateek',
    logo: '/images/Clients_logo/Prateek.jpg',
    type: 'Travel Vlogger',
    subscribers: '780K+',
  },
  {
    name: 'Qayzer',
    logo: '/images/Clients_logo/Qayzer.jpg',
    type: 'Gamer',
    subscribers: '107k+',
  },
  {
    name: 'Raghav',
    logo: '/images/Clients_logo/Raghav.jpg',
    type: 'Content Creator',
    subscribers: '592+',
  },
  {
    name: 'Sharmila',
    logo: '/images/Clients_logo/Sharmila .jpg',
    type: 'Doctor',
    subscribers: '12.4K+',
  },
  {
    name: 'Souvik',
    logo: '/images/Clients_logo/Souvik.jpg',
    type: 'Gamer',
    subscribers: '668k+',
  },
  {
    name: 'Mamba',
    logo: '/images/Clients_logo/unnamed.jpg',
    type: 'Streamer',
    subscribers: '1.5M+',
  },
  {
    name: 'Antaryami Gaming',
    logo: '/images/Clients_logo/Antaryami.jpeg',
    type: 'Streamer',
    subscribers: '4.05M+',
  },
  {
    name: 'Varun Keshwani',
    logo: '/images/Clients_logo/Varun keshwani.png',
    type: 'Vlogger',
    subscribers: '265k+',
  },
  {
    name: 'Xyaa',
    logo: '/images/Clients_logo/Xyaa.jpg',
    type: 'Streamer',
    subscribers: '660k+',
  },
  {
    name: 'Yassine',
    logo: '/images/Clients_logo/Yassine.jpg',
    type: 'Doctor',
    subscribers: '188k+',
  },
];

// Split clients into different orbit rings based on total count
const innerRing = clients.slice(0, 6);
const middleRing = clients.slice(6, 13);
const outerRing = clients.slice(13, 20);

// Stats data
const stats = [
  { value: 20000, suffix: '+', label: 'Projects Completed' },
  { value: 400, suffix: '+', label: 'Happy Clients' },
  { value: 3, suffix: '+', label: 'Years Experience' },
  { value: 60, suffix: 'M+', label: 'Views Generated' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function ClientsSection() {
  const [isOrbitPaused, setIsOrbitPaused] = useState(false);
  const [activeClient, setActiveClient] = useState<string | null>(null);
  const [activeRing, setActiveRing] = useState<'inner' | 'middle' | 'outer' | null>(null);
  const [hoveredClient, setHoveredClient] = useState<string | null>(null);
  const [hoveredRing, setHoveredRing] = useState<'inner' | 'middle' | 'outer' | null>(null);
  const [mobileActiveClient, setMobileActiveClient] = useState<string | null>(null);
  const innerOrbitRotate = useMotionValue(0);
  const innerLogoRotate = useMotionValue(0);
  const middleOrbitRotate = useMotionValue(0);
  const middleLogoRotate = useMotionValue(0);
  const outerOrbitRotate = useMotionValue(0);
  const outerLogoRotate = useMotionValue(0);

  const getRingZIndex = (ring: 'inner' | 'middle' | 'outer') => {
    const elevatedRing = hoveredRing ?? activeRing;
    if (elevatedRing === ring) return 50;
    if (ring === 'inner') return 30;
    if (ring === 'middle') return 20;
    return 10;
  };

  const handleClientToggle = (name: string, ring: 'inner' | 'middle' | 'outer') => {
    setActiveRing(ring);
    setActiveClient((current) => (current === name ? null : name));
  };

  useAnimationFrame((_, delta) => {
    if (isOrbitPaused) return;

    const innerNext = (innerOrbitRotate.get() + delta * 0.012) % 360;
    const middleNext = (middleOrbitRotate.get() - delta * 0.008) % 360;
    const outerNext = (outerOrbitRotate.get() + delta * 0.006) % 360;

    innerOrbitRotate.set(innerNext);
    innerLogoRotate.set(-innerNext);
    middleOrbitRotate.set(middleNext);
    middleLogoRotate.set(-middleNext);
    outerOrbitRotate.set(outerNext);
    outerLogoRotate.set(-outerNext);
  });

  return (
    <>
      {/* Stats Section - Creative Gradient Shape */}
      <section className="relative py-14 md:py-24 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-700" />
        
        {/* Mesh pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stats-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stats-grid)" />
          </svg>
        </div>

        {/* Floating shapes - CSS only for performance */}
        <div className="absolute top-20 left-[10%] w-24 h-24 rounded-xl bg-white/5 animate-[float1_15s_linear_infinite] hidden md:block" />
        <div className="absolute bottom-20 right-[15%] w-32 h-32 rounded-full bg-white/5 animate-[float2_20s_linear_infinite] hidden md:block" />
        <div className="absolute top-1/2 right-[5%] w-16 h-16 rounded-lg bg-white/5 hidden lg:block animate-[floatY_8s_ease-in-out_infinite]" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-primary-200 text-xs sm:text-base font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 100V50C240 83 480 100 720 100C960 100 1200 83 1440 50V100H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      {/* Clients Section - Light Background */}
      <section className="relative py-10 md:py-16 overflow-hidden bg-gradient-to-b from-silver-50 via-white to-silver-100">
        {/* Background decorations */}
          <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-100/60 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-100/45 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-100/45 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-20"
          >
            
            
            <h2 className="heading-lg text-silver-900 mb-4">
              Creators We've <span className="gradient-text">Worked With</span>
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              From rising stars to industry giants, we've helped hundreds of creators 
              bring their vision to life with stunning video content.
            </p>
          </motion.div>

          {/* Mobile + Tablet: Simple grid (no animations) */}
          <div className="lg:hidden">
            {/* 400+ Happy Clients badge */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 rounded-2xl px-6 py-3 shadow-lg shadow-primary-500/30">
                <div className="flex flex-col items-center leading-none">
                  <span className="text-3xl font-extrabold text-white tracking-tight">400+</span>
                  <span className="text-[11px] font-semibold text-primary-100 tracking-widest uppercase mt-0.5">Happy Clients</span>
                </div>
                <div className="w-px h-10 bg-white/30" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-primary-100 font-medium">Trusted by creators</span>
                  <span className="text-[11px] text-primary-100 font-medium">&amp; brands worldwide</span>
                </div>
              </div>
            </div>

            {/* Selected client detail card */}
            {mobileActiveClient && (() => {
              const found = clients.find(c => c.name === mobileActiveClient);
              if (!found) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  className="mb-4 mx-auto max-w-xs"
                >
                  <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-indigo-500/20" />
                    <div className="relative px-4 py-3 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-primary-400/60 flex-shrink-0">
                        <Image src={found.logo} alt={found.name} width={44} height={44} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                          <p className="font-bold text-sm text-white truncate">{found.name}</p>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="text-slate-300">{found.type}</span>
                          <span className="font-semibold text-primary-300">{found.subscribers}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setMobileActiveClient(null)}
                        className="text-slate-400 hover:text-white transition-colors flex-shrink-0 text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                    <div className="h-0.5 bg-gradient-to-r from-primary-500 via-indigo-500 to-violet-500" />
                  </div>
                </motion.div>
              );
            })()}

            <div className="grid grid-cols-4 gap-3">
              {clients.slice(0, 16).map((client) => (
                <div
                  key={client.name}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setMobileActiveClient(prev => prev === client.name ? null : client.name)}
                >
                  <div className={`w-14 h-14 rounded-full bg-white shadow-md border-2 overflow-hidden p-0.5 transition-all duration-200 ${
                    mobileActiveClient === client.name
                      ? 'border-primary-500 shadow-primary-300/50 shadow-lg scale-110'
                      : 'border-silver-100'
                  }`}>
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={client.logo}
                        alt={client.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-silver-600 mt-1.5 text-center leading-tight line-clamp-1">{client.name}</span>
                </div>
              ))}
            </div>
            {clients.length > 16 && (
              <p className="text-center text-xs text-silver-500 mt-4">
                
              </p>
            )}
          </div>

          {/* Desktop only: Rotating Orbits */}
          <div className="hidden lg:flex relative h-[700px] items-center justify-center">
            {/* Center element */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute z-20 w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-primary-600 via-indigo-600 to-violet-700 p-1 shadow-2xl shadow-primary-500/40"
            >
              <div className="absolute -inset-6 rounded-full bg-primary-500/20 blur-2xl animate-[pulse_3.5s_ease-in-out_infinite]" />
              <div className="absolute -inset-2 rounded-full border border-primary-300/60 animate-[pulse_2.8s_ease-in-out_infinite]" />
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center gap-1">
                <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">400+</span>
                <span className="text-xs md:text-sm text-silver-700 font-semibold tracking-wide">Happy Clients</span>
              </div>
            </motion.div>

            {/* Inner Ring - Rotates clockwise */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full pointer-events-none"
              style={{ zIndex: getRingZIndex('inner') }}
            >
              {/* Ring border */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-300/60" />
              
              <motion.div
                style={{ rotate: innerOrbitRotate }}
                className="relative w-full h-full pointer-events-none"
              >
                {innerRing.map((client, index) => {
                  const angle = (index * 360) / innerRing.length;
                  const radius = 140;
                  const isActive = activeClient === client.name;
                  const shouldShow = isActive || hoveredClient === client.name;
                  return (
                    <div
                      key={client.name}
                      className="absolute"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`,
                      }}
                    >
                      <motion.div
                        className="group relative z-10 pointer-events-auto"
                        style={{ rotate: innerLogoRotate }}
                        whileHover={{ scale: 1.28, zIndex: 40 }}
                        transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
                        onClick={() => handleClientToggle(client.name, 'inner')}
                        onMouseEnter={() => {
                          setIsOrbitPaused(true);
                          setHoveredRing('inner');
                          setHoveredClient(client.name);
                        }}
                        onMouseLeave={() => {
                          setIsOrbitPaused(false);
                          setHoveredRing(null);
                          setHoveredClient(null);
                        }}
                      >
                        {/* Hover ring */}
                        <div className="absolute -inset-1 rounded-full border border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-silver-800 to-silver-900 shadow-xl border-2 border-silver-700 overflow-hidden cursor-pointer p-0.5 transition-shadow duration-300 group-hover:shadow-[0_0_18px_rgba(99,102,241,0.45)]">
                          <div className="w-full h-full rounded-full overflow-hidden bg-white">
                            <Image
                              src={client.logo}
                              alt={client.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        {/* Enhanced Creative Tooltip Card */}
                        <div
                          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none z-50 transition-all duration-200 ${
                            shouldShow ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
                          }`}
                        >
                          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden min-w-[180px]">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/25 to-indigo-500/25 opacity-60" />
                            <div className="relative px-4 py-3 space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <p className="font-bold text-sm text-white">{client.name}</p>
                              </div>
                              <div className="flex items-center justify-between gap-3 text-xs">
                                <span className="text-slate-300">{client.type}</span>
                                <span className="font-semibold text-primary-300">{client.subscribers}</span>
                              </div>
                            </div>
                            <div className="h-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-violet-500" />
                          </div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700/50" />
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Middle Ring - Rotates counter-clockwise */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute w-[420px] h-[420px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none"
              style={{ zIndex: getRingZIndex('middle') }}
            >
              {/* Ring border */}
              <div className="absolute inset-0 rounded-full border border-indigo-300/50" />
              
              <motion.div
                style={{ rotate: middleOrbitRotate }}
                className="relative w-full h-full pointer-events-none"
              >
                {middleRing.map((client, index) => {
                  const angle = (index * 360) / middleRing.length + 22.5;
                  const radius = 210;
                  const isActive = activeClient === client.name;
                  const shouldShow = isActive || hoveredClient === client.name;
                  return (
                    <div
                      key={client.name}
                      className="absolute"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`,
                      }}
                    >
                      <motion.div
                        className="group relative z-10 pointer-events-auto"
                        style={{ rotate: middleLogoRotate }}
                        whileHover={{ scale: 1.18, zIndex: 30 }}
                        transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
                        onClick={() => handleClientToggle(client.name, 'middle')}
                        onMouseEnter={() => {
                          setIsOrbitPaused(true);
                          setHoveredRing('middle');
                          setHoveredClient(client.name);
                        }}
                        onMouseLeave={() => {
                          setIsOrbitPaused(false);
                          setHoveredRing(null);
                          setHoveredClient(null);
                        }}
                      >
                        {/* Hover ring */}
                        <div className="absolute -inset-1 rounded-full border border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-silver-800 to-silver-900 shadow-xl border-2 border-silver-700 overflow-hidden cursor-pointer p-0.5 transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.45)]">
                          <div className="w-full h-full rounded-full overflow-hidden bg-white">
                            <Image
                              src={client.logo}
                              alt={client.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        {/* Enhanced Creative Tooltip Card */}
                        <div
                          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none z-50 transition-all duration-200 ${
                            shouldShow ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
                          }`}
                        >
                          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden min-w-[180px]">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 opacity-50" />
                            <div className="relative px-4 py-3 space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <p className="font-bold text-sm text-white">{client.name}</p>
                              </div>
                              <div className="flex items-center justify-between gap-3 text-xs">
                                <span className="text-slate-300">{client.type}</span>
                                <span className="font-semibold text-indigo-300">{client.subscribers}</span>
                              </div>
                            </div>
                            {/* Bottom accent */}
                            <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
                          </div>
                          {/* Arrow */}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700/50" />
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Outer Ring - Rotates clockwise slower */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute w-[560px] h-[560px] md:w-[660px] md:h-[660px] rounded-full pointer-events-none"
              style={{ zIndex: getRingZIndex('outer') }}
            >
              {/* Ring border */}
              <div className="absolute inset-0 rounded-full border border-dashed border-violet-300/40" />
              
              <motion.div
                style={{ rotate: outerOrbitRotate }}
                className="relative w-full h-full pointer-events-none"
              >
                {outerRing.map((client, index) => {
                  const angle = (index * 360) / outerRing.length + 45;
                  const radius = 280;
                  const isActive = activeClient === client.name;
                  const shouldShow = isActive || hoveredClient === client.name;
                  return (
                    <div
                      key={client.name}
                      className="absolute"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`,
                      }}
                    >
                      <motion.div
                        className="group relative z-10 pointer-events-auto"
                        style={{ rotate: outerLogoRotate }}
                        whileHover={{ scale: 1.12, zIndex: 20 }}
                        transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
                        onClick={() => handleClientToggle(client.name, 'outer')}
                        onMouseEnter={() => {
                          setIsOrbitPaused(true);
                          setHoveredRing('outer');
                          setHoveredClient(client.name);
                        }}
                        onMouseLeave={() => {
                          setIsOrbitPaused(false);
                          setHoveredRing(null);
                          setHoveredClient(null);
                        }}
                      >
                        {/* Hover ring */}
                        <div className="absolute -inset-1 rounded-full border border-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-silver-800 to-silver-900 shadow-xl border-2 border-silver-700 overflow-hidden cursor-pointer p-0.5 transition-shadow duration-300 group-hover:shadow-[0_0_18px_rgba(124,58,237,0.45)]">
                          <div className="w-full h-full rounded-full overflow-hidden bg-white">
                            <Image
                              src={client.logo}
                              alt={client.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        {/* Enhanced Creative Tooltip Card */}
                        <div
                          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none z-50 transition-all duration-200 ${
                            shouldShow ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
                          }`}
                        >
                          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden min-w-[180px]">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 opacity-50" />
                            <div className="relative px-4 py-3 space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <p className="font-bold text-sm text-white">{client.name}</p>
                              </div>
                              <div className="flex items-center justify-between gap-3 text-xs">
                                <span className="text-slate-300">{client.type}</span>
                                <span className="font-semibold text-violet-300">{client.subscribers}</span>
                              </div>
                            </div>
                            {/* Bottom accent */}
                            <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
                          </div>
                          {/* Arrow */}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700/50" />
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Decorative sparkles - CSS only, reduced count */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-[sparkle_3s_ease-in-out_infinite]"
                style={{
                  left: `${25 + i * 15}%`,
                  top: `${25 + i * 12}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              >
                <Sparkles className="w-4 h-4 text-primary-400/40" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
