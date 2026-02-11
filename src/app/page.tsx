import ClientLayout from '@/components/ClientLayout';
import HeroSection from '@/components/sections/HeroSection';
import ShowreelSection from '@/components/sections/ShowreelSection';
import ServicesSection from '@/components/sections/ServicesSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import ClientsSection from '@/components/sections/ClientsSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';

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
