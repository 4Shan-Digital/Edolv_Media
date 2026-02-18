import type { Metadata } from 'next';
import ClientLayout from '@/components/ClientLayout';
import ContactPageContent from '@/components/pages/ContactPageContent';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Edolv Media. Contact us for video editing services, project inquiries, or any questions.',
  alternates: {
    canonical: 'https://edolv.com/contact',
  },
  openGraph: {
    url: 'https://edolv.com/contact',
    title: 'Contact Us | Edolv Media',
    description: 'Reach out to discuss your video editing project.',
  },
};

export default function ContactPage() {
  return (
    <ClientLayout>
      <ContactPageContent />
    </ClientLayout>
  );
}

