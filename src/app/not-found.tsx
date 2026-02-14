import Link from 'next/link';
import ClientLayout from '@/components/ClientLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <ClientLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Visual */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              404
            </h1>
          </div>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-300"
            >
              Go Home
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 border border-white/10 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-gray-400 mb-4">You might be interested in:</p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link href="/services" className="text-violet-400 hover:text-violet-300 transition-colors">
                Our Services
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/portfolio" className="text-violet-400 hover:text-violet-300 transition-colors">
                Portfolio
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/about" className="text-violet-400 hover:text-violet-300 transition-colors">
                About Us
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/careers" className="text-violet-400 hover:text-violet-300 transition-colors">
                Careers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
