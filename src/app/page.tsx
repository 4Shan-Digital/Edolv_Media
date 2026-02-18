import type { Metadata } from 'next';
import ClientLayout from '@/components/ClientLayout';
import HeroSection from '@/components/sections/HeroSection';
import ShowreelSection from '@/components/sections/ShowreelSection';
import ServicesSection from '@/components/sections/ServicesSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import ClientsSection from '@/components/sections/ClientsSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'Premium Video Editing Services | Edolv Media',
  description: 'Transform your vision into stunning reality with Edolv Media. Professional video editing, motion graphics, color grading, and post-production services for creators and businesses worldwide.',
  alternates: {
    canonical: 'https://edolv.com',
  },
  openGraph: {
    url: 'https://edolv.com',
    type: 'website',
    title: 'Premium Video Editing Services | Edolv Media',
    description: 'Transform your vision into stunning reality. Professional video editing, motion graphics, and post-production services.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Video Editing Services | Edolv Media',
    description: 'Transform your vision into stunning reality with Edolv Media.',
  },
};

export default function Home() {
  return (
    <ClientLayout>
      <HeroSection />
      <ShowreelSection />
      <ClientsSection />
      <ServicesSection />
      <PortfolioSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CTASection />
    </ClientLayout>
  );
}
