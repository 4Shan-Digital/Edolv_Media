/**
 * Structured Data (Schema.org) for SEO
 * 
 * This file contains JSON-LD schemas to help search engines
 * understand your website content better.
 */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Edolv Media",
  "url": "https://edolv.com",
  "logo": "https://edolv.com/images/Edolv png.png",
  "description": "Transform your vision into stunning reality with Edolv Media. Premium video editing, motion graphics, color grading, and sound design services for creators and businesses worldwide.",
  "foundingDate": "2020",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN" // Update with your actual country code
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "url": "https://edolv.com/contact"
  },
  "sameAs": [
    "https://www.instagram.com/edolvmedia?igsh=MXJ2dDhsb2toc2wxaQ==",
    "https://x.com/Edolv_media"
    // Add more social media URLs as needed
    // "https://www.youtube.com/@edolvmedia",
    // "https://www.linkedin.com/company/edolvmedia",
    // "https://twitter.com/edolvmedia"
  ]
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Video Production & Editing",
  "provider": {
    "@type": "Organization",
    "name": "Edolv Media"
  },
  "areaServed": {
    "@type": "Place",
    "name": "Worldwide"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Video Production Services",
    "itemListElement": [
      {
        "@type": "OfferCatalog",
        "name": "Video Editing",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Professional Video Editing",
              "description": "Expert video editing services for content creators, businesses, and productions."
            }
          }
        ]
      },
      {
        "@type": "OfferCatalog",
        "name": "Motion Graphics",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Motion Graphics & Animation",
              "description": "Eye-catching motion graphics and animations for your videos."
            }
          }
        ]
      },
      {
        "@type": "OfferCatalog",
        "name": "Color Grading",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Professional Color Grading",
              "description": "Cinematic color grading to enhance your video's visual appeal."
            }
          }
        ]
      },
      {
        "@type": "OfferCatalog",
        "name": "Sound Design",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Audio & Sound Design",
              "description": "Professional audio mixing and sound design for immersive experiences."
            }
          }
        ]
      }
    ]
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Edolv Media",
  "url": "https://edolv.com",
  "description": "Premium Video Editing and Production Services",
  "publisher": {
    "@type": "Organization",
    "name": "Edolv Media"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://edolv.com/?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// For blog posts or portfolio items
export const creativeWorkSchema = (work: {
  name: string;
  description: string;
  image: string;
  url: string;
  datePublished?: string;
  category?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": work.name,
  "description": work.description,
  "image": work.image,
  "url": work.url,
  "datePublished": work.datePublished,
  "genre": work.category,
  "creator": {
    "@type": "Organization",
    "name": "Edolv Media"
  }
});
