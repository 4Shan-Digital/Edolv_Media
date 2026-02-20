'use client';

import { motion } from 'framer-motion';
import { 
  Clock, 
  Zap, 
  Shield, 
  Users, 
  Award, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/Animations';

const features = [
  {
    icon: Zap,
    title: 'Fast Turnaround',
    description: 'Quick delivery without compromising quality. We understand time-sensitive projects.',
    gradient: 'from-amber-500 to-orange-600',
    stat: '48hrs',
    statLabel: 'Avg Delivery',
  },
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: 'Unlimited revisions until you\'re 100% satisfied. Your vision is our priority.',
    gradient: 'from-emerald-500 to-teal-600',
    stat: '100%',
    statLabel: 'Satisfaction',
  },
  {
    icon: Users,
    title: 'Dedicated Team',
    description: 'A skilled team of editors, animators, and colorists working on your project.',
    gradient: 'from-blue-500 to-indigo-600',
    stat: '25+',
    statLabel: 'Experts',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock support to address your queries and provide updates.',
    gradient: 'from-violet-500 to-purple-600',
    stat: '24/7',
    statLabel: 'Available',
  },
  {
    icon: Award,
    title: 'Industry Expertise',
    description: '10+ years of experience across various industries and content types.',
    gradient: 'from-pink-500 to-rose-600',
    stat: '10+',
    statLabel: 'Years Exp',
  },
  {
    icon: HeartHandshake,
    title: 'Client-Centric',
    description: 'We treat every project as our own, ensuring personalized attention.',
    gradient: 'from-cyan-500 to-blue-600',
    stat: '500+',
    statLabel: 'Projects',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          
          <h2 className="heading-lg text-white mb-4">
            What Makes Us <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Different</span>
          </h2>
          <p className="text-silver-400 max-w-2xl mx-auto text-lg">
            We combine creativity with technical excellence to deliver exceptional results. 
            Here&apos;s why clients choose Edolv Media for their video production needs.
          </p>
        </ScrollReveal>

        {/* Features Grid */}
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative group h-full"
              >
                {/* Card */}
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-8 h-full border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon & Stat Row */}
                    <div className="flex items-start justify-between mb-3 md:mb-6">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                      >
                        <feature.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                      </motion.div>
                      
                      {/* Stat badge */}
                      <div className="text-right">
                        <span className={`block text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient}`}>
                          {feature.stat}
                        </span>
                        <span className="text-[10px] md:text-xs text-silver-500 uppercase tracking-wider">
                          {feature.statLabel}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-silver-300 transition-all duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-silver-400 text-xs md:text-sm leading-relaxed mb-3 md:mb-6 hidden sm:block">
                      {feature.description}
                    </p>

                    {/* Check mark row */}
                    <div className="hidden sm:flex items-center gap-2 text-sm text-silver-500">
                      <CheckCircle2 className={`w-4 h-4 text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient}`} style={{ color: 'currentColor' }} />
                      <span>Trusted by 150+ clients</span>
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-20 transition-opacity duration-500 blur-2xl`} />
                </div>

                {/* Glow effect on hover */}
                <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl -z-10`} />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.6} className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary-500/10 to-indigo-500/10 border border-white/10"
          >
            <div className="text-left">
              <p className="text-white font-semibold">Ready to elevate your content?</p>
              <p className="text-silver-400 text-sm">Let&apos;s discuss your project today</p>
            </div>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300"
            >
              Get Started
            </motion.a>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}

