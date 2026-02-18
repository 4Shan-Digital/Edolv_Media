import type { Metadata } from 'next';
import ClientLayout from '@/components/ClientLayout';
import AboutPageContent from '@/components/pages/AboutPageContent';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Edolv Media, our story, mission, values, and the talented team behind our premium video editing services.',
  alternates: {
    canonical: 'https://edolv.com/about',
  },
  openGraph: {
    url: 'https://edolv.com/about',
    title: 'About Us | Edolv Media',
    description: 'Discover the story behind Edolv Media and meet our creative team.',
  },
};

export default function AboutPage() {
  return (
    <ClientLayout>
      <AboutPageContent />
    </ClientLayout>
  );
}

