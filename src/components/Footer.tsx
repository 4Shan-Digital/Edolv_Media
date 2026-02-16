'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Heart
} from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'Video Editing', href: '/services#video-editing' },
    { label: 'Motion Graphics', href: '/services#motion-graphics' },
    { label: 'Color Grading', href: '/services#color-grading' },
    { label: 'Sound Design', href: '/services#sound-design' },
    { label: 'VFX', href: '/services#vfx' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Team', href: '/about#team' },
    { label: 'Careers', href: '/careers' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/contact' },
  ],
  resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Case Studies', href: '/portfolio' },
    { label: 'FAQ', href: '/contact#faq' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/edolvmedia?igsh=MXJ2dDhsb2toc2wxaQ==', label: 'Instagram' },
  { icon: Twitter, href: 'https://x.com/Edolv_media', label: 'Twitter' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/edolv-media/', label: 'LinkedIn' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-silver-900 text-white overflow-hidden">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-blue-500" />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container-custom pt-12 pb-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 mb-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center gap-2">
                {/* Logo Image */}
                <div className="relative w-12 h-12 md:w-14 md:h-14 scale-[1.8] md:scale-[2]">
                  <Image
                    src="/images/E logo.png"
                    alt="Edolv Media"
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Logo Text */}
                <div className="flex flex-col items-center leading-none">
                  <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
                    EDOLV
                  </span>
                  <span className="text-[9px] md:text-[11px] font-medium tracking-[0.3em] mt-0 text-silver-300">
                    MEDIA
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-silver-400 max-w-sm mb-4 leading-relaxed text-sm">
              We craft compelling visual stories that captivate audiences and elevate brands. 
              Premium video editing services for creators and businesses worldwide.
            </p>
            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-silver-400 hover:text-white hover:bg-primary-500/20 hover:border-primary-500/50 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Services
            </h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-silver-400 hover:text-primary-400 transition-colors duration-300 text-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-silver-400 hover:text-primary-400 transition-colors duration-300 text-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:connect@edolv.com"
                  className="flex items-start gap-2 text-silver-400 hover:text-primary-400 transition-colors duration-300 text-xs"
                >
                  <Mail className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  connect@edolv.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+916260758318"
                  className="flex items-start gap-2 text-silver-400 hover:text-primary-400 transition-colors duration-300 text-xs"
                >
                  <Phone className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  +91 6260758318
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-silver-400 text-xs">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>
                    Shop 8 Palm City market<br />
                    Mohali Punjab , 140301
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-silver-500">
          <p className="flex items-center gap-1">
            © {currentYear} Edolv Media. Made with 
            <Heart className="w-3 h-3 text-primary-400 fill-primary-400" />
            All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

