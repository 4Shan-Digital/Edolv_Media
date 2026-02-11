'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  Check,
  Loader2,
  ChevronDown,
  MessageSquare,
  Instagram,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/Animations';

const services = [
  'Video Editing',
  'Motion Graphics',
  'Color Grading',
  'Sound Design',
  'VFX',
  'Social Media Content',
  'Corporate Videos',
  'YouTube Production',
  'Other',
];

const faqs = [
  {
    question: 'What is your typical turnaround time?',
    answer: 'Our standard turnaround is 3-5 business days for most projects. However, we offer rush delivery options for time-sensitive projects. Complex projects may require additional time, which we\'ll discuss during our initial consultation.',
  },
  {
    question: 'How do you handle revisions?',
    answer: 'We include 2-3 rounds of revisions in our packages. We believe in getting it right, so we work closely with you until you\'re 100% satisfied. Additional revision rounds can be arranged if needed.',
  },
  {
    question: 'What file formats do you accept?',
    answer: 'We accept all major video formats including MP4, MOV, AVI, ProRes, and RAW formats. We can work with footage from any camera system. If you\'re unsure about your files, just send them over and we\'ll figure it out.',
  },
  {
    question: 'How do I send you my footage?',
    answer: 'We provide secure cloud upload links for your files. For larger projects, we also support physical hard drive delivery. We use enterprise-grade security to protect your content.',
  },
  {
    question: 'Do you offer ongoing packages?',
    answer: 'Yes! We offer monthly retainer packages for clients with regular video editing needs. These packages come with discounted rates and priority turnaround times. Contact us to learn more.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, bank transfers, and PayPal. For larger projects, we typically require a 50% deposit to begin work, with the remainder due upon completion.',
  },
];

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'hello@Edolvmedia.com',
    link: 'mailto:hello@Edolvmedia.com',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+1 (234) 567-890',
    link: 'tel:+1234567890',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: '123 Creative Street, New York, NY 10001',
    link: '#',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    value: 'Mon - Fri: 9AM - 6PM EST',
    link: '#',
  },
];

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function ContactPageContent() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormState({ name: '', email: '', phone: '', service: '', message: '' });
        }, 3000);
      } else {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-mesh" />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-1/4 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl"
        />

        <div className="container-custom relative">
          <ScrollReveal className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6">
              <MessageSquare className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-700">Get in Touch</span>
            </span>
            <h1 className="heading-xl text-silver-900 mb-6">
              Let's <span className="gradient-text">Connect</span>
            </h1>
            <p className="text-body text-lg max-w-2xl mx-auto">
              Have a project in mind? We'd love to hear about it. Fill out the form below 
              or reach out directly, and we'll get back to you within 24 hours.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-silver-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <ScrollReveal direction="left" className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-soft">
                <h2 className="text-2xl font-semibold text-silver-900 mb-6">
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-silver-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-silver-200 bg-white text-silver-900 placeholder:text-silver-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-silver-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-silver-200 bg-white text-silver-900 placeholder:text-silver-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-silver-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-silver-200 bg-white text-silver-900 placeholder:text-silver-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="+1 (234) 567-890"
                      />
                    </div>

                    {/* Service */}
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-silver-700 mb-2">
                        Service Interested In *
                      </label>
                      <select
                        id="service"
                        required
                        value={formState.service}
                        onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-silver-200 bg-white text-silver-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-silver-700 mb-2">
                      Project Details *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-silver-200 bg-white text-silver-900 placeholder:text-silver-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your project, timeline, and any specific requirements..."
                    />
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{errorMessage}</p>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    whileHover={{ scale: isSubmitting || isSubmitted ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting || isSubmitted ? 1 : 0.98 }}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSubmitted
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-glow'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <Check className="w-5 h-5" />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </ScrollReveal>

            {/* Contact Info */}
            <ScrollReveal direction="right" className="lg:col-span-2">
              <div className="space-y-6">
                {/* Contact Cards */}
                {contactInfo.map((info) => (
                  <motion.a
                    key={info.title}
                    href={info.link}
                    whileHover={{ y: -3 }}
                    className="block bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center">
                        <info.icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-silver-900 mb-1">{info.title}</h3>
                        <p className="text-silver-600">{info.value}</p>
                      </div>
                    </div>
                  </motion.a>
                ))}

                {/* Social Links */}
                <div className="bg-gradient-to-br from-primary-600 to-indigo-600 rounded-2xl p-6 text-white">
                  <h3 className="font-semibold mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal className="text-center mb-12">
            <span className="inline-block text-sm font-medium text-primary-600 uppercase tracking-wider mb-4">
              FAQ
            </span>
            <h2 className="heading-lg text-silver-900 mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              Find answers to common questions about our services and process.
            </p>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <motion.div
                  className="mb-4"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 bg-silver-50 hover:bg-silver-100 rounded-2xl transition-colors text-left"
                  >
                    <span className="font-semibold text-silver-900 pr-4">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-silver-500 flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-silver-600">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

