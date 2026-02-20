'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, 
  Target, 
  Heart, 
  Zap,
  Award,
  ArrowRight,
  Play,
  Linkedin,
  Twitter,
  Instagram
} from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/Animations';
import VideoPlayerModal from '@/components/ui/VideoPlayerModal';

interface AboutVideo {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl: string;
}

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  order: number;
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

const values = [
  {
    icon: Heart,
    title: 'Passion',
    description: 'We love what we do. Every project is an opportunity to create something extraordinary.',
  },
  {
    icon: Target,
    title: 'Excellence',
    description: 'We hold ourselves to the highest standards, never settling for anything less than exceptional.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We believe in working closely with our clients, turning their vision into reality together.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We stay ahead of trends, constantly exploring new techniques and technologies.',
  },
];

/* Team data - Commented out since Team section is disabled
const team: TeamMember[] = [
  {
    _id: 'fallback-1',
    name: 'Alex Thompson',
    role: 'Founder & Creative Director',
    imageUrl: '/images/team/team-1.jpg',
    bio: '15+ years in video production. Former lead editor at major film studio.',
    order: 1,
    social: {
      linkedin: '#',
      twitter: '#',
      instagram: '#',
    },
  },
  {
    _id: 'fallback-2',
    name: 'Sarah Chen',
    role: 'Lead Motion Designer',
    imageUrl: '/images/team/team-2.jpg',
    bio: 'Award-winning animator with expertise in 2D and 3D motion graphics.',
    order: 2,
    social: {
      linkedin: '#',
      twitter: '#',
      instagram: '#',
    },
  },
  {
    _id: 'fallback-3',
    name: 'Marcus Williams',
    role: 'Senior Video Editor',
    imageUrl: '/images/team/team-3.jpg',
    bio: 'Documentary specialist with work featured on major streaming platforms.',
    order: 3,
    social: {
      linkedin: '#',
      twitter: '#',
      instagram: '#',
    },
  },
  {
    _id: 'fallback-4',
    name: 'Emily Rodriguez',
    role: 'Colorist',
    imageUrl: '/images/team/team-4.jpg',
    bio: 'Color grading expert trained at the American Film Institute.',
    order: 4,
    social: {
      linkedin: '#',
      twitter: '#',
      instagram: '#',
    },
  },
  {
    _id: 'fallback-5',
    name: 'David Park',
    role: 'Sound Designer',
    imageUrl: '/images/team/team-5.jpg',
    bio: 'Audio engineer with credits on Emmy-winning productions.',
    order: 5,
    social: {
      linkedin: '#',
      twitter: '#',
      instagram: '#',
    },
  },
  {
    _id: 'fallback-6',
    name: 'Jessica Martinez',
    role: 'Project Manager',
    imageUrl: '/images/team/team-6.jpg',
    bio: 'Ensures every project runs smoothly from concept to delivery.',
    order: 6,
    social: {
      linkedin: '#',
      twitter: '#',
      instagram: '#',
    },
  },
];
*/

const milestones = [
  { year: 'Nov 2023', title: 'Founded', description: 'Edolv Media was born in a small studio with a big vision.' },
  { year: 'June 2024', title: '100th Client', description: 'Completed onboarding for 100th Client' },
  { year: 'Dec 2024', title: 'Offline Presence', description: 'First offline presence in Gurgaon' },
  { year: 'May 2025', title: 'Global Expansion', description: ' Global Expansion, serving clients from 5+ countries.' },
  { year: 'June 2025', title: 'Major Client', description: 'Got our first Major Client and expanded our team' },
  { year: 'Dec 2025', title: 'Official Office', description: 'First official Office in Mohali, Punjab' },
];

export default function AboutPageContent() {
  const [aboutVideo, setAboutVideo] = useState<AboutVideo | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    // Fetch about video
    const fetchAboutVideo = async () => {
      try {
        const res = await fetch('/api/about-video');
        const data = await res.json();
        if (data.success && data.data) {
          setAboutVideo(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch about video:', err);
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const res = await fetch('/api/team');
        const data = await res.json();
        if (data.success && data.data) {
          setTeamMembers(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch team members:', err);
      }
    };

    fetchAboutVideo();
    fetchTeamMembers();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pt-36 md:pb-16 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-mesh" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl"
        />

        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <ScrollReveal direction="left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-5">
                <Users className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-primary-700">About Us</span>
              </span>
              <h1 className="heading-xl text-silver-900 mb-5">
                We're <span className="gradient-text">Storytellers</span> at Heart
              </h1>
              <p className="text-body text-lg mb-7">
                Edolv Media was founded with a simple mission: to help creators and businesses 
                tell their stories through the power of video. What started as a small team of 
                passionate editors has grown into a full-service video production company.
              </p>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary"
                >
                  Work With Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.button>
              </Link>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-primary-100 via-silver-100 to-indigo-100 rounded-3xl opacity-60" />
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-silver-200 shadow-soft-xl">
                  {aboutVideo ? (
                    <>
                      <img
                        src={aboutVideo.thumbnailUrl}
                        alt={aboutVideo.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          console.log('Failed to load video thumbnail:', aboutVideo.thumbnailUrl);
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <motion.button
                          onClick={() => setIsVideoModalOpen(true)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-soft-lg"
                        >
                          <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-silver-700 to-silver-900 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-soft-lg"
                      >
                        <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 md:py-12 bg-silver-50">
        <div className="container-custom">
          <ScrollReveal className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-sm text-primary-700 font-medium mb-3">
              Our Values
            </span>
            <h2 className="heading-lg text-silver-900 mb-3">
              What <span className="gradient-text">Drives Us</span>
            </h2>
            <p className="text-body max-w-xl mx-auto">
              Our core values shape how we work, collaborate, and deliver results.
            </p>
          </ScrollReveal>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-6 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300 h-full"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-indigo-100 mb-4"
                  >
                    <value.icon className="w-6 h-6 text-primary-600" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-silver-900 mb-2">{value.title}</h3>
                  <p className="text-silver-600 text-sm">{value.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team Section */}
      {teamMembers.length > 0 && (
      <section className="py-14 md:py-18">
        <div className="container-custom">
          <ScrollReveal className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-sm text-primary-700 font-medium mb-3">
              Our Team
            </span>
            <h2 className="heading-lg text-silver-900 mb-4">
              Meet the <span className="gradient-text">Team</span>
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              Talented individuals working together to create amazing results.
            </p>
          </ScrollReveal>

          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <StaggerItem key={member._id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group bg-silver-50 rounded-2xl p-6 hover:bg-white hover:shadow-soft-lg transition-all duration-300"
                >
                  <div className="relative mb-5 overflow-hidden rounded-xl aspect-square bg-silver-200">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={member.imageUrl ? "absolute inset-0 bg-gradient-to-br from-primary-400/20 to-indigo-400/20 items-center justify-center hidden" : "absolute inset-0 bg-gradient-to-br from-primary-400/20 to-indigo-400/20 flex items-center justify-center"}>
                      <span className="text-6xl font-bold text-white/50">{member.name.charAt(0)}</span>
                    </div>
                    {member.social && (member.social.linkedin || member.social.twitter || member.social.instagram) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          {member.social.linkedin && (
                            <a
                              href={member.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          {member.social.twitter && (
                            <a
                              href={member.social.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                              <Twitter className="w-4 h-4" />
                            </a>
                          )}
                          {member.social.instagram && (
                            <a
                              href={member.social.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                              <Instagram className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-silver-900 mb-1 group-hover:text-primary-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-silver-600 text-sm">{member.bio}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
      )}

      {/* Timeline Section - Zigzag Cards */}
      <section className="py-10 md:py-12 bg-silver-50 overflow-hidden">
        <div className="container-custom">
          <ScrollReveal className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-sm text-primary-700 font-medium mb-4">
              Our Journey
            </span>
            <h2 className="heading-lg text-silver-900 mb-3">
              <span className="gradient-text">Milestones</span> Along the Way
            </h2>
          </ScrollReveal>

          <div className="max-w-5xl mx-auto space-y-4 md:space-y-0">
            {milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              const colors = [
                { bg: 'from-violet-500 to-purple-600', light: 'bg-violet-50', border: 'border-violet-200', badge: 'from-violet-500 to-purple-600' },
                { bg: 'from-cyan-500 to-blue-600', light: 'bg-cyan-50', border: 'border-cyan-200', badge: 'from-cyan-500 to-blue-600' },
                { bg: 'from-amber-500 to-orange-600', light: 'bg-amber-50', border: 'border-amber-200', badge: 'from-amber-500 to-orange-600' },
                { bg: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50', border: 'border-emerald-200', badge: 'from-emerald-500 to-teal-600' },
                { bg: 'from-pink-500 to-rose-600', light: 'bg-pink-50', border: 'border-pink-200', badge: 'from-pink-500 to-rose-600' },
                { bg: 'from-indigo-500 to-blue-600', light: 'bg-indigo-50', border: 'border-indigo-200', badge: 'from-indigo-500 to-blue-600' },
              ];
              const color = colors[index % colors.length];

              return (
                <ScrollReveal
                  key={milestone.year}
                  delay={index * 0.1}
                  direction={isEven ? 'left' : 'right'}
                >
                  <div className={`flex flex-col md:flex-row items-stretch gap-4 md:gap-8 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                    {/* Card */}
                    <motion.div
                      whileHover={{ y: -3, scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`flex-1 relative p-5 md:p-7 rounded-2xl border ${color.border} ${color.light} hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`flex-shrink-0 px-4 py-2 rounded-xl bg-gradient-to-br ${color.badge} text-white font-bold text-sm shadow-lg`}
                        >
                          {milestone.year}
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-silver-900 mb-1">{milestone.title}</h3>
                          <p className="text-silver-600 text-sm leading-relaxed">{milestone.description}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Empty spacer for zigzag */}
                    <div className="hidden md:block flex-1" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-10 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800" />
        <div className="container-custom relative z-10 text-center">
          <ScrollReveal>
            <Award className="w-12 h-12 text-primary-200 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Join Our Story?
            </h2>
            <p className="text-lg text-primary-100 max-w-xl mx-auto mb-8">
              Whether you want to work with us or join our team, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-7 py-3.5 rounded-xl bg-white text-primary-700 font-semibold text-base shadow-soft-lg hover:shadow-glow-lg transition-all duration-300 flex items-center"
                >
                  Start a Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </Link>
              <Link href="/careers">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-7 py-3.5 rounded-xl bg-transparent text-white font-semibold text-base border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300"
                >
                  View Open Positions
                </motion.button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Video Modal */}
      {aboutVideo && (
        <VideoPlayerModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={aboutVideo.videoUrl}
          title={aboutVideo.title}
          description={aboutVideo.description}
        />
      )}
    </>
  );
}

