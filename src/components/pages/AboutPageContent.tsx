'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, 
  Target, 
  Heart, 
  Zap,
  Award,
  ArrowRight,
  Linkedin,
  Twitter,
  Play
} from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/Animations';

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

const team = [
  {
    name: 'Alex Thompson',
    role: 'Founder & Creative Director',
    image: '/images/team/team-1.jpg',
    bio: '15+ years in video production. Former lead editor at major film studio.',
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Sarah Chen',
    role: 'Lead Motion Designer',
    image: '/images/team/team-2.jpg',
    bio: 'Award-winning animator with expertise in 2D and 3D motion graphics.',
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Marcus Williams',
    role: 'Senior Video Editor',
    image: '/images/team/team-3.jpg',
    bio: 'Documentary specialist with work featured on major streaming platforms.',
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Emily Rodriguez',
    role: 'Colorist',
    image: '/images/team/team-4.jpg',
    bio: 'Color grading expert trained at the American Film Institute.',
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'David Park',
    role: 'Sound Designer',
    image: '/images/team/team-5.jpg',
    bio: 'Audio engineer with credits on Emmy-winning productions.',
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Jessica Martinez',
    role: 'Project Manager',
    image: '/images/team/team-6.jpg',
    bio: 'Ensures every project runs smoothly from concept to delivery.',
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
];

const milestones = [
  { year: '2014', title: 'Founded', description: 'Edolv Media was born in a small studio with a big vision.' },
  { year: '2016', title: 'First Major Client', description: 'Landed our first Fortune 500 client and expanded our team.' },
  { year: '2018', title: 'Award Winning', description: 'Won our first industry award for documentary editing.' },
  { year: '2020', title: 'Global Expansion', description: 'Expanded to serve clients across 20+ countries.' },
  { year: '2022', title: '500+ Projects', description: 'Celebrated completion of over 500 successful projects.' },
  { year: '2024', title: 'Industry Leader', description: 'Recognized as a leader in premium video production.' },
];

export default function AboutPageContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-mesh" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl"
        />

        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6">
                <Users className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-primary-700">About Us</span>
              </span>
              <h1 className="heading-xl text-silver-900 mb-6">
                We're <span className="gradient-text">Storytellers</span> at Heart
              </h1>
              <p className="text-body text-lg mb-6">
                Edolv Media was founded with a simple mission: to help creators and businesses 
                tell their stories through the power of video. What started as a small team of 
                passionate editors has grown into a full-service video production company.
              </p>
              <p className="text-body mb-8">
                Today, we work with clients around the world, from startups to Fortune 500 
                companies, content creators to filmmakers. Our commitment to quality, creativity, 
                and client satisfaction remains at the core of everything we do.
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
                <div className="absolute -inset-4 bg-gradient-to-br from-primary-100 via-silver-100 to-indigo-100 rounded-3xl opacity-60" />
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-silver-200 shadow-soft-xl">
                  {/* Placeholder for about video/image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-silver-700 to-silver-900 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-soft-lg"
                    >
                      <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-silver-50">
        <div className="container-custom">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block text-sm font-medium text-primary-600 uppercase tracking-wider mb-4">
              Our Values
            </span>
            <h2 className="heading-lg text-silver-900 mb-4">
              What <span className="gradient-text">Drives Us</span>
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              Our core values shape how we work, collaborate, and deliver results for our clients.
            </p>
          </ScrollReveal>

          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-8 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300 h-full"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-indigo-100 mb-5"
                  >
                    <value.icon className="w-7 h-7 text-primary-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-silver-900 mb-3">{value.title}</h3>
                  <p className="text-silver-600">{value.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block text-sm font-medium text-primary-600 uppercase tracking-wider mb-4">
              Our Team
            </span>
            <h2 className="heading-lg text-silver-900 mb-4">
              Meet the <span className="gradient-text">Creatives</span>
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              A talented team of editors, designers, and storytellers dedicated to bringing your vision to life.
            </p>
          </ScrollReveal>

          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group bg-silver-50 rounded-2xl p-6 hover:bg-white hover:shadow-soft-lg transition-all duration-300"
                >
                  {/* Avatar */}
                  <div className="relative mb-5 overflow-hidden rounded-xl aspect-square bg-silver-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-indigo-400/20 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white/50">{member.name.charAt(0)}</span>
                    </div>
                    {/* Social overlay on hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="flex gap-2">
                        <a
                          href={member.social.linkedin}
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a
                          href={member.social.twitter}
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  </div>

                  {/* Info */}
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

      {/* Timeline Section */}
      <section className="section-padding bg-silver-50">
        <div className="container-custom">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block text-sm font-medium text-primary-600 uppercase tracking-wider mb-4">
              Our Journey
            </span>
            <h2 className="heading-lg text-silver-900 mb-4">
              <span className="gradient-text">Milestones</span> Along the Way
            </h2>
          </ScrollReveal>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-indigo-500 to-blue-500" />

            {milestones.map((milestone, index) => (
              <ScrollReveal
                key={milestone.year}
                delay={index * 0.1}
                direction={index % 2 === 0 ? 'left' : 'right'}
              >
                <div className={`relative flex gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Year badge */}
                  <div className="hidden md:flex w-1/2 items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white font-bold shadow-glow"
                    >
                      {milestone.year}
                    </motion.div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-primary-500 z-10" />

                  {/* Content */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0">
                    <div className="bg-white rounded-2xl p-6 shadow-soft">
                      <span className="md:hidden inline-block px-3 py-1 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 text-white text-sm font-bold mb-3">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-semibold text-silver-900 mb-2">{milestone.title}</h3>
                      <p className="text-silver-600">{milestone.description}</p>
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
        <div className="container-custom relative z-10 text-center">
          <ScrollReveal>
            <Award className="w-16 h-16 text-primary-200 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Join Our Story?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-10">
              Whether you want to work with us or join our team, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold text-lg shadow-soft-lg hover:shadow-glow-lg transition-all duration-300 flex items-center"
                >
                  Start a Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </Link>
              <Link href="/careers">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-transparent text-white font-semibold text-lg border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300"
                >
                  View Open Positions
                </motion.button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

