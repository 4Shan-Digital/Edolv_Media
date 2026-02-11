import type { Metadata } from 'next';
import ClientLayout from '@/components/ClientLayout';
import CareersPageContent from '@/components/pages/CareersPageContent';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the Edolv Media team. Explore open positions and be part of a creative team that produces stunning video content.',
  openGraph: {
    title: 'Careers | Edolv Media',
    description: 'Join our team of creative professionals at Edolv Media.',
  },
};

export default function CareersPage() {
  return (
    <ClientLayout>
      <CareersPageContent />
    </ClientLayout>
  );
}
