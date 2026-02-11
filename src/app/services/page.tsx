import type { Metadata } from 'next';
import ClientLayout from '@/components/ClientLayout';
import ServicesPageContent from '@/components/pages/ServicesPageContent';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore our comprehensive video editing services including professional editing, motion graphics, color grading, sound design, VFX, and more.',
  openGraph: {
    title: 'Services | Edolv Media',
    description: 'Professional video editing services for creators and businesses.',
  },
};

export default function ServicesPage() {
  return (
    <ClientLayout>
      <ServicesPageContent />
    </ClientLayout>
  );
}

