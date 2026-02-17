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
  FileText
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

const departments = ['All', 'Production', 'Creative', 'Post-Production', 'Operations'];

export default function CareersPageContent() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [hoveredJob, setHoveredJob] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
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
        const params = new URLSearchParams();
        if (selectedDepartment !== 'All') params.set('department', selectedDepartment);
        const res = await fetch(`/api/jobs?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setJobs(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    fetchJobs();
  }, [selectedDepartment]);

  const filteredJobs = jobs;

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
          <ScrollReveal className="text-center mb-12">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 150 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 via-indigo-600 to-purple-700 mb-6 shadow-lg shadow-primary-500/50"
            >
              <Briefcase className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="heading-lg text-gray-900 mb-6">
              Open Your Next <span className="gradient-text">Chapter</span>
            </h2>
            <p className="text-body max-w-2xl mx-auto mb-8">
              Ready to make an impact? Explore our open positions and find your perfect role.
            </p>
            
            {/* Department Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {departments.map((dept) => (
                <motion.button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                    selectedDepartment === dept
                      ? 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {dept}
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {/* Jobs Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : (
          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, index) => (
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
                    
                    <div className="relative">
                      {/* Department Badge */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500 to-indigo-600 text-white text-xs font-medium mb-4 shadow-lg shadow-primary-500/30"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        {job.department}
                      </motion.div>

                      {/* Job Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:gradient-text transition-all">
                        {job.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Meta Info */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4 text-primary-500" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4 text-primary-500" />
                          {job.type}
                        </div>
                      </div>

                      {/* View Details Button */}
                      <motion.button
                        onClick={() => setApplyingJob(job)}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>

                      {/* Quick Info Pills */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-medium">
                          {job.requirements.length} Requirements
                        </span>
                        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                          {job.responsibilities.length} Responsibilities
                        </span>
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
          {filteredJobs.length === 0 && (
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
                  Don't See Your <span className="gradient-text">Perfect Role</span>?
                </h3>
                <p className="text-gray-600 mb-4">
                  We're always interested in meeting talented people. Send us your resume and portfolio, 
                  and we'll keep you in mind for future opportunities.
                </p>
                <p className="text-gray-800 font-semibold text-lg">
                  Send your resume to{' '}
                  <a href="mailto:connect@edolv.com" className="gradient-text hover:underline">
                    connect@edolv.com
                  </a>
                </p>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

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

