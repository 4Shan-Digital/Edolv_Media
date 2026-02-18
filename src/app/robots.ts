import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/*.ico',
        '/*.json',
        '/*.xml',
        '/_next/',
      ],
    },
    sitemap: 'https://edolv.com/sitemap.xml',
  };
}

