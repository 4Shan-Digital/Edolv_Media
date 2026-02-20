'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Clock,
  ArrowRight,
  Heart,
  Zap,
  Users,
  Globe,
  Rocket,
  Target,
  TrendingUp,
  Star,
  Loader2,
  X,
  Check,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  ListChecks
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/Animations';

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  isUrgent?: boolean;
  priority?: number;
}

const perks = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance and wellness programs.',
  },
  {
    icon: Zap,
    title: 'Latest Tools',
    description: 'Access to cutting-edge software and equipment.',
  },
  {
    icon: Globe,
    title: 'Global Team',
    description: 'Collaborate with talented people worldwide.',
  },
];

export default function CareersPageContent() {
  const [hoveredJob, setHoveredJob] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    portfolioUrl: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        if (data.success) {
          // Enforce correct order client-side as a safeguard:
          // 1. urgent jobs first, 2. higher priority first, 3. newest first
          const sorted = [...data.data].sort((a: Job, b: Job) => {
            if (a.isUrgent && !b.isUrgent) return -1;
            if (!a.isUrgent && b.isUrgent) return 1;
            const pa = a.priority ?? 0;
            const pb = b.priority ?? 0;
            if (pb !== pa) return pb - pa;
            return 0;
          });
          setJobs(sorted);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    fetchJobs();
  }, []);

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob || !resumeFile) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formData = new FormData();
      formData.append('jobId', applyingJob._id);
      formData.append('name', applicationForm.name);
      formData.append('email', applicationForm.email);
      formData.append('phone', applicationForm.phone);
      formData.append('coverLetter', applicationForm.coverLetter);
      formData.append('portfolioUrl', applicationForm.portfolioUrl);
      formData.append('resume', resumeFile);

      const res = await fetch('/api/applications', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setSubmitStatus('success');
        setSubmitMessage('Application submitted successfully! Check your email for confirmation.');
        setTimeout(() => {
          setApplyingJob(null);
          setApplicationForm({ name: '', email: '', phone: '', coverLetter: '', portfolioUrl: '' });
          setResumeFile(null);
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'Failed to submit application');
      }
    } catch {
      setSubmitStatus('error');
      setSubmitMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pt-36 md:pb-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-cyan-50" />
        
        {/* Floating orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-300/30 to-purple-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-300/30 to-blue-300/30 rounded-full blur-3xl"
        />

        {/* Sparkles */}
        {[...Array(15)].map((_, i) => (
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
            }}
            className="absolute w-1 h-1 bg-primary-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        <div className="container-custom relative">
          <ScrollReveal className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 mb-6 shadow-2xl shadow-violet-500/50 relative"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 blur-xl opacity-50"
              />
              <Rocket className="w-10 h-10 text-white relative z-10" />
            </motion.div>

            <h1 className="heading-xl text-gray-900 mb-6">
              Build Your <span className="gradient-text">Dream Career</span> With Us
            </h1>
            <p className="text-body text-lg max-w-2xl mx-auto mb-8">
              Join a team of passionate creatives who are shaping the future of video production. 
              We're always looking for exceptional talent to create extraordinary content.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
              {[
                { icon: Users, label: 'Team Members', value: '10+' },
                { icon: Target, label: 'Projects Done', value: '20000+' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <a href="#openings">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4"
              >
                Explore Opportunities
                <TrendingUp className="w-5 h-5 ml-2" />
              </motion.button>
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-10 md:py-12 bg-gradient-to-br from-slate-50 via-white to-violet-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            animate={{ x: [-100, 100, -100], y: [-50, 50, -50] }}
            transition={{ duration: 30, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full blur-3xl"
          />
        </div>

        <div className="container-custom relative">
          <ScrollReveal className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-6 shadow-lg shadow-amber-500/50"
            >
              <Star className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="heading-lg text-gray-900 mb-4">Why You'll Love Working Here</h2>
            <p className="text-body max-w-2xl mx-auto">
              We've built an environment where creativity flourishes and careers soar. Here's what makes us different.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, index) => (
              <ScrollReveal key={perk.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl hover:shadow-2xl overflow-hidden"
                >
                  {/* Animated gradient background on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-primary-50 via-indigo-50 to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  
                  <div className="relative">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-600 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30 group-hover:shadow-2xl group-hover:shadow-primary-500/50 transition-shadow"
                    >
                      <perk.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:gradient-text transition-all">{perk.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{perk.description}</p>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Work Culture Section */}
      <section className="py-4 bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <motion.a
              href="https://www.instagram.com/edolvunfiltered?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              className="group max-w-2xl mx-auto flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 border border-pink-200/60 shadow-md hover:shadow-lg hover:shadow-pink-500/15 transition-all duration-300 cursor-pointer"
            >
              {/* Instagram icon */}
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-sm">
                <svg className="w-4.5 h-4.5 w-[18px] h-[18px] text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-pink-600 transition-colors truncate">
                  See Our Work Culture
                </p>
                <p className="text-xs text-gray-500 truncate">@edolvunfiltered — real moments, unfiltered</p>
              </div>

              {/* Arrow */}
              <ArrowRight className="flex-shrink-0 w-4 h-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </ScrollReveal>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-10 md:py-12 bg-white relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 40, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-indigo-100/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 35, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-violet-100/40 to-purple-100/40 rounded-full blur-3xl"
        />

        <div className="container-custom relative">
          <ScrollReveal className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 150 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 via-indigo-600 to-purple-700 mb-6 shadow-lg shadow-primary-500/50"
            >
              <Briefcase className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="heading-lg text-gray-900 mb-4">
              Open Your Next <span className="gradient-text">Chapter</span>
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              Ready to make an impact? Explore our open positions and find your perfect role.
            </p>
          </ScrollReveal>

          {/* Jobs Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : (
          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
          >
            <AnimatePresence mode="popLayout">
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.05,
                    layout: { type: "spring", stiffness: 300, damping: 30 }
                  }}
                  onHoverStart={() => setHoveredJob(job._id)}
                  onHoverEnd={() => setHoveredJob(null)}
                  className="group relative"
                >
                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative h-full p-6 rounded-3xl bg-white border border-gray-200/50 shadow-xl hover:shadow-2xl overflow-hidden transition-shadow"
                  >
                    {/* Gradient overlay on hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredJob === job._id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50"
                    />
                    
                    {/* Corner decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-100/20 to-transparent rounded-bl-full" />
                    
                    <div className="relative flex flex-col h-full">
                      {/* Top badges row */}
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500 to-indigo-600 text-white text-xs font-medium shadow-lg shadow-primary-500/30"
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          {job.department}
                        </motion.div>
                        {job.isUrgent && (
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold shadow-lg shadow-red-500/40"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            Urgent Hiring
                          </motion.div>
                        )}
                      </div>

                      {/* Job Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:gradient-text transition-all">
                        {job.title}
                      </h3>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-primary-500" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-primary-500" />
                          {job.type}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Requirements */}
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <ListChecks className="w-3.5 h-3.5 text-violet-500" />
                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Requirements</span>
                          </div>
                          <ul className="space-y-1">
                            {job.requirements.slice(0, 3).map((req, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                                <span className="line-clamp-1">{req}</span>
                              </li>
                            ))}
                            {job.requirements.length > 3 && (
                              <li className="text-xs text-violet-500 font-medium pl-3">+{job.requirements.length - 3} more</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Responsibilities */}
                      {job.responsibilities && job.responsibilities.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Responsibilities</span>
                          </div>
                          <ul className="space-y-1">
                            {job.responsibilities.slice(0, 3).map((resp, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                                <span className="line-clamp-1">{resp}</span>
                              </li>
                            ))}
                            {job.responsibilities.length > 3 && (
                              <li className="text-xs text-indigo-500 font-medium pl-3">+{job.responsibilities.length - 3} more</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Buttons Row */}
                      <div className="flex gap-2 mt-auto">
                        <motion.button
                          onClick={() => setViewingJob(job)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary-500/40 text-primary-600 font-medium text-sm hover:bg-primary-50 transition-all"
                        >
                          <FileText className="w-4 h-4" />
                          View Full JD
                        </motion.button>
                        <motion.button
                          onClick={() => setApplyingJob(job)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                        >
                          Apply Now
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Hover shine effect */}
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: hoveredJob === job._id ? '100%' : '-100%' }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          )}

          {/* No results message */}
          {jobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No positions found</h3>
              <p className="text-gray-600">Try selecting a different department</p>
            </motion.div>
          )}

          {/* No suitable position */}
          <ScrollReveal className="text-center mt-16">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10 max-w-2xl mx-auto shadow-xl border border-gray-200/50 relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/30 to-purple-100/30 rounded-full blur-2xl"
              />
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Don't see the <span className="gradient-text">Perfect Role</span> for You?
                </h3>
                <p className="text-gray-600 mb-4">
                  We're always excited to connect with talented individuals. Share your resume and portfolio with us, and we'll consider you for future opportunities.
                </p>
                <p className="text-gray-800 font-semibold text-lg">
                  Email your details to:{' '}
                  <a href="mailto:connect@edolv.com" className="gradient-text hover:underline">
                    connect@edolv.com
                  </a>
                </p>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* Full JD Modal */}
      <AnimatePresence>
        {viewingJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setViewingJob(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-indigo-600 text-white text-xs font-medium">
                      <Briefcase className="w-3 h-3" />
                      {viewingJob.department}
                    </span>
                    {viewingJob.isUrgent && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold">
                        <AlertCircle className="w-3 h-3" />
                        Urgent Hiring
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mt-1">{viewingJob.title}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-primary-500" />{viewingJob.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-primary-500" />{viewingJob.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setViewingJob(null)}
                  className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">About the Role</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{viewingJob.description}</p>
                </div>

                {/* Requirements */}
                {viewingJob.requirements && viewingJob.requirements.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <ListChecks className="w-3.5 h-3.5 text-violet-600" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Requirements</h3>
                    </div>
                    <ul className="space-y-2">
                      {viewingJob.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Responsibilities */}
                {viewingJob.responsibilities && viewingJob.responsibilities.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Responsibilities</h3>
                    </div>
                    <ul className="space-y-2">
                      {viewingJob.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl">
                <motion.button
                  onClick={() => { setViewingJob(null); setApplyingJob(viewingJob); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl transition-all"
                >
                  Apply for this Role
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Modal */}
      <AnimatePresence>
        {applyingJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !isSubmitting && setApplyingJob(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6 md:p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => !isSubmitting && setApplyingJob(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-1">Apply for Position</h2>
              <p className="text-gray-500 mb-6">{applyingJob.title} - {applyingJob.department}</p>

              {submitStatus === 'success' ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Submitted!</h3>
                  <p className="text-gray-600">{submitMessage}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={applicationForm.name}
                        onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={applicationForm.email}
                        onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={applicationForm.phone}
                      onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="+1 (234) 567-890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume *</label>
                    <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-300 cursor-pointer transition-colors">
                      {resumeFile ? (
                        <>
                          <FileText className="w-5 h-5 text-primary-500" />
                          <span className="text-sm text-gray-700">{resumeFile.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-500">Upload resume (PDF, DOC, DOCX - max 10MB)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
                    <input
                      type="url"
                      value={applicationForm.portfolioUrl}
                      onChange={(e) => setApplicationForm({ ...applicationForm, portfolioUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                    <textarea
                      rows={4}
                      value={applicationForm.coverLetter}
                      onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                      placeholder="Tell us why you'd be a great fit..."
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{submitMessage}</p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !resumeFile}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

