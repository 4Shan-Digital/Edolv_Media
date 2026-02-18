import type { Metadata } from 'next';
import ClientLayout from '@/components/ClientLayout';
import PortfolioPageContent from '@/components/pages/PortfolioPageContent';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Explore our portfolio of video editing projects including corporate videos, social media content, motion graphics, and documentaries.',
  alternates: {
    canonical: 'https://edolv.com/portfolio',
  },
  openGraph: {
    url: 'https://edolv.com/portfolio',
    title: 'Portfolio | Edolv Media',
    description: 'View our latest video editing projects and creative work.',
  },
};

export default function PortfolioPage() {
  return (
    <ClientLayout>
      <PortfolioPageContent />
    </ClientLayout>
  );
}

